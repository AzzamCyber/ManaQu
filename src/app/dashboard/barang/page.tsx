import { getBarang } from '@/actions/barang';
import BarangClient from './Client';

export default async function BarangPage() {
  const result = await getBarang();
  const initialData = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Data Barang</h1>
          <p className="text-black font-bold mt-3 uppercase text-[10px] tracking-wider bg-[#f472b6] border-2 border-black inline-flex px-2 py-1">
            Inventory Management System
          </p>
        </div>
      </div>
      
      {!result.success && (
        <div className="p-4 bg-[#fca5a5] border-2 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
          Error: Gagal mengambil data dari database!
        </div>
      )}

      <BarangClient initialData={initialData} />
    </div>
  );
}
