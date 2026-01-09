import React, { useState } from "react";
import { 
  Package, 
  RefreshCw, 
  MessageSquare, 
  Clock, 
  Box, 
  Truck, 
  CheckCircle2,
  MapPin,
  Loader2
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription, // Import sudah benar
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailModal() {
  const { user, isViewer, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isViewer) return null;

  const getStatusStep = (status) => {
    if (status?.includes("Diproses")) return 1;
    if (status?.includes("Perjalanan") || status?.includes("Dikirim")) return 2;
    if (status?.includes("Selesai") || status?.includes("Diterima")) return 3;
    return 0; 
  };

  const currentStep = getStatusStep(user?.orderStatus);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 bg-white border border-slate-200 pl-4 pr-2 py-1.5 rounded-2xl hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm group active:scale-95">
          <div className="flex flex-col text-left leading-none">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Live Tracking</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {user?.orderStatus || "No Order"}
            </span>
          </div>
          <div className="p-2 bg-blue-600 text-white rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <Truck size={14} className={currentStep > 0 ? "animate-pulse" : ""} />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden font-sans bg-white animate-in zoom-in-95 duration-300">
        
        {/* HEADER SECTION */}
        <div className={cn(
          "p-10 text-white relative overflow-hidden transition-colors duration-500",
          currentStep === 3 ? "bg-emerald-600" : "bg-slate-900"
        )}>
          <div className="absolute -right-10 -top-10 opacity-20 rotate-12 bg-white w-64 h-64 rounded-full blur-3xl"></div>
          
          <DialogHeader className="relative z-10 text-left">
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                 Real-time System v1.1
               </Badge>
            </div>
            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3 leading-none">
              Order <br /> Tracking
            </DialogTitle>
            
            {/* FIX: Menambahkan DialogDescription untuk Aksesibilitas & Menghilangkan Warning */}
            <DialogDescription className="sr-only">
              Informasi pelacakan pesanan real-time untuk pengguna dengan ID {user?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 flex items-center justify-between relative z-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em]">Customer ID</span>
              <span className="text-xs font-mono font-bold tracking-wider">USR-{user?.id?.slice(0, 8)}</span>
            </div>
            {currentStep === 3 && <CheckCircle2 size={40} className="text-white animate-bounce" />}
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="relative flex justify-between items-center px-4 py-2">
            <div className="absolute h-[2px] bg-slate-100 w-[80%] left-1/2 -translate-x-1/2 z-0"></div>
            <div 
              className="absolute h-[2px] bg-blue-600 transition-all duration-1000 ease-out z-0 left-[10%]" 
              style={{ width: `${(currentStep / 3) * 80}%` }}
            ></div>

            {[0, 1, 2, 3].map((step) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md",
                  currentStep >= step ? "bg-blue-600 text-white scale-110" : "bg-slate-200 text-slate-400"
                )}>
                  {step === 0 && <Box size={12} />}
                  {step === 1 && <RefreshCw size={12} className={currentStep === 1 ? "animate-spin" : ""} />}
                  {step === 2 && <Truck size={12} className={currentStep === 2 ? "animate-bounce" : ""} />}
                  {step === 3 && <MapPin size={12} />}
                </div>
              </div>
            ))}
          </div>

          {/* PRODUCT CARD */}
          <div className="space-y-3 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detail Item</span>
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 hover:border-blue-100 transition-all group">
              <p className="text-base font-black text-slate-900 leading-tight uppercase italic">
                {user?.orderProduct || "Belum ada pesanan terdeteksi"}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Premium Packaging Included</span>
              </div>
            </div>
          </div>

          {/* ADMIN MESSAGE BUBBLE */}
          <div className="relative group text-left">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-600 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
            <div className="pl-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Pesan Logistik</span>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] rounded-bl-none shadow-xl">
                <p className="text-xs font-medium leading-relaxed opacity-90 italic">
                  "{user?.adminMessage || "Pesanan Anda masuk ke sistem. Menunggu kurir mengambil paket."}"
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline" 
            className="w-full h-14 rounded-3xl gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border-2 border-dashed group"
          >
            {isRefreshing ? (
              <Loader2 size={16} className="animate-spin text-blue-600" />
            ) : (
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            )}
            {isRefreshing ? "Menghubungkan Server..." : "Sinkronisasi Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}