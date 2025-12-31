import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Search, LayoutDashboard, LogIn, UserCircle, LogOut } from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants"; 
import { cn } from "@/lib/utils"; 

// IMPORT AUTH & MODAL
import { useAuth } from "../../contexts/AuthContext";
import CartModal from "./CartModal"; // Menggunakan desain terbaru
import OrderDetailModal from "./OrderDetailModal"; // Menggunakan desain terbaru

export default function PublicLayout() {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ================= HEADER: GLASSMORPHISM EFFECT ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col py-4 gap-4">
            
            {/* BARIS UTAMA: LOGO & NAVIGASI */}
            <div className="flex justify-between items-center w-full">
              {/* BRANDING SECTION */}
              <Link to="/" className="group flex flex-col items-start gap-0">
                <h1 className="font-black text-2xl md:text-3xl tracking-tighter text-slate-900 uppercase italic leading-none group-hover:text-blue-600 transition-colors">
                  Product<span className="text-blue-600">Store</span>
                </h1>
                {isAuthenticated && (
                  <div className="flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-left-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Member: <span className="text-slate-900">{user?.name}</span>
                    </p>
                  </div>
                )}
              </Link>

              {/* ACTION CENTER */}
              <nav className="flex items-center gap-2 sm:gap-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* PANEL ADMIN/STAFF: Desain Bold & Ringkas */}
                    {(isAdmin || isStaff) && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-200"
                      >
                        <LayoutDashboard size={14} />
                        <span className="hidden sm:block">Dashboard</span>
                      </Link>
                    )}
                    
                    {/* MODAL PELACAKAN PESANAN */}
                    <OrderDetailModal />
                    
                    {/* LOGOUT BUTTON */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={logout} 
                      className="group flex items-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-2 transition-all active:scale-95"
                    >
                      <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                      <span className="text-[10px] font-black uppercase hidden xs:block tracking-widest">Keluar</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button 
                      variant="default" 
                      className="bg-blue-600 hover:bg-slate-900 text-white rounded-2xl px-6 h-10 shadow-xl shadow-blue-100 flex gap-2 transition-all active:scale-95 border-none"
                    >
                      <UserCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
                    </Button>
                  </Link>
                )}

                <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>
                
                {/* MODAL KERANJANG */}
                <CartModal />
              </nav>
            </div>

            {/* BARIS KEDUA: SEARCH BAR - Terpusat & Fokus */}
            <div className="relative w-full max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-blue-100/30 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input 
                  placeholder="Cari koleksi produk terbaru..." 
                  className="pl-12 h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:bg-white shadow-sm transition-all font-medium text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* KATEGORI NAVIGATION: Desain Pill yang Modern */}
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide border-t border-slate-50">
            {["Semua", ...CATEGORIES].map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all px-5 py-5 whitespace-nowrap border-2 border-transparent",
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 w-full bg-white">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 animate-in fade-in duration-700">
          <Outlet context={{ searchQuery, selectedCategory }} /> 
        </div>
      </main>

      {/* ================= FOOTER: MINIMALIST & BOLD ================= */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
                Product<span className="text-blue-500">Store</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Curated Excellence Since 2025</p>
            </div>
            
            <div className="flex gap-6">
              {["Instagram", "WhatsApp", "Support"].map((item) => (
                <button key={item} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-center md:text-left">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              © 2025 Team 404 Not Found — Technology Exhibition
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">
              Empowered by React & Firebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}