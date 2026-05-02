'use client';

import { useState, useMemo } from 'react';
import { createBarang, updateBarang, deleteBarang } from '@/actions/barang';
import { Search, Plus, Edit2, Trash2, X, Package, Printer, AlertCircle } from 'lucide-react';

type Barang = {
  id: string; kode_sku: string; nama_barang: string; kategori: string;
  jumlah_stok: number; lokasi_rak: string | null;
};

export default function BarangClient({ initialData }: { initialData: Barang[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [currentBarang, setCurrentBarang] = useState<Barang | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return initialData;
    return initialData.filter(item => 
      item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialData, searchQuery]);

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
      setError(result.error || 'Terjadi kesalahan.');
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
      setError(result.error || 'Gagal menghapus barang.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black" strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="CARI BARANG..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full text-sm font-bold bg-white border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-6 py-3 bg-[#34d399] hover:bg-[#10b981] text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] flex items-center justify-center transition-all"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
          Tambah Barang
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fef08a] border-b-2 border-black text-black font-black text-xs tracking-widest uppercase">
              <tr>
                <th className="px-6 py-5">SKU</th>
                <th className="px-6 py-5">Nama Barang &amp; Kategori</th>
                <th className="px-6 py-5 text-center">Stok</th>
                <th className="px-6 py-5">Lokasi Rak</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black text-sm font-bold">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 mb-4 text-black opacity-50" strokeWidth={2} />
                      <p className="text-lg font-black uppercase">Tidak ada barang ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black">{item.kode_sku}</td>
                    <td className="px-6 py-4">
                      <div className="font-black text-base uppercase">{item.nama_barang}</div>
                      <div className="inline-block mt-1 bg-black text-white px-2 py-0.5 text-[10px] uppercase font-black">{item.kategori}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 border-2 border-black text-sm font-black shadow-[2px_2px_0_0_#000] ${item.jumlah_stok < 10 ? 'bg-[#fca5a5]' : 'bg-[#34d399]'}`}>
                        {item.jumlah_stok}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase">{item.lokasi_rak}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setCurrentBarang(item); setIsPrintModalOpen(true); }} className="p-2 bg-white border-2 border-black hover:bg-[#fbbf24] shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Print Label">
                          <Printer className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button onClick={() => handleOpenModal(item)} className="p-2 bg-white border-2 border-black hover:bg-[#60a5fa] shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Edit">
                          <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button onClick={() => { setCurrentBarang(item); setIsDeleteModalOpen(true); }} className="p-2 bg-white border-2 border-black hover:bg-[#fca5a5] shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Hapus">
                          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-xl">
            <div className="px-8 py-5 border-b-2 border-black bg-[#a78bfa] flex justify-between items-center">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">
                {currentBarang ? 'Edit Barang' : 'Tambah Barang Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-black p-1 hover:bg-[#fca5a5] shadow-[2px_2px_0_0_#000] transition-all">
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-[#fca5a5] border-2 border-black text-black text-sm font-black uppercase flex items-start">
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-black uppercase mb-2">Kode SKU</label>
                  <input type="text" name="kode_sku" required defaultValue={currentBarang?.kode_sku || ''}
                    className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all font-mono uppercase" placeholder="ITM-001" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-black text-black uppercase mb-2">Nama Barang</label>
                  <input type="text" name="nama_barang" required defaultValue={currentBarang?.nama_barang || ''}
                    className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="Masukkan nama barang" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-black uppercase mb-2">Kategori</label>
                  <input type="text" name="kategori" required defaultValue={currentBarang?.kategori || ''}
                    className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="Elektronik" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-black uppercase mb-2">Jumlah Stok</label>
                  <input type="number" name="jumlah_stok" required min="0" defaultValue={currentBarang?.jumlah_stok || 0}
                    className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-black uppercase mb-2">Lokasi Rak</label>
                  <input type="text" name="lokasi_rak" required defaultValue={currentBarang?.lokasi_rak || ''}
                    className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="Misal: Rak A-01" />
                </div>
              </div>

              <div className="pt-8 border-t-2 border-black flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white border-2 border-black text-black text-sm font-black uppercase hover:bg-gray-100 transition-all">
                  Batal
                </button>
                <button type="submit" disabled={isLoading}
                  className="px-8 py-3 bg-[#34d399] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-md text-center p-8">
            <div className="w-16 h-16 bg-[#fca5a5] border-2 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center mx-auto mb-6 transform -rotate-3">
              <Trash2 className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-black uppercase mb-4 tracking-tight">Hapus Barang?</h3>
            <p className="text-sm font-bold text-gray-600 uppercase mb-8 border-2 border-dashed border-gray-300 p-4 bg-gray-50">
              Menghapus permanen <br/><span className="text-black text-lg mt-1 inline-block">{currentBarang?.nama_barang}</span>
            </p>
            
            <div className="flex space-x-4">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-white border-2 border-black text-black text-sm font-black uppercase hover:bg-gray-100 transition-all">
                Batal
              </button>
              <button type="button" onClick={onDelete} disabled={isLoading}
                className="flex-1 py-3 bg-[#f87171] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50">
                {isLoading ? 'Wait...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Label Modal */}
      {isPrintModalOpen && currentBarang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm overflow-hidden print:shadow-none print:border-none">
            <div className="px-6 py-4 border-b-2 border-black bg-[#fbbf24] flex justify-between items-center print:hidden">
              <h3 className="text-lg font-black uppercase tracking-tight">Print Label SKU</h3>
              <button onClick={() => setIsPrintModalOpen(false)} className="bg-white border-2 border-black p-1 hover:bg-[#fca5a5] transition-all">
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center print:p-0 print:border print:border-black print:w-[300px] print:h-[200px] print:justify-center">
              <div className="w-full border-4 border-black p-5 text-center bg-white relative">
                <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-[10px] font-black tracking-wider uppercase border-r-2 border-b-2 border-black">SKU LABEL</div>
                <h2 className="text-3xl font-black font-mono tracking-tighter mt-6 mb-3">{currentBarang.kode_sku}</h2>
                <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#000,#000_4px,transparent_4px,transparent_8px)] mb-4"></div>
                <p className="font-black text-base uppercase">{currentBarang.nama_barang}</p>
                <div className="mt-3 flex justify-between border-t-2 border-black pt-3 text-[11px] font-black text-black uppercase">
                  <span>LOC: {currentBarang.lokasi_rak}</span>
                  <span>{currentBarang.kategori}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t-2 border-black bg-gray-50 print:hidden">
              <button onClick={() => window.print()}
                className="w-full py-3 bg-[#60a5fa] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all flex items-center justify-center">
                <Printer className="w-5 h-5 mr-2" strokeWidth={2.5} />
                Print Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
