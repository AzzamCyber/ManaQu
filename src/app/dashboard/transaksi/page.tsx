import { getTransaksi } from '@/actions/transaksi';
import TransaksiClient from './Client';

export default async function TransaksiPage() {
  const result = await getTransaksi();
  const initialData = result.success && result.data ? result.data : [];
  const itemsData = result.success && result.items ? result.items : [];
  const gudangList = result.success && result.gudangList ? result.gudangList : [];

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Riwayat Transaksi</h1>
          <p className="text-black font-bold mt-3 uppercase text-[10px] tracking-wider bg-[#fbbf24] border-2 border-black inline-flex px-2 py-1">
            Inbound &amp; Outbound Logs
          </p>
        </div>
      </div>
      
      {!result.success && (
        <div className="p-4 bg-[#fca5a5] border-2 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
          Error: Gagal mengambil data transaksi!
        </div>
      )}

      <TransaksiClient initialData={initialData} items={itemsData} gudangList={gudangList} />
    </div>
  );
}
