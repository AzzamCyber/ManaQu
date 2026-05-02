'use client';

import { useState } from 'react';
import { createTransaksi } from '@/actions/transaksi';
import { Plus, ArrowDownToLine, ArrowUpFromLine, X, ArrowRightLeft, AlertCircle } from 'lucide-react';

type Barang = { id: string; kode_sku: string; nama_barang: string; jumlah_stok: number; };
type Gudang = { id: string; kode: string; nama: string; };
type Transaksi = {
  id: string; barangId: string; jenis: string; jumlah: number;
  keterangan: string | null; supplier: string | null; noPO: string | null;
  tujuan: string | null; penerima: string | null; gudangId: string | null;
  tanggal: Date; barang: Barang; gudang: Gudang | null;
};

export default function TransaksiClient({ initialData, items, gudangList }: { initialData: Transaksi[], items: Barang[], gudangList: Gudang[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createTransaksi(formData);
    if (result.success) { setIsModalOpen(false); } else { setError(result.error || 'Terjadi kesalahan.'); }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setError(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] flex items-center justify-center transition-all">
          <Plus className="w-5 h-5 mr-2" strokeWidth={3} />Catat Transaksi
        </button>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fbbf24] border-b-2 border-black text-black font-black text-xs tracking-widest uppercase">
              <tr>
                <th className="px-6 py-5">Tanggal</th>
                <th className="px-6 py-5">Barang</th>
                <th className="px-6 py-5 text-center">Jenis</th>
                <th className="px-6 py-5 text-center">Jumlah</th>
                <th className="px-6 py-5">Gudang</th>
                <th className="px-6 py-5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black font-bold text-sm">
              {initialData.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center bg-gray-50">
                  <div className="flex flex-col items-center"><ArrowRightLeft className="w-12 h-12 mb-4 text-black opacity-50" strokeWidth={2} /><p className="text-lg font-black uppercase">Belum ada transaksi</p></div>
                </td></tr>
              ) : (
                initialData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#fef08a] transition-colors">
                    <td className="px-6 py-4 uppercase text-xs">{new Date(trx.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="px-6 py-4">
                      <div className="font-black text-base uppercase">{trx.barang.nama_barang}</div>
                      <div className="inline-block mt-1 bg-black text-white px-2 py-0.5 text-[10px] uppercase font-black">{trx.barang.kode_sku}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {trx.jenis === 'IN' ? (
                        <span className="inline-flex items-center px-3 py-1 bg-[#34d399] border-2 border-black text-xs font-black shadow-[2px_2px_0_0_#000] uppercase"><ArrowDownToLine className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} /> Inbound</span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-[#fca5a5] border-2 border-black text-xs font-black shadow-[2px_2px_0_0_#000] uppercase"><ArrowUpFromLine className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} /> Outbound</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-black">
                        {trx.jenis === 'IN' ? '+' : '-'}{trx.jumlah}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase text-sm">{trx.gudang ? trx.gudang.nama : '-'}</td>
                    <td className="px-6 py-4 uppercase text-xs">{trx.keterangan || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] w-full max-w-xl">
            <div className="px-8 py-5 border-b-2 border-black bg-[#fbbf24] flex justify-between items-center">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">Catat Transaksi Manual</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-black p-1 hover:bg-[#fca5a5] shadow-[2px_2px_0_0_#000] transition-all"><X className="w-5 h-5" strokeWidth={3} /></button>
            </div>
            <form onSubmit={onSubmit} className="p-8 space-y-6">
              {error && <div className="p-4 bg-[#fca5a5] border-2 border-black text-black text-sm font-black uppercase flex items-start"><AlertCircle className="w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} /><span>{error}</span></div>}
              <div>
                <label className="block text-xs font-black text-black uppercase mb-2">Pilih Barang</label>
                <select name="barangId" required className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase">
                  <option value="">-- PILIH BARANG --</option>
                  {items.map(item => <option key={item.id} value={item.id}>{item.nama_barang} (Stok: {item.jumlah_stok})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-xs font-black text-black uppercase mb-2">Jenis Transaksi</label>
                  <select name="jenis" required className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase">
                    <option value="IN">Masuk (IN)</option><option value="OUT">Keluar (OUT)</option>
                  </select>
                </div>
                <div><label className="block text-xs font-black text-black uppercase mb-2">Jumlah</label><input type="number" name="jumlah" required min="1" className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all" /></div>
              </div>
              <div><label className="block text-xs font-black text-black uppercase mb-2">Gudang</label>
                <select name="gudangId" className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase">
                  <option value="">-- PILIH GUDANG (OPSIONAL) --</option>
                  {gudangList.map(g => <option key={g.id} value={g.id}>{g.nama} ({g.kode})</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-black text-black uppercase mb-2">Keterangan (Opsional)</label><input type="text" name="keterangan" className="w-full px-4 py-3 text-sm font-bold bg-[#f8fafc] border-2 border-black focus:outline-none focus:bg-[#e0f2fe] focus:shadow-[4px_4px_0_0_#000] transition-all uppercase" placeholder="CATATAN TRANSAKSI..." /></div>
              <div className="pt-8 border-t-2 border-black flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border-2 border-black text-black text-sm font-black uppercase hover:bg-gray-100 transition-all">Batal</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-[#34d399] border-2 border-black text-black text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all disabled:opacity-50">{isLoading ? 'Wait...' : 'Simpan Transaksi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
