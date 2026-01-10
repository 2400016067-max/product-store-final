import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ORDER_STATUS } from "../../lib/constants";
import { exportToCSV } from "../../utils/exportUtils"; 
import { 
  RefreshCw, 
  MessageSquare, 
  Clock,
  ShoppingBag,
  Download,
  Search,
  Database,
  Calendar,
  AlertCircle,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderManagement() {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const { updateUserOrder } = useAuth();

  // 1. NOTIFICATION SYSTEM (Feedback Loop)
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // 2. DATA ACQUISITION (Sync with MockAPI)
  const fetchViewers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
      const data = await response.json();
      // Integrity Filter: Only Viewers role
      const onlyViewers = data.filter(u => u.role?.toLowerCase() === "viewer");
      setViewers(onlyViewers);
    } catch (error) {
      showToast("Gagal mengambil data database", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchViewers();
  }, [fetchViewers]);

  // 3. DATE FORMATTER (Standard id-ID)
  const formatDateID = (dateString) => {
    if (!dateString) return "Menunggu Sinkronisasi";
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 4. SEARCH LOGIC (Memoized for Performance)
  const filteredViewers = useMemo(() => {
    return viewers.filter(v => 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [viewers, searchTerm]);

  // 5. UPDATE LOGIC (The "Nyambung" Engine)
  const handleUpdate = async (userId, updateData) => {
    if (updatingId === userId) return; // Prevent double trigger
    
    setUpdatingId(userId);
    const timestamp = new Date().toISOString();
    
    const finalPayload = { 
      ...updateData, 
      orderDate: timestamp 
    };

    const res = await updateUserOrder(userId, finalPayload);
    
    if (res.success) {
      // Local State Update: Instantly sync UI without re-fetching everything
      setViewers(prev => prev.map(v => 
        v.id === userId ? { ...v, ...finalPayload } : v
      ));
      showToast("Database Berhasil Diperbarui");
    } else {
      showToast(`Conflict: ${res.message}`, "error");
    }
    setUpdatingId(null);
  };

  // 6. EXPORT LOGIC
  const handleExportOrders = () => {
    if (viewers.length === 0) return showToast("Buffer kosong, tidak ada data", "error");
    const reportData = viewers.map(v => ({
      ID: v.id,
      Nama: v.name,
      WA: v.username,
      Produk: v.orderProduct || "N/A",
      Instruksi: v.adminMessage || "-",
      Status: v.orderStatus || "Pending",
      Update: v.orderDate ? formatDateID(v.orderDate) : 'Never'
    }));
    const headers = ["ID", "Nama Pelanggan", "WhatsApp", "Manifest Pesanan", "Catatan Admin", "Status", "Waktu Terakhir"];
    exportToCSV(reportData, `TECHSTORE_REPORT_${new Date().toISOString().split('T')[0]}`, headers);
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-700 font-sans p-2 md:p-6 min-h-screen">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div className={cn(
          "fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 transition-all",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-[11px] font-black uppercase tracking-[0.2em]">{toast.message}</p>
        </div>
      )}

      {/* HEADER COMMAND CENTER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-slate-950 text-white rounded-xl shadow-lg rotate-3"><Database size={20} /></div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Logistic Console</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] ml-1">Automated Data Synchronizer v2.5</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Manifest/WhatsApp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 shadow-inner"
            />
          </div>

          <button onClick={handleExportOrders} className="flex items-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest border border-emerald-100 active:scale-95">
            <Download size={18} /> Export
          </button>

          <button onClick={fetchViewers} className="p-3.5 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all active:rotate-180 text-blue-600 border border-blue-100 shadow-sm">
            <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white border border-slate-50 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950">
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Customer Identity</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Logistic Manifest</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && viewers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-40 text-center">
                    <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-6 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Syncing Master Database...</p>
                  </td>
                </tr>
              ) : filteredViewers.length === 0 ? (
                <tr><td colSpan="3" className="p-40 text-center text-rose-400 font-black uppercase tracking-widest italic">No matching records found.</td></tr>
              ) : (
                filteredViewers.map((viewer) => (
                  <tr key={viewer.id} className="hover:bg-slate-50/80 transition-all group">
                    {/* KOLOM 1: IDENTITY */}
                    <td className="p-8 align-top">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                          {viewer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-sm tracking-tight leading-none mb-1">{viewer.name}</p>
                          <div className="flex items-center gap-2">
                             <UserCheck size={10} className="text-blue-600" />
                             <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">ID: {viewer.username}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2">
                          <ShoppingBag size={10} /> Product Manifest:
                        </label>
                        <input 
                          type="text"
                          defaultValue={viewer.orderProduct}
                          onBlur={(e) => handleUpdate(viewer.id, { orderProduct: e.target.value })}
                          placeholder="Belum ada produk..."
                          className="w-full px-5 py-3 bg-slate-100 border-2 border-transparent rounded-2xl text-[11px] font-bold outline-none focus:border-blue-600 focus:bg-white transition-all italic shadow-inner"
                        />
                      </div>
                    </td>

                    {/* KOLOM 2: INSTRUCTIONS */}
                    <td className="p-8 align-top">
                      <div className="space-y-2 h-full">
                        <label className="text-[8px] font-black text-amber-500 uppercase ml-1 flex items-center gap-2">
                          <MessageSquare size={10} /> Internal Logistic Notes:
                        </label>
                        <textarea 
                          defaultValue={viewer.adminMessage}
                          onBlur={(e) => handleUpdate(viewer.id, { adminMessage: e.target.value })}
                          placeholder="Update status perjalanan di sini..."
                          className="w-full p-5 bg-slate-100 border-2 border-transparent rounded-[2rem] text-[11px] font-medium leading-relaxed outline-none focus:border-blue-600 focus:bg-white transition-all h-32 resize-none shadow-inner italic"
                        />
                      </div>
                    </td>

                    {/* KOLOM 3: STATUS & ACTION */}
                    <td className="p-8 align-top w-[300px]">
                      <div className="flex flex-col gap-4 items-end">
                        <select 
                          value={viewer.orderStatus || "Pending"}
                          onChange={(e) => handleUpdate(viewer.id, { orderStatus: e.target.value })}
                          className={cn(
                            "w-full p-4 rounded-2xl text-[10px] font-black uppercase outline-none transition-all cursor-pointer border-b-4 shadow-xl text-center",
                            viewer.orderStatus === "Selesai" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-600" 
                              : "bg-blue-50 text-blue-700 border-blue-600"
                          )}
                        >
                          {ORDER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-2 w-full shadow-2xl">
                          <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 tracking-[0.2em]">
                            <Clock size={10} /> SYSTEM TIMESTAMP:
                          </div>
                          <p className="text-[10px] font-mono font-bold text-emerald-400">
                            {formatDateID(viewer.orderDate)}
                          </p>
                        </div>

                        {updatingId === viewer.id && (
                          <div className="flex items-center gap-3 text-[9px] font-black text-blue-600 animate-pulse justify-center w-full bg-blue-50 py-2 rounded-xl border border-blue-100">
                            <RefreshCw size={12} className="animate-spin" /> COMMITTING CHANGE...
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
    </div>
  );
}