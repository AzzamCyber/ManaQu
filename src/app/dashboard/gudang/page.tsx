import { getGudang } from '@/actions/gudang';
import GudangClient from './Client';

export default async function GudangPage() {
  const result = await getGudang();
  const initialData = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Lokasi Gudang</h1>
          <p className="text-black font-bold mt-3 uppercase text-[10px] tracking-wider bg-[#a78bfa] border-2 border-black inline-flex px-2 py-1">
            Warehouse Location Management
          </p>
        </div>
      </div>
      
      {!result.success && (
        <div className="p-4 bg-[#fca5a5] border-2 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
          Error: Gagal mengambil data gudang!
        </div>
      )}

      <GudangClient initialData={initialData} />
    </div>
  );
}
