import { Package, RefreshCw, MessageSquare, Clock, Box } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailModal() {
  const { user, isViewer, refreshUserData } = useAuth();

  // Proteksi: Komponen ini hanya muncul untuk role viewer [cite: 2025-11-02]
  if (!isViewer) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Tombol Lacak di Navbar */}
        <button className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-2xl hover:bg-blue-100 transition-all cursor-pointer shadow-sm group">
          <div className="flex flex-col text-left leading-none">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Lacak Pesanan</span>
            <span className="text-[10px] font-black text-blue-600 uppercase">
              {user?.orderStatus || "Pending"}
            </span>
          </div>
          <Package size={16} className="text-blue-500 group-hover:rotate-12 transition-transform" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden font-sans">
        {/* Header Visual Modal */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
            <Box size={120} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <Package className="text-blue-400" /> Detail Pengiriman
            </DialogTitle>
          </DialogHeader>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">ID Pelanggan: {user?.id}</p>
        </div>

        <div className="p-8 space-y-6 bg-white">
          {/* INFO ITEM: Nama produk yang diinput manual oleh Admin [cite: 2025-09-29] */}
          <div className="group bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Box size={18} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk dalam Pesanan</span>
            </div>
            <p className="text-base font-black text-slate-800 leading-tight">
              {user?.orderProduct || "Menunggu update produk dari admin..."}
            </p>
          </div>

          {/* STATUS PEMBARUAN */}
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Status Terakhir</span>
            </div>
            <Badge className={cn(
              "font-black uppercase text-[10px] px-3 py-1 rounded-full border-none shadow-sm",
              user?.orderStatus === "Selesai" ? "bg-green-500" : "bg-blue-600"
            )}>
              {user?.orderStatus}
            </Badge>
          </div>

          {/* PESAN PERSONAL: Pesan manual dari Staff/Admin [cite: 2025-11-02] */}
          <div className="relative">
            <div className="bg-blue-600 text-white p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-blue-50">
              <div className="flex items-center gap-2 mb-3 opacity-70">
                <MessageSquare size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Catatan Admin</span>
              </div>
              <p className="text-sm font-medium leading-relaxed italic">
                "{user?.adminMessage || "Pesanan Anda sedang dalam pengecekan staff. Mohon tunggu!"}"
              </p>
            </div>
            {/* Ekor balon chat dekoratif */}
            <div className="absolute -top-1 right-0 w-4 h-4 bg-blue-600 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Fitur Refresh untuk sinkronisasi data terbaru [cite: 2025-09-29] */}
          <Button 
            onClick={refreshUserData} 
            variant="ghost" 
            className="w-full rounded-2xl gap-3 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <RefreshCw size={14} /> Sinkronisasi Status Terbaru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}