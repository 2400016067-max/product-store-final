import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Search, LayoutDashboard } from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants"; 
import { cn } from "@/lib/utils"; 

// IMPORT AUTH & MODAL [cite: 2025-12-13, 2025-12-22]
import { useAuth } from "../../contexts/AuthContext";
import CartModal from "./CartModal"; 
// SEPARATED COMPONENT [cite: 2025-09-29]
import OrderDetailModal from "./OrderDetailModal"; 

export default function PublicLayout() {
  const { user, isAuthenticated, isAdmin, isStaff } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ================= HEADER ================= */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          
          {/* LOGO */}
          <Link to="/" className="font-extrabold text-xl tracking-tighter text-blue-600 uppercase">
            ProductStore
          </Link>

          {/* SEARCH BAR (Tengah) */}
          <div className="relative w-full md:w-96 order-last md:order-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Cari produk favoritmu..." 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-blue-600 h-10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* NAVIGASI & STATUS (Kanan) */}
          <nav className="flex items-center gap-3">
            
            {/* 1. Quick Access untuk Admin/Staff [cite: 2025-09-29] */}
            {(isAdmin || isStaff) && (
              <Link 
                to="/admin" 
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <LayoutDashboard size={14} />
                Panel {user.role}
              </Link>
            )}

            {/* 2. MODULAR TRACKING: Panggilan Komponen Terpisah [cite: 2025-09-29] */}
            <OrderDetailModal />

            {/* Navigasi Umum */}
            <Link to="/" className="px-2 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Katalog
            </Link>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Keranjang Belanja [cite: 2025-12-22] */}
            <CartModal />
          </nav>
        </div>

        {/* FILTER KATEGORI */}
        <div className="container mx-auto px-4 mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-t pt-2 md:border-t-0 md:pt-0">
          {["Semua", ...CATEGORIES].map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full text-[11px] font-black uppercase tracking-widest transition-all px-4",
                selectedCategory === cat 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100" 
                  : "text-slate-400 hover:bg-slate-50"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 container mx-auto p-6">
        {/* Mengirim context pencarian ke halaman katalog */}
        <Outlet context={{ searchQuery, selectedCategory }} /> 
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="p-8 border-t bg-slate-50 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-slate-900 font-black tracking-tighter uppercase leading-none italic">ProductStore</p>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">© 2025 Imam & Team - IS Project</p>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {(isAdmin || isStaff) && (
                  <Link 
                    to="/admin" 
                    className="text-[10px] uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 font-black transition-all border-b border-blue-200"
                  >
                    Ke Dashboard
                  </Link>
                )}
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  User: {user.name} ({user.role})
                </span>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-[10px] uppercase tracking-[0.2em] text-slate-300 hover:text-blue-600 font-black transition-all"
              >
                Staff Access
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}