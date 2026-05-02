import { getBarang } from '@/actions/barang';
import { getOutbound } from '@/actions/transaksi';
import { getGudang } from '@/actions/gudang';
import OutboundClient from './Client';

export default async function OutboundPage() {
  const result = await getOutbound();
  const barangResult = await getBarang();
  const gudangResult = await getGudang();

  const initialData = result.success && result.data ? result.data : [];
  const itemsData = barangResult.success && barangResult.data ? barangResult.data : [];
  const gudangList = gudangResult.success && gudangResult.data ? gudangResult.data : [];

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Barang Keluar (Outbound)</h1>
          <p className="text-black font-bold mt-3 uppercase text-[10px] tracking-wider bg-[#f87171] border-2 border-black inline-flex px-2 py-1">
            Pengiriman &amp; Pengeluaran Stok
          </p>
        </div>
      </div>
      
      {!result.success && (
        <div className="p-4 bg-[#fca5a5] border-2 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
          Error: Gagal mengambil data outbound!
        </div>
      )}

      <OutboundClient initialData={initialData} items={itemsData} gudangList={gudangList} />
    </div>
  );
}
