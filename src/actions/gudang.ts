'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getGudang() {
  try {
    const gudang = await prisma.gudang.findMany({
      include: {
        _count: {
          select: {
            barang: true,
            transaksi: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: gudang,
    };
  } catch (error) {
    console.error('Error fetching gudang:', error);
    return { success: false, error: 'Gagal mengambil data gudang' };
  }
}

export async function createGudang(formData: FormData) {
  try {
    const data = {
      kode: formData.get('kode') as string,
      nama: formData.get('nama') as string,
      deskripsi: (formData.get('deskripsi') as string) || null,
      zona: formData.get('zona') as string || 'WARM',
      kapasitas: parseInt(formData.get('kapasitas') as string, 10) || 100,
      status: formData.get('status') as string || 'ACTIVE',
    };

    if (!data.kode || !data.nama) {
      return { success: false, error: 'Kode dan Nama gudang wajib diisi' };
    }

    await prisma.gudang.create({ data });

    revalidatePath('/dashboard/gudang');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating gudang:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Kode gudang sudah digunakan. Gunakan kode lain.' };
    }
    return { success: false, error: 'Gagal menambahkan gudang.' };
  }
}

export async function updateGudang(id: string, formData: FormData) {
  try {
    const data = {
      kode: formData.get('kode') as string,
      nama: formData.get('nama') as string,
      deskripsi: (formData.get('deskripsi') as string) || null,
      zona: formData.get('zona') as string || 'WARM',
      kapasitas: parseInt(formData.get('kapasitas') as string, 10) || 100,
      status: formData.get('status') as string || 'ACTIVE',
    };

    if (!data.kode || !data.nama) {
      return { success: false, error: 'Kode dan Nama gudang wajib diisi' };
    }

    await prisma.gudang.update({
      where: { id },
      data,
    });

    revalidatePath('/dashboard/gudang');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating gudang:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Kode gudang sudah digunakan.' };
    }
    return { success: false, error: 'Gagal memperbarui gudang.' };
  }
}

export async function deleteGudang(id: string) {
  try {
    // Check if gudang has related barang
    const gudang = await prisma.gudang.findUnique({
      where: { id },
      include: {
        _count: {
          select: { barang: true },
        },
      },
    });

    if (!gudang) {
      return { success: false, error: 'Gudang tidak ditemukan' };
    }

    if (gudang._count.barang > 0) {
      return { success: false, error: `Tidak bisa menghapus gudang. Masih ada ${gudang._count.barang} barang terkait.` };
    }

    await prisma.gudang.delete({
      where: { id },
    });

    revalidatePath('/dashboard/gudang');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting gudang:', error);
    return { success: false, error: 'Gagal menghapus gudang.' };
  }
}
