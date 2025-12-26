import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Search, LayoutDashboard, LogIn } from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants"; 
import { cn } from "@/lib/utils"; 

// IMPORT AUTH & MODAL
import { useAuth } from "../../contexts/AuthContext";
import CartModal from "./CartModal"; 
import OrderDetailModal from "./OrderDetailModal"; 

export default function PublicLayout() {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ================= HEADER ================= */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col gap-4">
          
          {/* BARIS ATAS: Logo & Nav Aksi */}
          <div className="flex justify-between items-center w-full">
            {/* KIRI: LOGO & USERNAME */}
            <div className="flex flex-col items-start">
              <Link to="/" className="font-extrabold text-lg md:text-xl tracking-tighter text-blue-600 uppercase">
                ProductStore
              </Link>
              {isAuthenticated && (
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 leading-none">
                  Halo, <span className="text-blue-600 font-black">{user?.name}</span>
                </p>
              )}
            </div>

            {/* KANAN: NAVIGASI AKSI */}
            <nav className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* FIX: Hapus 'hidden sm:flex' agar muncul di mobile */}
                  {(isAdmin || isStaff) && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-900 text-white rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                    >
                      <LayoutDashboard size={12} />
                      <span className="hidden xs:block">Panel</span>
                    </Link>
                  )}
                  
                  <OrderDetailModal />
                  
                  <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-red-600 p-1 sm:p-2">
                     <span className="text-[9px] sm:text-[10px] font-bold uppercase">Keluar</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 flex gap-2 h-8">
                    <LogIn size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Login</span>
                  </Button>
                </Link>
              )}

              <div className="h-5 w-px bg-slate-200 mx-0.5"></div>
              <CartModal />
            </nav>
          </div>

          {/* BARIS BAWAH: SEARCH BAR */}
          <div className="relative w-full md:max-w-md md:mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Cari produk..." 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-blue-600 h-10 shadow-sm text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER KATEGORI */}
        <div className="container mx-auto px-4 mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-t pt-2">
          {["Semua", ...CATEGORIES].map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full text-[10px] font-black uppercase tracking-widest transition-all px-3 whitespace-nowrap",
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
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Outlet context={{ searchQuery, selectedCategory }} /> 
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="p-6 border-t bg-slate-50 mt-auto">
        <div className="container mx-auto px-4 text-center md:text-left">
          <p className="text-xs text-slate-900 font-black tracking-tighter uppercase leading-none italic">ProductStore</p>
          <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-1">© 2025 Imam & Team - IS Project</p>
        </div>
      </footer>
    </div>
  );
}