'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createBarang, updateBarang, deleteBarang } from '@/actions/barang';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, Plus, Edit2, Trash2, X, Package, Box, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

type Barang = {
  id: string;
  kode_sku: string;
  nama_barang: string;
  kategori: string;
  jumlah_stok: number;
  lokasi_rak: string | null;
  tanggal_masuk: Date;
};

type Stats = {
  totalBarang: number;
  totalStok: number;
};

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#14b8a6', '#0ea5e9'];

export default function DashboardClient({ initialData, stats }: { initialData: Barang[], stats: Stats }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBarang, setCurrentBarang] = useState<Barang | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  // Derived state
  const filteredData = useMemo(() => {
    if (!searchQuery) return initialData;
    return initialData.filter(item => 
      item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialData, searchQuery]);

  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    initialData.forEach(item => {
      const current = categoryMap.get(item.kategori) || 0;
      categoryMap.set(item.kategori, current + item.jumlah_stok);
    });
    return Array.from(categoryMap.entries()).map(([name, stok]) => ({ name, stok }));
  }, [initialData]);

  // Initial GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Cards
      gsap.from(cardsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.2)'
      });

      // Animate Table Rows
      if (tableRowsRef.current.length > 0) {
        gsap.from(tableRowsRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.4
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [initialData]);

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const addToTableRowsRef = (el: HTMLTableRowElement | null) => {
    if (el && !tableRowsRef.current.includes(el)) {
      tableRowsRef.current.push(el);
    }
  };

  const handleOpenModal = (barang?: Barang) => {
    setCurrentBarang(barang || null);
    setError(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = currentBarang 
      ? await updateBarang(currentBarang.id, formData)
      : await createBarang(formData);

    if (result.success) {
      setIsModalOpen(false);
      setCurrentBarang(null);
    } else {
      setError(result.error || 'Terjadi kesalahan');
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    if (!currentBarang) return;
    setIsLoading(true);
    const result = await deleteBarang(currentBarang.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setCurrentBarang(null);
    } else {
      setError(result.error || 'Terjadi kesalahan saat menghapus');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div ref={addToCardsRef} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center space-x-5 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-xl shadow-inner relative z-10">
            <Package className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500">Total Jenis Barang</p>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats.totalBarang}</p>
          </div>
        </div>
        
        <div ref={addToCardsRef} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center space-x-5 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl shadow-inner relative z-10">
            <Box className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500">Total Stok Keseluruhan</p>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats.totalStok}</p>
          </div>
        </div>

        <div ref={addToCardsRef} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center space-x-5 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 rounded-xl shadow-inner relative z-10">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500">Kategori Tersedia</p>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{chartData.length}</p>
          </div>
        </div>
      </div>

      {/* Chart & Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div ref={addToCardsRef} className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Kategori</h3>
          {chartData.length > 0 ? (
            <div className="flex-1 w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="stok" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
               Belum ada data visualisasi.
             </div>
          )}
        </div>

        {/* Main Table Area */}
        <div ref={addToCardsRef} className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/50">
            <h3 className="text-lg font-bold text-slate-800">Daftar Inventaris</h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari barang..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64 transition-all"
                />
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center font-medium"
              >
                <Plus className="w-5 h-5 mr-1" />
                Tambah Baru
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Nama & Kategori</th>
                  <th className="px-6 py-4 text-center">Stok</th>
                  <th className="px-6 py-4">Lokasi Rak</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="inline-flex flex-col items-center justify-center text-slate-400">
                        <Package className="w-12 h-12 mb-3 text-slate-300" />
                        <p>{searchQuery ? 'Data tidak ditemukan.' : 'Belum ada data barang.'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, i) => (
                    <tr 
                      key={item.id} 
                      ref={el => addToTableRowsRef(el)}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">{item.kode_sku}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.nama_barang}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.kategori}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-bold text-xs ${item.jumlah_stok < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.jumlah_stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.lokasi_rak}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setCurrentBarang(item); setIsDeleteModalOpen(true); }}
                          className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form (Enhanced with styling) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {currentBarang ? 'Edit Data Barang' : 'Tambah Barang Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center">
                  <div className="w-1.5 h-full bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kode SKU</label>
                  <input type="text" name="kode_sku" required defaultValue={currentBarang?.kode_sku || ''}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" placeholder="Contoh: ITM-001" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Barang</label>
                  <input type="text" name="nama_barang" required defaultValue={currentBarang?.nama_barang || ''}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" placeholder="Masukkan nama barang..." />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <input type="text" name="kategori" required defaultValue={currentBarang?.kategori || ''}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" placeholder="Contoh: Elektronik" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jumlah Stok</label>
                  <input type="number" name="jumlah_stok" required min="0" defaultValue={currentBarang?.jumlah_stok || 0}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi Rak</label>
                  <input type="text" name="lokasi_rak" required defaultValue={currentBarang?.lokasi_rak || ''}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" placeholder="Contoh: Rak A-1" />
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isLoading}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-50 to-white -z-10"></div>
              <div className="w-20 h-20 bg-white shadow-xl text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-3">Konfirmasi Hapus</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Anda akan menghapus <strong className="text-slate-700">{currentBarang?.nama_barang}</strong> secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button type="button" onClick={onDelete} disabled={isLoading}
                  className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-md shadow-red-600/20 disabled:opacity-70">
                  {isLoading ? 'Menghapus...' : 'Ya, Hapus Data'}
                </button>
                <button type="button" onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
