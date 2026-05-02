import { getBarang } from '@/actions/barang';
import { prisma } from '@/lib/prisma';
import DashboardStats from '@/components/DashboardStats';

export default async function Home() {
  const result = await getBarang();
  
  // Provide default empty arrays/stats if fetch fails
  const initialData = result.success && result.data ? result.data : [];
  const stats = result.success && result.stats ? result.stats : { totalBarang: 0, totalStok: 0 };

  // Fetch extra dashboard stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [gudangCount, inboundToday, outboundToday] = await Promise.all([
    prisma.gudang.count({ where: { status: 'ACTIVE' } }),
    prisma.transaksi.count({ where: { jenis: 'IN', tanggal: { gte: today } } }),
    prisma.transaksi.count({ where: { jenis: 'OUT', tanggal: { gte: today } } }),
  ]);

  const extraStats = { gudangCount, inboundToday, outboundToday };

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-black font-bold mt-3 uppercase text-[10px] tracking-wider bg-[#34d399] border-2 border-black inline-flex px-2 py-1">
            System Status: Active &amp; Ready
          </p>
        </div>
      </div>
      
      {!result.success && (
        <div className="p-4 bg-[#fca5a5] border-2 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
          Error: Gagal mengambil data dari database!
        </div>
      )}

      <DashboardStats initialData={initialData} stats={stats} extraStats={extraStats} />
    </div>
  );
}
