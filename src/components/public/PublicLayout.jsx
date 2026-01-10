import { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { 
  Search, 
  LayoutDashboard, 
  UserCircle, 
  LogOut, 
  Briefcase,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin 
} from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants"; 
import { cn } from "@/lib/utils"; 

// IMPORT AUTH, MODAL & BANNER
import { useAuth } from "../../contexts/AuthContext";
import CartModal from "./CartModal"; 
import OrderDetailModal from "./OrderDetailModal"; 
import BroadcastBanner from "@/components/public/BroadcastBanner"; // Import Banner Siaran Global

export default function PublicLayout() {
  const { user, isAuthenticated, isAdmin, isStaff, isManager, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  const dashboardPath = isManager ? "/manager" : "/admin";

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ================= GLOBAL BROADCAST SYSTEM ================= */}
      {/* Banner ini akan otomatis muncul/hilang berdasarkan state managerBroadcast di user */}
      <BroadcastBanner />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col py-4 gap-4">
            
            <div className="flex justify-between items-center w-full">
              <Link to="/" className="group flex flex-col items-start gap-0">
                <h1 className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic leading-none transition-colors">
                  <span className="text-blue-600">Product</span>
                  <span className="text-slate-900">Store</span>
                </h1>
                
                {isAuthenticated && (
                  <div className="flex items-center gap-1.5 mt-1 animate-in fade-in duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      Member: <span className="text-slate-900">{user?.name}</span>
                    </p>
                  </div>
                )}
              </Link>

              <nav className="flex items-center gap-2 sm:gap-4">
                <div 
                  className={cn(
                    "relative flex items-center bg-slate-100 rounded-full transition-all duration-300 ease-in-out px-3 h-11",
                    isOpen ? "w-48 sm:w-64 bg-white border-2 border-blue-600 shadow-lg shadow-blue-50" : "w-11 justify-center cursor-pointer hover:bg-slate-200"
                  )}
                  onClick={() => !isOpen && setIsOpen(true)}
                >
                  <Search size={18} className={cn("transition-colors", isOpen ? "text-blue-600" : "text-slate-600")} />
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
                </div>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {(isAdmin || isStaff || isManager) && (
                      <Link 
                        to={dashboardPath} 
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg",
                          isManager ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-blue-600"
                        )}
                      >
                        {isManager ? <Briefcase size={14} /> : <LayoutDashboard size={14} />}
                        <span className="hidden sm:block">{isManager ? "Manager Suite" : "Dashboard"}</span>
                      </Link>
                    )}
                    <OrderDetailModal />
                    <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-red-600 rounded-2xl px-3">
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full bg-white">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
          <Outlet context={{ searchQuery, selectedCategory }} /> 
        </div>
      </main>

      {/* ================= MODERN FOOTER ================= */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 rounded-t-[3rem] mt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
            
            {/* BRAND SECTION */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
                <span className="text-blue-500">Product</span>Store
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                Destinasi utama untuk produk teknologi terbaik dengan kualitas terjamin dan layanan purna jual kelas dunia.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 transition-all group">
                  <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-all group">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Navigasi</h3>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Beranda</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Katalog Produk</Link></li>
                <li><Link to="/broadcast" className="text-slate-400 hover:text-white transition-colors">Promo Spesial</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>

            {/* CONTACT & SUPPORT */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Hubungi Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <Phone size={14} />
                  </div>
                  <a href="https://wa.me/6285524505684" target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">WhatsApp CS</a>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">support@techstore.id</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <MapPin size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Jakarta, Indonesia</span>
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Update Terbaru</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Dapatkan info promo langsung di emailmu</p>
              <div className="flex gap-2">
                <Input placeholder="Email anda..." className="bg-slate-800 border-none rounded-xl text-[10px] font-bold h-10" />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl h-10 px-4">Kirim</Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2026 TechStore Systems Group. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}