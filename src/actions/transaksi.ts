'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTransaksi() {
  try {
    const transaksi = await prisma.transaksi.findMany({
      include: {
        barang: true,
        gudang: true,
      },
      orderBy: {
        tanggal: 'desc'
      }
    });

    const items = await prisma.barang.findMany({
      orderBy: { nama_barang: 'asc' }
    });

    const gudangList = await prisma.gudang.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { nama: 'asc' }
    });

    return { 
      success: true, 
      data: transaksi,
      items: items,
      gudangList: gudangList,
    };
  } catch (error) {
    console.error('Error fetching transaksi:', error);
    return { success: false, error: 'Gagal mengambil riwayat transaksi' };
  }
}

export async function getInbound() {
  try {
    const transaksi = await prisma.transaksi.findMany({
      where: { jenis: 'IN' },
      include: {
        barang: true,
        gudang: true,
      },
      orderBy: {
        tanggal: 'desc'
      }
    });

    const items = await prisma.barang.findMany({
      orderBy: { nama_barang: 'asc' }
    });

    const gudangList = await prisma.gudang.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { nama: 'asc' }
    });

    return { 
      success: true, 
      data: transaksi,
      items: items,
      gudangList: gudangList,
    };
  } catch (error) {
    console.error('Error fetching inbound:', error);
    return { success: false, error: 'Gagal mengambil data barang masuk' };
  }
}

export async function getOutbound() {
  try {
    const transaksi = await prisma.transaksi.findMany({
      where: { jenis: 'OUT' },
      include: {
        barang: true,
        gudang: true,
      },
      orderBy: {
        tanggal: 'desc'
      }
    });

    const items = await prisma.barang.findMany({
      orderBy: { nama_barang: 'asc' }
    });

    const gudangList = await prisma.gudang.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { nama: 'asc' }
    });

    return { 
      success: true, 
      data: transaksi,
      items: items,
      gudangList: gudangList,
    };
  } catch (error) {
    console.error('Error fetching outbound:', error);
    return { success: false, error: 'Gagal mengambil data barang keluar' };
  }
}

export async function createTransaksi(formData: FormData) {
  try {
    const barangId = formData.get('barangId') as string;
    const jenis = formData.get('jenis') as string; // "IN" atau "OUT"
    const jumlah = parseInt(formData.get('jumlah') as string, 10);
    const keterangan = formData.get('keterangan') as string;
    const gudangId = (formData.get('gudangId') as string) || null;
    const supplier = (formData.get('supplier') as string) || null;
    const noPO = (formData.get('noPO') as string) || null;
    const tujuan = (formData.get('tujuan') as string) || null;
    const penerima = (formData.get('penerima') as string) || null;

    if (!barangId || !jenis || isNaN(jumlah) || jumlah <= 0) {
      return { success: false, error: 'Data tidak valid' };
    }

    // Run transaction: Create Transaksi AND Update Stok Barang
    await prisma.$transaction(async (tx) => {
      // 1. Dapatkan stok saat ini
      const barang = await tx.barang.findUnique({ where: { id: barangId } });
      if (!barang) throw new Error('Barang tidak ditemukan');

      // 2. Cek jika OUT dan stok kurang
      if (jenis === 'OUT' && barang.jumlah_stok < jumlah) {
        throw new Error(`Stok tidak mencukupi (Tersedia: ${barang.jumlah_stok})`);
      }

      // 3. Update stok
      const newStok = jenis === 'IN' 
        ? barang.jumlah_stok + jumlah 
        : barang.jumlah_stok - jumlah;

      await tx.barang.update({
        where: { id: barangId },
        data: { jumlah_stok: newStok }
      });

      // 4. Catat transaksi
      await tx.transaksi.create({
        data: {
          barangId,
          jenis,
          jumlah,
          keterangan,
          gudangId,
          supplier,
          noPO,
          tujuan,
          penerima,
        }
      });
    });

    revalidatePath('/dashboard/transaksi');
    revalidatePath('/dashboard/inbound');
    revalidatePath('/dashboard/outbound');
    revalidatePath('/dashboard/barang');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating transaksi:', error);
    return { success: false, error: error.message || 'Gagal menyimpan transaksi' };
  }
}
