import { useState, useRef, useEffect } from "react"; // 1. TAMBAHKAN useRef & useEffect
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
// 2. TAMBAHKAN "X" di lucide-react
import { Search, LayoutDashboard, LogIn, UserCircle, LogOut, X } from "lucide-react"; 
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
  
  // 3. STATE & REF BARU UNTUK SEARCH
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Otomatis fokus saat input terbuka
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ================= HEADER: GLASSMORPHISM EFFECT ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col py-4 gap-4">
            
            {/* BARIS UTAMA: LOGO, SEARCH (MODERN), & NAVIGASI */}
<div className="flex justify-between items-center w-full">
  <Link to="/" className="group flex flex-col items-start gap-0">
    <h1 className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic leading-none transition-colors">
      <span className="text-blue-600">Product</span>
      <span className="text-slate-900">Store</span>
    </h1>
    
    {isAuthenticated && (
      <div className="flex items-center gap-1.5 mt-1 animate-in fade-in duration-500">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Member: <span className="text-slate-900">{user?.name}</span>
        </p>
      </div>
    )}
  </Link>

              {/* ACTION CENTER */}
              <nav className="flex items-center gap-2 sm:gap-4">
                
                {/* 4. TOMBOL SEARCH BARU (EXPANDABLE) */}
                <div 
                  className={cn(
                    "relative flex items-center bg-slate-100 rounded-full transition-all duration-300 ease-in-out px-3 h-11",
                    isOpen ? "w-48 sm:w-64 bg-white border-2 border-blue-600 shadow-lg shadow-blue-50" : "w-11 justify-center cursor-pointer hover:bg-slate-200"
                  )}
                  onClick={() => !isOpen && setIsOpen(true)}
                >
                  <Search 
                    size={18} 
                    className={cn(
                      "transition-colors",
                      isOpen ? "text-blue-600" : "text-slate-600"
                    )} 
                  />
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari..."
                    className={cn(
                      "bg-transparent border-none outline-none text-sm font-bold ml-2 transition-all duration-300",
                      isOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsOpen(false); }}
                  />

                  {isOpen && searchQuery && (
                    <button onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}>
                      <X size={14} className="text-slate-400 hover:text-red-500" />
                    </button>
                  )}
                </div>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {(isAdmin || isStaff) && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-lg"
                      >
                        <LayoutDashboard size={14} />
                        <span className="hidden sm:block">Dashboard</span>
                      </Link>
                    )}
                    <OrderDetailModal />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={logout} 
                      className="text-slate-400 hover:text-red-600 rounded-2xl px-3"
                    >
                      <LogOut size={16} />
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="bg-blue-600 text-white rounded-2xl px-6 h-11 shadow-xl flex gap-2">
                      <UserCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
                    </Button>
                  </Link>
                )}

                <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>
                <CartModal />
              </nav>
            </div>
          </div>

          {/* KATEGORI NAVIGATION */}
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide border-t border-slate-50">
            {["Semua", ...CATEGORIES].map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full text-[10px] font-black uppercase tracking-[0.2em] px-6 py-5 whitespace-nowrap border-2 transition-all",
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                    : "text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT & FOOTER (TIDAK BERUBAH) ================= */}
      <main className="flex-1 w-full bg-white">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
          <Outlet context={{ searchQuery, selectedCategory }} /> 
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-16 px-6 rounded-t-[3rem]">
        {/* ... (isi footer sama seperti sebelumnya) */}
      </footer>
    </div>
  );
}