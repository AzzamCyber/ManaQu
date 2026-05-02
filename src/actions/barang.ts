'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getBarang() {
  try {
    const barang = await prisma.barang.findMany({
      orderBy: {
        tanggal_masuk: 'desc',
      },
    });

    const totalBarang = barang.length;
    const totalStok = barang.reduce((sum, item) => sum + item.jumlah_stok, 0);

    return {
      success: true,
      data: barang,
      stats: {
        totalBarang,
        totalStok,
      },
    };
  } catch (error) {
    console.error('Error fetching barang:', error);
    return { success: false, error: 'Gagal mengambil data barang' };
  }
}

export async function createBarang(formData: FormData) {
  try {
    const data = {
      kode_sku: formData.get('kode_sku') as string,
      nama_barang: formData.get('nama_barang') as string,
      kategori: formData.get('kategori') as string,
      jumlah_stok: parseInt(formData.get('jumlah_stok') as string, 10),
      lokasi_rak: formData.get('lokasi_rak') as string,
    };

    await prisma.barang.create({
      data,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating barang:', error);
    return { success: false, error: 'Gagal menambahkan barang. Pastikan Kode SKU unik.' };
  }
}

export async function updateBarang(id: string, formData: FormData) {
  try {
    const data = {
      kode_sku: formData.get('kode_sku') as string,
      nama_barang: formData.get('nama_barang') as string,
      kategori: formData.get('kategori') as string,
      jumlah_stok: parseInt(formData.get('jumlah_stok') as string, 10),
      lokasi_rak: formData.get('lokasi_rak') as string,
    };

    await prisma.barang.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating barang:', error);
    return { success: false, error: 'Gagal memperbarui barang.' };
  }
}

export async function deleteBarang(id: string) {
  try {
    await prisma.barang.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting barang:', error);
    return { success: false, error: 'Gagal menghapus barang.' };
  }
}
