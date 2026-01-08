import React from "react";
import { 
  Package, 
  RefreshCw, 
  MessageSquare, 
  Clock, 
  Box, 
  Truck, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailModal() {
  const { user, isViewer, refreshUserData } = useAuth();

  // Proteksi Role: Memastikan fitur pelacakan eksklusif hanya untuk akun dengan role Viewer
  if (!isViewer) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* TRIGGER BUTTON: Modern Interaction
           Menggunakan kombinasi flex-col untuk label ganda dan efek group-hover:rotate-12 
           agar ikon paket terlihat "hidup" saat disentuh. */}
        <button className="flex items-center gap-3 bg-white border border-slate-200 pl-4 pr-2 py-1.5 rounded-2xl hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm group active:scale-95">
          <div className="flex flex-col text-left leading-none">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status Order</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {user?.orderStatus || "Pending"}
            </span>
          </div>
          <div className="p-2 bg-blue-600 text-white rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100">
            <Package size={14} />
          </div>
        </button>
      </DialogTrigger>

      {/* DIALOG CONTENT: Modern Radius & Aesthetic Framing
         Menggunakan rounded-[3rem] untuk menyelaraskan dengan bahasa desain "soft-bubbly" di seluruh aplikasi. */}
      <DialogContent className="sm:max-w-[480px] rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden font-sans bg-white">
        
        {/* HEADER SECTION: Dark Mode Aesthetic
           Penggunaan bg-slate-900 memberikan kontras tinggi (Visual Impact) yang membedakan area informasi status dari konten lainnya. */}
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          {/* DECORATIVE ELEMENTS: Blur & Abstract Icon
             Efek blur-3xl dan ikon Truck transparan menciptakan kedalaman visual (depth) tanpa mengganggu teks utama. */}
          <div className="absolute -right-10 -top-10 opacity-10 rotate-12 bg-blue-500 w-48 h-48 rounded-full blur-3xl"></div>
          <div className="absolute right-6 top-6 opacity-20 rotate-12">
            <Truck size={100} strokeWidth={1} />
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-blue-600 hover:bg-blue-600 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                 Live Tracking
               </Badge>
            </div>
            {/* BOLD TYPOGRAPHY: Menggunakan font-black & italic untuk menciptakan kesan "Shipment Detail" yang mendesak dan penting. */}
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3 leading-none">
              Shipment <br /> Detail
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detail status pesanan untuk ID Pelanggan: {user?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex items-center gap-2">
             <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">ID: {user?.id?.slice(0, 12)}...</p>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
          {/* PRODUCT INFO: Modern Pill Container
             Menggunakan bg-slate-50 dan rounded-[2rem] untuk memisahkan informasi produk secara bersih. */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Paket</span>
              <Box size={14} className="text-slate-300" />
            </div>
            <div className="group bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 hover:border-blue-100 transition-all relative overflow-hidden">
              <p className="text-base font-black text-slate-900 leading-tight relative z-10">
                {user?.orderProduct || "Menunggu konfirmasi produk..."}
              </p>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package size={40} />
              </div>
            </div>
          </div>

          {/* STATUS GRID: Dynamic Color Coding
             Warna berubah otomatis (biru/hijau) berdasarkan status untuk memberikan sinyal visual instan kepada user. */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Last Update
              </span>
              <span className="text-xs font-bold text-slate-900 tracking-tight">Hari Ini</span>
            </div>
            <div className={cn(
              "p-4 rounded-2xl flex flex-col gap-1 border animate-in zoom-in duration-500",
              user?.orderStatus === "Selesai" 
                ? "bg-green-50 border-green-100 text-green-700" 
                : "bg-blue-50 border-blue-100 text-blue-700"
            )}>
              <span className="text-[8px] font-black opacity-60 uppercase tracking-widest flex items-center gap-1">
                {user?.orderStatus === "Selesai" ? <CheckCircle2 size={10} /> : <RefreshCw size={10} />} Status
              </span>
              <span className="text-xs font-black uppercase tracking-tighter">
                {user?.orderStatus || "Processing"}
              </span>
            </div>
          </div>

          {/* ADMIN NOTE: Bubble Chat Aesthetic
             Desain unik rounded-tr-none mensimulasikan gaya pesan chat, memberikan sentuhan personal dari admin. */}
          <div className="space-y-4 pt-2">
             <div className="flex items-center gap-2 px-2">
                <MessageSquare size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Pesan Dari Admin</span>
             </div>
             <div className="bg-blue-600 text-white p-6 rounded-[2.5rem] rounded-tr-none shadow-xl shadow-blue-100 relative">
                <p className="text-sm font-medium leading-relaxed italic opacity-95">
                  "{user?.adminMessage || "Halo! Tim kami sedang menyiapkan pesanan Anda. Mohon ditunggu ya!"}"
                </p>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Verified Admin</span>
                   <ChevronRight size={14} className="opacity-40" />
                </div>
             </div>
          </div>

          {/* SYNC ACTION: Dashed Border Design
             Menggunakan border-dashed dan tracking-[0.2em] untuk membedakan tombol utilitas dengan tombol aksi utama. */}
          <Button 
            onClick={refreshUserData} 
            variant="outline" 
            className="w-full h-14 rounded-2xl gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all border-dashed border-2 group"
          >
            <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" /> 
            Sinkronisasi Data Terbaru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}