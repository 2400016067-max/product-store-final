import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ORDER_STATUS } from "../../lib/constants";
import { exportToCSV } from "../../utils/exportUtils"; // Pastikan path ini benar
import { 
  Package, 
  RefreshCw, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  User,
  ShoppingBag,
  Download // Icon baru untuk export
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderManagement() {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); 
  const { updateUserOrder } = useAuth();

  // 1. Ambil Data Viewer dari MockAPI
  const fetchViewers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
      const data = await response.json();
      // FILTER: Hanya ambil role viewer untuk manajemen pesanan [cite: 2025-09-29]
      const onlyViewers = data.filter(u => u.role.toLowerCase() === "viewer");
      setViewers(onlyViewers);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewers();
  }, []);

  // 2. Fungsi Export ke CSV (Logika Sistem Informasi) [cite: 2025-11-02]
  const handleExportOrders = () => {
    if (viewers.length === 0) return alert("Tidak ada data untuk diunduh!");

    // Mapping: Memilih kolom yang relevan bagi bisnis & membuang data sensitif (password) [cite: 2025-09-29]
    const reportData = viewers.map(v => ({
      Nama: v.name,
      WhatsApp: v.username,
      Pesanan: v.orderProduct || "Belum ada pesanan",
      Catatan_Admin: v.adminMessage || "-",
      Status: v.orderStatus || "Pending",
      Terakhir_Update: v.orderDate ? new Date(v.orderDate).toLocaleString('id-ID') : '-'
    }));

    const headers = ["Nama Pelanggan", "ID WhatsApp", "Produk Pesanan", "Catatan Admin", "Status Pesanan", "Waktu Update"];
    
    // Nama file dinamis dengan tanggal hari ini [cite: 2025-12-25]
    const fileName = `Laporan_Pesanan_${new Date().toISOString().split('T')[0]}`;
    
    exportToCSV(reportData, fileName, headers);
  };

  // 3. Fungsi Handle Perubahan (Auto-Save on Blur) [cite: 2025-09-29]
  const handleUpdate = async (userId, updateData) => {
    setUpdatingId(userId);
    const res = await updateUserOrder(userId, updateData);
    if (res.success) {
      setViewers(prev => prev.map(v => 
        v.id === userId ? { ...v, ...updateData, orderDate: new Date().toISOString() } : v
      ));
    } else {
      alert("Gagal memperbarui: " + res.message);
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans p-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Manajemen Pesanan</h2>
          <p className="text-sm text-slate-500 font-medium">Input detail produk dan pantau status pesanan pelanggan. [cite: 2025-11-02]</p>
        </div>
        
        <div className="flex gap-3">
          {/* Tombol Export CSV */}
          <button 
            onClick={handleExportOrders}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all font-black text-[10px] uppercase tracking-wider border border-emerald-100 shadow-sm active:scale-95"
          >
            <Download size={18} />
            Export CSV
          </button>

          {/* Tombol Refresh */}
          <button 
            onClick={fetchViewers}
            className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:rotate-180 text-blue-600 border border-blue-100 shadow-sm"
          >
            <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pelanggan & Produk</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pesan Admin (Manual)</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status & Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading && viewers.length === 0 ? (
              <tr><td colSpan="3" className="p-20 text-center animate-pulse text-slate-400 font-bold italic">Menghubungkan ke database TechStore...</td></tr>
            ) : viewers.length === 0 ? (
              <tr><td colSpan="3" className="p-20 text-center text-slate-400 font-medium">Tidak ada data pelanggan untuk ditampilkan.</td></tr>
            ) : (
              viewers.map((viewer) => (
                <tr key={viewer.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* KOLOM 1: PELANGGAN & INPUT PRODUK */}
                  <td className="p-6 align-top max-w-[250px]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shadow-inner">
                        {viewer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 uppercase text-xs tracking-tight">{viewer.name}</p>
                        <p className="text-[10px] text-slate-400 italic font-medium">ID: {viewer.username}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-blue-600 uppercase ml-1">Item Pesanan:</label>
                      <div className="relative">
                        <ShoppingBag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          defaultValue={viewer.orderProduct}
                          onBlur={(e) => handleUpdate(viewer.id, { orderProduct: e.target.value })}
                          placeholder="Contoh: 1x Sony WH-1000XM5"
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-transparent rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </td>

                  {/* KOLOM 2: PESAN ADMIN */}
                  <td className="p-6 align-top">
                    <div className="space-y-1 h-full">
                      <label className="text-[9px] font-black text-amber-600 uppercase ml-1 flex items-center gap-1">
                        <MessageSquare size={10} /> Catatan untuk User:
                      </label>
                      <textarea 
                        defaultValue={viewer.adminMessage}
                        onBlur={(e) => handleUpdate(viewer.id, { adminMessage: e.target.value })}
                        placeholder="Tulis pesan pelacakan..."
                        className="w-full p-3 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-medium leading-relaxed outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all h-24 resize-none shadow-inner"
                      />
                    </div>
                  </td>

                  {/* KOLOM 3: STATUS & UPDATE */}
                  <td className="p-6 align-top w-[220px]">
                    <div className="flex flex-col gap-4">
                      <select 
                        value={viewer.orderStatus || "Pending"}
                        onChange={(e) => handleUpdate(viewer.id, { orderStatus: e.target.value })}
                        className={cn(
                          "w-full p-3 rounded-xl text-[10px] font-black uppercase outline-none transition-all cursor-pointer border-b-4 shadow-sm",
                          viewer.orderStatus === "Selesai" 
                            ? "bg-green-50 text-green-700 border-green-600 hover:bg-green-100" 
                            : "bg-blue-50 text-blue-700 border-blue-600 hover:bg-blue-100"
                        )}
                      >
                        {ORDER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1 shadow-inner">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> UPDATE TERAKHIR:
                        </div>
                        <p className="text-[10px] font-black text-slate-600">
                          {viewer.orderDate ? new Date(viewer.orderDate).toLocaleString('id-ID') : 'Belum ada data'}
                        </p>
                      </div>

                      {updatingId === viewer.id && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 animate-pulse justify-center bg-blue-50 py-1 rounded-lg border border-blue-100">
                          <RefreshCw size={12} className="animate-spin" /> MENYIMPAN KE API...
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}