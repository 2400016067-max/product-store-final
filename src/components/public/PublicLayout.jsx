import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; // Tambah useLocation
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { motion, AnimatePresence } from "framer-motion"; // Tambah Framer Motion
import { 
  Search, LayoutDashboard, UserCircle, LogOut, Briefcase,
  Instagram, Twitter, Facebook, Mail, Phone, MapPin, ChevronUp 
} from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants"; 
import { cn } from "@/lib/utils"; 

import { useAuth } from "../../contexts/AuthContext";
import CartModal from "./CartModal"; 
import OrderDetailModal from "./OrderDetailModal"; 
import BroadcastBanner from "@/components/public/BroadcastBanner";

export default function PublicLayout() {
  const { user, isAuthenticated, isAdmin, isStaff, isManager, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State untuk efek scroll
  const searchInputRef = useRef(null);
  const location = useLocation();

  const dashboardPath = isManager ? "/manager" : "/admin";

  // Efek Deteksi Scroll untuk Header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white">
      
      <BroadcastBanner />

      {/* ================= HEADER DENGAN EFEK GLASSMORPHISM ================= */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl py-2 shadow-sm border-slate-100" 
          : "bg-white py-4 border-transparent"
      )}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              
              {/* LOGO DENGAN ANIMASI HOVER */}
              <Link to="/" className="group flex flex-col items-start">
                <motion.h1 
                  whileHover={{ scale: 1.02 }}
                  className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic leading-none"
                >
                  <span className="text-blue-600 group-hover:text-indigo-600 transition-colors">Product</span>
                  <span className="text-slate-900">Store</span>
                </motion.h1>
                
                {isAuthenticated && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 mt-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Status: <span className="text-slate-900">{user?.name}</span>
                    </p>
                  </motion.div>
                )}
              </Link>

              <nav className="flex items-center gap-2 sm:gap-4">
                {/* SEARCH BAR EKSPANDEL DENGAN FRAMER MOTION */}
                <motion.div 
                  initial={false}
                  animate={{ width: isOpen ? (window.innerWidth < 640 ? 180 : 300) : 44 }}
                  className={cn(
                    "relative flex items-center bg-slate-100 rounded-full h-11 overflow-hidden transition-colors",
                    isOpen ? "bg-white border-2 border-blue-600 shadow-md" : "hover:bg-slate-200"
                  )}
                  onClick={() => !isOpen && setIsOpen(true)}
                >
                  <div className="pl-3.5 text-slate-500">
                    <Search size={18} className={isOpen ? "text-blue-600" : ""} />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari produk impian..."
                    className={cn(
                      "bg-transparent border-none outline-none text-sm font-bold ml-2 w-full pr-4",
                      !isOpen && "hidden"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsOpen(false); }}
                  />
                </motion.div>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    {(isAdmin || isStaff || isManager) && (
                      <Link to={dashboardPath}>
                        <Button className={cn(
                          "rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
                          isManager ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-blue-600"
                        )}>
                          {isManager ? <Briefcase size={14} className="mr-2" /> : <LayoutDashboard size={14} className="mr-2" />}
                          <span className="hidden sm:inline">Dashboard</span>
                        </Button>
                      </Link>
                    )}
                    <OrderDetailModal />
                    <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl">
                      <LogOut size={18} />
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 h-11 shadow-blue-200 shadow-lg flex gap-2 active:scale-95 transition-transform">
                      <UserCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
                    </Button>
                  </Link>
                )}
                <div className="h-6 w-[px] bg-slate-200 mx-1 hidden sm:block" />
                <CartModal />
              </nav>
            </div>
          </div>

          {/* ================= CATEGORY BAR DENGAN ACTIVE INDICATOR ================= */}
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide border-t border-slate-50 relative">
            {["Semua", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "relative rounded-full text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 whitespace-nowrap transition-all duration-300",
                  selectedCategory === cat ? "text-white" : "text-slate-400 hover:text-slate-900"
                )}
              >
                <span className="relative z-10">{cat}</span>
                {selectedCategory === cat && (
                  <motion.div 
                    layoutId="activeCategory" // Animasi sliding antar tombol
                    className="absolute inset-0 bg-slate-900 rounded-full shadow-lg shadow-slate-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT DENGAN FADE IN ================= */}
      <main className="flex-1 w-full bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} // Re-animate saat pindah halaman
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 md:px-6 py-10 md:py-16"
          >
            <Outlet context={{ searchQuery, selectedCategory }} /> 
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ================= FOOTER PREMIUM ================= */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 rounded-t-[4rem] relative overflow-hidden">
        {/* Ornamen Background (Opsional) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            
            <div className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                <span className="text-blue-500">Product</span>Store
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Elevating your digital lifestyle with handpicked premium technology. 
                Experience the future, today.
              </p>
              <div className="flex gap-3">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <motion.a 
                    key={i} href="#" 
                    whileHover={{ y: -5 }}
                    className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8 italic">Directory</h3>
              <ul className="space-y-4">
                {['Beranda', 'Katalog', 'Promo', 'Tentang'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-400 hover:text-white transition-all hover:pl-2 font-bold text-sm block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8 italic">Support</h3>
              <div className="space-y-4">
                <a href="https://wa.me/6285524505684" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-green-600 transition-all">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">Live Chat</span>
                </a>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">Email Support</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Insiders</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Unlock exclusive deals and early access.</p>
              <div className="flex flex-col gap-3">
                <Input placeholder="Your email..." className="bg-slate-900 border-none rounded-xl h-12 px-4 focus:ring-2 ring-blue-600" />
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
              © 2026 ProductStore Systems. Engineered for Excellence.
            </p>
            <div className="flex gap-8">
              <Link to="#" className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
              <Link to="#" className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}