'use client';

import { useState } from 'react';
import { createGudang, updateGudang, deleteGudang } from '@/actions/gudang';
import { Plus, Edit2, Trash2, X, Warehouse, Thermometer, Package, Map, AlertCircle } from 'lucide-react';

type Gudang = {
  id: string; kode: string; nama: string; deskripsi: string | null;
  zona: string; kapasitas: number; status: string; createdAt: Date;
  _count: { barang: number; transaksi: number; };
};

const ZONA_STYLES: Record<string, { bg: string; icon: string; label: string }> = {
  HOT:  { bg: 'bg-[#fca5a5]', icon: 'text-black', label: 'HOT (FAST)' },
  WARM: { bg: 'bg-[#fcd34d]', icon: 'text-black', label: 'WARM (MED)' },
  COLD: { bg: 'bg-[#93c5fd]', icon: 'text-black', label: 'COLD (SLOW)' },
};

export default function GudangClient({ initialData }: { initialData: Gudang[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentGudang, setCurrentGudang] = useState<Gudang | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (gudang?: Gudang) => {
    setCurrentGudang(gudang || null);
    setError(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = currentGudang
      ? await updateGudang(currentGudang.id, formData)
      : await createGudang(formData);
    if (result.success) { setIsModalOpen(false); setCurrentGudang(null); }
    else { setError(result.error || 'Terjadi kesalahan.'); }
    setIsLoading(false);
  };

  const onDelete = async () => {
    if (!currentGudang) return;
    setIsLoading(true);
    setError(null);
    const result = await deleteGudang(currentGudang.id);
    if (result.success) { setIsDeleteModalOpen(false); setCurrentGudang(null); }
    else { setError(result.error || 'Gagal menghapus gudang.'); }
    setIsLoading(false);
  };

  const activeCount = initialData.filter(g => g.status === 'ACTIVE').length;
  const totalKapasitas = initialData.reduce((s, g) => s + g.kapasitas, 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Gudang</p>
          <p className="text-4xl font-black text-black">{initialData.length}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Gudang Aktif</p>
          <p className="text-4xl font-black text-black">{activeCount}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Kapasitas</p>
          <p className="text-4xl font-black text-black">{totalKapasitas}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Barang</p>
          <p className="text-4xl font-black text-black">{initialData.reduce((s, g) => s + g._count.barang, 0)}</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] flex items-center transition-all">
          <Plus className="w-5 h-5 mr-2" strokeWidth={3} />Tambah Gudang
        </button>
      </div>

      {/* Cards Grid */}
      {initialData.length === 0 ? (
        <div className="bg-white border-2 border-black p-16 text-center shadow-[4px_4px_0_0_#000]">
          <Map className="w-16 h-16 text-black opacity-30 mx-auto mb-4" strokeWidth={2} />
          <p className="text-2xl font-black text-black uppercase">Belum Ada Gudang</p>
          <p className="text-sm font-bold text-gray-500 uppercase mt-2">Klik tombol di atas untuk menambahkan gudang baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialData.map(gudang => {
            const zona = ZONA_STYLES[gudang.zona] || ZONA_STYLES.WARM;
            const isActive = gudang.status === 'ACTIVE';
            return (
              <div key={gudang.id} className={`bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col ${!isActive ? 'opacity-50' : 'hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all'}`}>
                {/* Card Header */}
                <div className="p-6 border-b-2 border-black flex justify-between items-start bg-[#fef08a]">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">{gudang.kode}</span>
                      <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0_0_#000] ${isActive ? 'bg-[#34d399] text-black' : 'bg-gray-200 text-gray-500'}`}>{gudang.status}</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">{gudang.nama}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(gudang)} className="p-2 bg-white border-2 border-black hover:bg-[#60a5fa] shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"><Edit2 className="w-4 h-4" strokeWidth={2.5} /></button>
                    <button onClick={() => { setCurrentGudang(gudang); setError(null); setIsDeleteModalOpen(true); }} className="p-2 bg-white border-2 border-black hover:bg-[#fca5a5] shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"><Trash2 className="w-4 h-4" strokeWidth={2.5} /></button>
                  </div>
                </div>
                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  {gudang.deskripsi && <p className="text-sm font-bold text-gray-600 uppercase mb-6">{gudang.deskripsi}</p>}
                  
                  <div className="mt-auto space-y-6">
                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-black shadow-[2px_2px_0_0_#000] ${zona.bg}`}>
                      <Thermometer className={`w-5 h-5 ${zona.icon}`} strokeWidth={2.5} />
                      <span className="text-sm font-black text-black uppercase tracking-widest">{zona.label}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border-2 border-black p-4 text-center shadow-[2px_2px_0_0_#000]">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Kapasitas</p>
                        <p className="text-2xl font-black text-black">{gudang.kapasitas}</p>
                      </div>
                      <div className="bg-white border-2 border-black p-4 text-center shadow-[2px_2px_0_0_#000]">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Barang</p>
                        <p className="text-2xl font-black text-black flex items-center justify-center gap-1.5">
                          {gudang._count.barang}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Footer */}
                <div className="px-6 py-4 border-t-2 border-black bg-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <span>Trx: {gudang._count.transaksi}</span>
                  <span>Dibuat: {new Date(gudang.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-xl">
            <div className="px-8 py-5 border-b-2 border-black bg-[#a78bfa] flex justify-between items-center">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">{currentGudang ? 'Edit Gudang' : 'Tambah Gudang Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-black p-1 hover:bg-[#fca5a5] shadow-[2px_2px_0_0_#000] transition-all"><X className="w-5 h-5" strokeWidth={3} /></button>
            </div>
            <form onSubmit={onSubmit} className="p-8 space-y-6">
              {error && <div className="p-4 bg-[#fca5a5] border-2 border-black text-black text-sm font-black uppercase flex items-start"><AlertCircle className="w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} /><span>{error}</span></div>}
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-xs font-black text-black uppercase mb-2">Kode Gudang *</label><input type="text" name="kode" required defaultValue={currentGudang?.kode || ''} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all font-mono uppercase" placeholder="GD-01" /></div>
                <div><label className="block text-xs font-black text-black uppercase mb-2">Nama Gudang *</label><input type="text" name="nama" required defaultValue={currentGudang?.nama || ''} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="GUDANG UTAMA" /></div>
              </div>
              <div><label className="block text-xs font-black text-black uppercase mb-2">Deskripsi</label><input type="text" name="deskripsi" defaultValue={currentGudang?.deskripsi || ''} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="DESKRIPSI PERUNTUKAN GUDANG" /></div>
              <div className="grid grid-cols-3 gap-6">
                <div><label className="block text-xs font-black text-black uppercase mb-2">Zona</label>
                  <select name="zona" defaultValue={currentGudang?.zona || 'WARM'} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase">
                    <option value="HOT">🔴 HOT</option><option value="WARM">🟡 WARM</option><option value="COLD">🔵 COLD</option>
                  </select>
                </div>
                <div><label className="block text-xs font-black text-black uppercase mb-2">Kapasitas</label><input type="number" name="kapasitas" min="1" defaultValue={currentGudang?.kapasitas || 100} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all" /></div>
                <div><label className="block text-xs font-black text-black uppercase mb-2">Status</label>
                  <select name="status" defaultValue={currentGudang?.status || 'ACTIVE'} className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase">
                    <option value="ACTIVE">Aktif</option><option value="INACTIVE">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="pt-8 border-t-2 border-black flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border-2 border-black text-black text-sm font-black uppercase hover:bg-gray-100 transition-all">Batal</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-[#a78bfa] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all disabled:opacity-50">{isLoading ? 'Wait...' : 'Simpan Gudang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-md text-center p-8">
            <div className="w-16 h-16 bg-[#fca5a5] border-2 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center mx-auto mb-6 transform -rotate-3"><Trash2 className="w-8 h-8 text-black" strokeWidth={2.5} /></div>
            <h3 className="text-2xl font-black text-black uppercase mb-4 tracking-tight">Hapus Gudang?</h3>
            {error && <div className="p-4 mb-4 bg-[#fca5a5] border-2 border-black text-black text-sm font-black uppercase flex items-start text-left"><AlertCircle className="w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} /><span>{error}</span></div>}
            <p className="text-sm font-bold text-gray-600 uppercase mb-8 border-2 border-dashed border-gray-300 p-4 bg-gray-50">Menghapus permanen gudang <br/><span className="text-black text-lg mt-1 inline-block">{currentGudang?.nama}</span></p>
            <div className="flex space-x-4">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-white border-2 border-black text-black text-sm font-black uppercase hover:bg-gray-100 transition-all">Batal</button>
              <button type="button" onClick={onDelete} disabled={isLoading} className="flex-1 py-3 bg-[#f87171] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50">{isLoading ? 'Wait...' : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
