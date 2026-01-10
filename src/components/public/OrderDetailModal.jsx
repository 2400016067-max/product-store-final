import React, { useState, useMemo, useEffect } from "react"; // Tambahkan useEffect
import { 
  Package, RefreshCw, Box, Truck, CheckCircle2, 
  MapPin, Loader2, X, HelpCircle, History, Clock
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
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailModal() {
  const { user, isViewer, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. LOGIKA AUTO-REFRESH (POLLING) [cite: 2026-01-10]
  useEffect(() => {
    if (!isViewer || !user) return;

    // Sinkronisasi otomatis setiap 20 detik
    const pollingInterval = setInterval(() => {
      console.log("Auto-Syncing Logistic Data...");
      refreshUserData();
    }, 20000); 

    // Cleanup untuk mencegah memory leak saat modal ditutup
    return () => clearInterval(pollingInterval);
  }, [isViewer, user?.id, refreshUserData]);

  if (!isViewer) return null;

  // HELPER: Format Waktu Lokal (id-ID)
  const formatOrderTime = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusStep = (status) => {
    if (status?.includes("Diproses")) return 1;
    if (status?.includes("Perjalanan") || status?.includes("Dikirim")) return 2;
    if (status?.includes("Selesai") || status?.includes("Diterima")) return 3;
    return 0; 
  };

  const currentStep = getStatusStep(user?.orderStatus);

  const statusSteps = useMemo(() => {
    const lastUpdate = user?.orderDate ? formatOrderTime(user.orderDate) : "Menunggu";
    
    return [
      { label: "Order Placed", icon: Box, date: "Confirmed" },
      { 
        label: "Processing", 
        icon: RefreshCw, 
        date: currentStep === 1 ? lastUpdate : (currentStep > 1 ? "Success" : "-") 
      },
      { 
        label: "In Transit", 
        icon: Truck, 
        date: currentStep === 2 ? lastUpdate : (currentStep > 2 ? "Success" : "-") 
      },
      { 
        label: "Delivered", 
        icon: MapPin, 
        date: currentStep === 3 ? lastUpdate : "Estimated" 
      },
    ];
  }, [user?.orderDate, currentStep]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const handleSupport = () => {
    const waMsg = `Halo Admin, saya ingin menanyakan status pesanan saya (ID: USR-${user?.id?.slice(0, 8)})`;
    window.open(`https://wa.me/6282220947302?text=${encodeURIComponent(waMsg)}`, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 bg-white border border-slate-200 pl-4 pr-2 py-1.5 rounded-2xl hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm group active:scale-95">
          <div className="flex flex-col text-left leading-none">
            {/* LIVE INDICATOR DOT */}
            <div className="flex items-center gap-1 mb-1">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
               </span>
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tracking</span>
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {user?.orderStatus || "Check Status"}
            </span>
          </div>
          <div className="p-2 bg-blue-600 text-white rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <Truck size={14} className={currentStep > 0 && currentStep < 3 ? "animate-pulse" : ""} />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-[3.5rem] border-none shadow-2xl p-0 overflow-hidden font-sans bg-white animate-in zoom-in-95 duration-300">
        
        {/* HEADER SECTION */}
        <div className={cn(
          "p-10 text-white relative overflow-hidden transition-all duration-700",
          currentStep === 3 ? "bg-emerald-600" : "bg-slate-950"
        )}>
          <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all outline-none">
            <X size={18} className="text-white" />
          </DialogClose>

          <div className="absolute -right-10 -top-10 opacity-20 rotate-12 bg-white w-64 h-64 rounded-full blur-3xl animate-pulse"></div>
          
          <DialogHeader className="relative z-10 text-left">
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-white/20 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white">
                 Live Database Sync
               </Badge>
            </div>
            <DialogTitle className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85]">
              Package <br /> <span className="text-blue-400">Timeline</span>
            </DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-4">
              Auto-refresh active for USR-{user?.id?.slice(0, 12)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 bg-white">
          
          {/* TIMELINE PROGRESS INDICATOR */}
          <div className="relative pt-4">
            <div className="flex justify-between items-start px-2 relative">
              <div className="absolute top-5 h-[2px] bg-slate-100 w-[80%] left-1/2 -translate-x-1/2 z-0"></div>
              <div 
                className="absolute top-5 h-[2px] bg-blue-600 transition-all duration-1000 z-0 left-[10%]" 
                style={{ width: `${(currentStep / 3) * 80}%` }}
              ></div>

              {statusSteps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = currentStep >= idx;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center group">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl",
                      isActive ? "bg-blue-600 text-white scale-110" : "bg-slate-100 text-slate-400"
                    )}>
                      <Icon size={16} className={isActive && idx === currentStep ? "animate-pulse" : ""} />
                    </div>
                    <span className={cn(
                      "text-[8px] font-black uppercase mt-3 tracking-tighter text-center max-w-[60px]",
                      isActive ? "text-slate-900" : "text-slate-300"
                    )}>{s.label}</span>
                    <span className="text-[7px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">{s.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {isRefreshing ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-slate-50 rounded-[2.5rem]"></div>
                <div className="h-32 bg-slate-50 rounded-[2.5rem]"></div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Package size={80} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Shipping Manifest</span>
                  <p className="text-lg font-black text-slate-900 leading-none uppercase italic">
                    {user?.orderProduct || "No Active Package"}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <History size={12} className="text-blue-600" />
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                      Last Update: {user?.orderDate ? formatOrderTime(user.orderDate) : "Awaiting..."}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-7 rounded-[2.5rem] rounded-bl-none shadow-2xl relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Logistics Instructions</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed italic opacity-90">
                    "{user?.adminMessage || "Your package is being prepared by our fulfillment team."}"
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline" 
              className="h-14 rounded-3xl gap-3 font-black text-[10px] uppercase tracking-[0.2em] border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all"
            >
              {isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={14} />}
              {isRefreshing ? "Synchronizing Data..." : "Manual Sync"}
            </Button>

            <Button 
              onClick={handleSupport}
              className="h-14 rounded-3xl gap-3 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-100 hover:bg-rose-50 text-slate-900 hover:text-rose-600 border-none transition-all"
            >
              <HelpCircle size={14} />
              Bantuan Logistik
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}