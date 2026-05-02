'use client';

import { Printer } from 'lucide-react';

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

export default function LaporanClient({ initialData, stats }: { initialData: Barang[], stats: Stats }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end print:hidden">
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-[#fef08a] hover:bg-[#fde047] text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] flex items-center justify-center transition-all"
        >
          <Printer className="w-5 h-5 mr-2" strokeWidth={3} />
          PRINT REPORT
        </button>
      </div>

      <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0_0_#000] print:border-none print:shadow-none print:p-0">
        <div className="text-center mb-8 border-b-2 border-black pb-6 print:border-b-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">Inventory Report</h2>
          <p className="font-bold text-sm mt-2 uppercase text-gray-500 tracking-widest">Date: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 print:mb-6">
          <div className="border-2 border-black p-6 bg-[#e0f2fe] shadow-[4px_4px_0_0_#000] print:border-2 print:shadow-none">
            <p className="font-black uppercase text-[10px] tracking-widest mb-2 text-gray-600">Total Items</p>
            <p className="text-3xl font-black">{stats.totalBarang}</p>
          </div>
          <div className="border-2 border-black p-6 bg-[#34d399] shadow-[4px_4px_0_0_#000] print:border-2 print:shadow-none">
            <p className="font-black uppercase text-[10px] tracking-widest mb-2 text-gray-800">Total Stock Amount</p>
            <p className="text-3xl font-black">{stats.totalStok}</p>
          </div>
        </div>

        <div className="border-2 border-black print:border-2">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#a78bfa] border-b-2 border-black text-black uppercase font-black text-xs tracking-widest print:bg-gray-200 print:border-b-2">
              <tr>
                <th className="px-6 py-4 border-r-2 border-black print:border-r-2">SKU</th>
                <th className="px-6 py-4 border-r-2 border-black print:border-r-2">Item Name</th>
                <th className="px-6 py-4 border-r-2 border-black print:border-r-2">Category</th>
                <th className="px-6 py-4 border-r-2 border-black text-center print:border-r-2">Stock</th>
                <th className="px-6 py-4">Rack Loc</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-sm font-bold print:divide-y-2">
              {initialData.map((item) => (
                <tr key={item.id} className="hover:bg-[#fef08a] transition-colors print:hover:bg-transparent">
                  <td className="px-6 py-4 border-r-2 border-black font-mono print:border-r-2">{item.kode_sku}</td>
                  <td className="px-6 py-4 border-r-2 border-black uppercase print:border-r-2">{item.nama_barang}</td>
                  <td className="px-6 py-4 border-r-2 border-black uppercase print:border-r-2">{item.kategori}</td>
                  <td className="px-6 py-4 border-r-2 border-black text-center print:border-r-2">{item.jumlah_stok}</td>
                  <td className="px-6 py-4 uppercase">{item.lokasi_rak}</td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xl font-black uppercase bg-gray-50">
                    NO DATA
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
