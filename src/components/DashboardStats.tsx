'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Box, TrendingUp, AlertTriangle, Warehouse, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';

type Barang = {
  id: string; kode_sku: string; nama_barang: string; kategori: string;
  jumlah_stok: number; lokasi_rak: string | null; tanggal_masuk: Date;
};

type Stats = { totalBarang: number; totalStok: number; };
type ExtraStats = { gudangCount: number; inboundToday: number; outboundToday: number; };

const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#f87171'];

export default function DashboardStats({ initialData, stats, extraStats }: { initialData: Barang[], stats: Stats, extraStats?: ExtraStats }) {
  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    initialData.forEach(item => {
      const current = categoryMap.get(item.kategori) || 0;
      categoryMap.set(item.kategori, current + item.jumlah_stok);
    });
    return Array.from(categoryMap.entries()).map(([name, stok]) => ({ name, stok }));
  }, [initialData]);

  const lowStockItems = useMemo(() => {
    return initialData.filter(item => item.jumlah_stok < 10);
  }, [initialData]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-[#60a5fa] border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]"><Package className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
          </div>
          <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">Total Items</p><p className="text-3xl font-black">{stats.totalBarang}</p></div>
        </div>
        
        <div className="bg-[#34d399] border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]"><Box className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
          </div>
          <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">Total Stock</p><p className="text-3xl font-black">{stats.totalStok}</p></div>
        </div>

        <div className="bg-[#fef08a] border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]"><TrendingUp className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
          </div>
          <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">Categories</p><p className="text-3xl font-black">{chartData.length}</p></div>
        </div>

        {extraStats && (
          <>
            <div className="bg-[#a78bfa] border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]"><Warehouse className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
              </div>
              <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">Gudang</p><p className="text-3xl font-black">{extraStats.gudangCount}</p></div>
            </div>
            
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-[#34d399] border-2 border-black shadow-[2px_2px_0_0_#000]"><ArrowDownToLine className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
              </div>
              <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">In Today</p><p className="text-3xl font-black">{extraStats.inboundToday}</p></div>
            </div>
            
            <div className="bg-[#f472b6] border-2 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]"><ArrowUpFromLine className="w-5 h-5 text-black" strokeWidth={2.5} /></div>
              </div>
              <div><p className="text-[10px] font-black uppercase tracking-wider mb-1">Out Today</p><p className="text-3xl font-black">{extraStats.outboundToday}</p></div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white border-2 border-black p-8 shadow-[4px_4px_0_0_#000]">
          <div className="border-b-2 border-black pb-4 mb-8">
            <h3 className="text-xl font-black text-black uppercase tracking-tight">Stock Distribution</h3>
            <p className="text-xs font-bold text-gray-500 uppercase mt-1">Jumlah stok per kategori barang</p>
          </div>
          
          {chartData.length > 0 ? (
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" strokeWidth={1} />
                  <XAxis dataKey="name" axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', boxShadow: '4px 4px 0 0 #000', borderRadius: '0', textTransform: 'uppercase', fontWeight: '900' }}
                    itemStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="stok" stroke="#000" strokeWidth={2} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-black bg-[#fef08a]">
              <p className="text-sm font-black text-black uppercase">NO DATA AVAILABLE</p>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col h-full">
          <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#fca5a5]">
            <div>
              <h3 className="text-lg font-black text-black uppercase tracking-tight">Low Stock Alert</h3>
              <p className="text-[10px] font-bold text-black uppercase mt-1 tracking-wider">Barang dgn stok &lt; 10</p>
            </div>
            <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]">
              <AlertTriangle className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="p-4 border-2 border-black flex justify-between items-center hover:bg-[#fef08a] transition-colors">
                  <div>
                    <p className="text-sm font-black text-black uppercase">{item.nama_barang}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-1">{item.kode_sku}</p>
                  </div>
                  <div className="bg-[#fca5a5] border-2 border-black px-3 py-1 text-sm font-black text-black shadow-[2px_2px_0_0_#000]">
                    {item.jumlah_stok} left
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-black">
                <p className="text-sm font-black text-black uppercase">Semua Stok Aman</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t-2 border-black bg-gray-50">
            <Link href="/dashboard/inbound" className="flex items-center justify-center w-full py-3 bg-[#60a5fa] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all">
              Restock Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
