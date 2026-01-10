import { useState, useEffect } from "react";
import { Megaphone, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // --- LOGIKA INTELIJEN: DISTRIBUSI PESAN TERPUSAT ---
  useEffect(() => {
    const syncGlobalBroadcast = async () => {
      try {
        // 1. Tarik seluruh data personel dari registri pusat
        const res = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
        const allUsers = await res.json();
        
        /**
         * 2. LOGIKA PENYARINGAN (The Core Logic):
         * Kita tidak peduli siapa yang sedang login. Kita hanya mencari 
         * pesan dari user yang memiliki peran 'manager'. 
         * Meskipun ID 2 (Ahmad) kosong, Ahmad akan tetap melihat pesan dari ID 1 (Imam).
         */
        const managerSource = allUsers.find(u => 
          u.role === "manager" && 
          u.managerBroadcast && 
          u.managerBroadcast.trim() !== ""
        );
        
        if (managerSource) {
          const currentMsg = managerSource.managerBroadcast;
          
          // 3. UX Check: Jangan munculkan jika user sudah menutup pesan ini sebelumnya
          const dismissedMsg = sessionStorage.getItem("last_dismissed_broadcast");
          
          if (dismissedMsg !== currentMsg) {
            setBroadcast(currentMsg);
            setIsVisible(true);
          }
        } else {
          // Jika Manager menghapus pesan, banner otomatis hilang di semua perangkat
          setIsVisible(false);
          setBroadcast("");
        }
      } catch (err) {
        console.error("Sistem gagal sinkronisasi:", err);
      }
    };

    syncGlobalBroadcast();
    
    // Sinkronisasi otomatis setiap 30 detik untuk "Real-time Feel"
    const interval = setInterval(syncGlobalBroadcast, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Simpan ke session agar banner tidak muncul lagi sampai pesan diganti manager
    sessionStorage.setItem("last_dismissed_broadcast", broadcast);
  };

  if (!isVisible || !broadcast) return null;

  return (
    <div className="relative z-[100] w-full bg-slate-950 border-b border-indigo-500/30 shadow-[0_4px_25px_rgba(79,70,229,0.3)] overflow-hidden animate-in slide-in-from-top duration-700">
      
      {/* Visual Overlay: Tech & Luxury Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-rose-900/40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-10">
        <div className="flex items-center justify-between gap-6">
          
          {/* Sisi Kiri: Konten Intelijen Strategis */}
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.6)] border border-indigo-400/30">
              <Megaphone size={18} className="animate-bounce" />
            </div>
            
            <div className="flex flex-col text-left overflow-hidden">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 leading-none">Pusat Informasi</p>
              </div>
              <p className="text-xs font-bold text-slate-100 truncate tracking-wide italic leading-tight">
                {broadcast}
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Kontrol & Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <Zap size={10} className="text-amber-400 fill-current" />
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest italic leading-none">Live Campaign</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="h-8 w-8 rounded-full hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition-all border border-slate-800 hover:border-rose-500/40"
            >
              <X size={16} />
            </Button>
          </div>

        </div>
      </div>

      {/* Aesthetic Progress Line */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full opacity-60"></div>
    </div>
  );
}