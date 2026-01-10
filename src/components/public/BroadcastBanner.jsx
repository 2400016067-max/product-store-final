import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Megaphone, X, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BroadcastBanner() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // LOGIKA SISTEM: Monitor perubahan pesan siaran secara real-time
  useEffect(() => {
    // Banner aktif jika user login DAN memiliki pesan yang belum dibaca
    if (isAuthenticated && user?.managerBroadcast && user.managerBroadcast !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user?.managerBroadcast, isAuthenticated]);

  const handleDismiss = async () => {
    // 1. UI Feedback Instan (Optimistic Update)
    setIsVisible(false);

    try {
      // 2. Sinkronisasi Database: Hapus pesan agar tidak muncul lagi di perangkat lain
      if (isAuthenticated) {
        await updateProfile({ managerBroadcast: "" });
      }
    } catch (err) {
      console.error("Sistem gagal mengarsip siaran:", err);
      // Opsi: Tampilkan toast error jika diperlukan
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-[100] w-full bg-slate-950 border-b border-indigo-500/30 shadow-[0_4px_20px_rgba(79,70,229,0.2)] overflow-hidden animate-in slide-in-from-top duration-500">
      
      {/* Background Tech-Layer */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-rose-900/40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 relative z-10">
        <div className="flex items-center justify-between gap-6">
          
          {/* Sisi Kiri: Pesan Intelijen */}
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.6)]">
              <Megaphone size={16} className="animate-bounce" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 overflow-hidden text-left">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Priority Link</p>
              </div>
              <p className="text-xs font-bold text-slate-100 truncate tracking-wide leading-none">
                {user?.managerBroadcast}
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Kontrol Aksi */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <Zap size={10} className="text-amber-400" />
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest italic">Live Campaign</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="h-8 w-8 rounded-full hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition-all border border-slate-800 hover:border-rose-500/40"
            >
              <X size={14} />
            </Button>
          </div>

        </div>
      </div>

      {/* Progress Bar Decor (Aesthetic Only) */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-indigo-500 animate-progress-glow w-full"></div>
    </div>
  );
}