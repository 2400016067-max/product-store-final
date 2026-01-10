import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import {
  LogOut,
  LayoutDashboard,
  Store,
  UserCheck,
  Shield,
  UserCog,
  Search,
  Package,
  Menu,
  X,
  ArrowRightLeft,
  Briefcase,
  Bell,
  Activity,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// IMPORT KOMPONEN STICKY NOTE [cite: 2025-11-02]
import StickyNoteCard from "../shared/StickyNoteCard";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, refreshUserData } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // LOGIKA SINKRONISASI: Ambil data terbaru setiap pindah halaman [cite: 2025-12-26]
  useEffect(() => {
    refreshUserData();
  }, [location.pathname]);

  // Otomatis tutup sidebar mobile saat pindah rute
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Konfirmasi Terminal: Apakah Anda ingin memutus koneksi sesi operasional?")) {
      logout();
      navigate("/login");
    }
  };

  const getRoleTheme = () => {
    const role = user?.role?.toLowerCase();
    if (role === "admin") return { color: "bg-rose-600", badge: "bg-rose-50 text-rose-700 border-rose-100", icon: <Shield size={10} className="mr-1" />, label: "Root Admin" };
    if (role === "manager") return { color: "bg-indigo-600", badge: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: <Briefcase size={10} className="mr-1" />, label: "Manager" };
    return { color: "bg-blue-600", badge: "bg-blue-50 text-blue-600 border-blue-100", icon: <UserCheck size={10} className="mr-1" />, label: "Staff Ops" };
  };

  const theme = getRoleTheme();
  const isActive = (path) => location.pathname === path;
  const hasNotes = Array.isArray(user?.personalNotes) && user.personalNotes.length > 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 text-left overflow-x-hidden">
      
      {/* ================= MOBILE HEADER (Logo + Hamburger) ================= */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-[60] shadow-sm">
          <div className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full animate-pulse", theme.color)}></div>
            <h2 className="font-black text-xl tracking-tighter text-slate-900 uppercase italic">Operasional</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-xl text-slate-900">
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
      </div>

      {/* ================= MOBILE SIDEBAR BACKDROP ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR: OPERATIONAL INTERFACE ================= */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-[55] h-full md:h-screen w-80 bg-white p-8 flex flex-col border-r border-slate-200 transition-transform duration-500 ease-in-out shadow-2xl md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Brand Identity (Desktop Only) */}
        <div className="mb-12 px-2 hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("h-4 w-4 rounded-full animate-pulse shadow-lg", theme.color)}></div>
            <h2 className="font-black text-3xl tracking-tighter text-slate-900 uppercase italic leading-none">Operasional</h2>
          </div>
          <p className="text-[9px] text-slate-900 uppercase tracking-[0.4em] font-black pl-7">Sistem Pusat Inventaris</p>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-4 mb-4">Rincian Pemesanan</p>
            <SidebarLink to="/admin" active={isActive("/admin")} icon={<LayoutDashboard size={20} />} label="Inventory" />
            <SidebarLink to="/admin/orders" active={isActive("/admin/orders")} icon={<Package size={20} />} label="Pesanan" />
          </div>

          {user?.role?.toLowerCase() === "admin" && (
            <div className="space-y-2 text-left">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-4 mb-4">Security Layer</p>
              <SidebarLink to="/admin/users" active={isActive("/admin/users")} icon={<UserCog size={20} />} label="Otoritas" variant="danger" />
            </div>
          )}

          {user?.role?.toLowerCase() === "manager" && (
            <div className="pt-6 border-t border-slate-200">
               <Link to="/manager" className="flex items-center justify-between p-5 rounded-[1.8rem] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 group">
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                    Manager Suite
                  </span>
                  <Zap size={14} fill="currentColor" />
               </Link>
            </div>
          )}
        </nav>

        {/* User Presence Card */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-left">
          <div className="p-5 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner border border-white/10", theme.color)}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate uppercase tracking-tighter italic">{user?.username}</p>
                <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase border mt-1 shadow-sm", theme.badge)}>
                  {theme.icon} {theme.label}
                </div>
              </div>
            </div>
            <Activity className="absolute -right-4 -bottom-4 text-white/5 w-20 h-20" />
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full mt-4 h-12 rounded-xl text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 gap-2 transition-all">
            <LogOut size={16} /> Disconnect Sesi
          </Button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Console (Adaptive Desktop Header) */}
        <header className="hidden md:flex h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 items-center px-12 justify-between sticky top-0 z-40 shrink-0">
          <div className="flex flex-col text-left">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] leading-none mb-1">Mode Operasional</p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic italic">
                {user?.role} <span className="text-indigo-600 font-black">Console</span>
              </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={18} />
              <Input
                placeholder="Cari Database..."
                className="pl-12 w-80 h-12 rounded-2xl bg-slate-100 border-none focus-visible:ring-2 focus-visible:ring-indigo-600 font-bold text-xs shadow-inner text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="h-12 rounded-2xl border-none bg-slate-100 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none cursor-pointer shadow-inner hover:bg-slate-200 transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Semua">Semua Data</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </header>

        {/* ================= MAIN SCROLLABLE AREA ================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-white/30 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Mobile-Only Search & Filter Tool [cite: 2025-09-29] */}
            <div className="md:hidden flex flex-col gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Console Filter</p>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    placeholder="Cari SKU / Item..."
                    className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="h-12 rounded-xl border border-slate-100 bg-slate-50 px-4 text-[10px] font-black uppercase text-slate-900 outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="Semua">KATEGORI</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
            </div>
            
            {/* DIRECTIVES ALERT SECTION [cite: 2025-11-02] */}
            {hasNotes && (
              <section className="animate-in fade-in slide-in-from-top-6 duration-1000">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-amber-400 rounded-2xl text-slate-900 shadow-xl shadow-amber-200/50 animate-bounce">
                      <Bell size={20} fill="currentColor" />
                   </div>
                   <div className="text-left flex-1">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Directives <span className="text-amber-500">Alert</span></h3>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-80">Perhatian mendesak unit {user?.role}.</p>
                   </div>
                   <div className="hidden sm:block h-[2px] flex-1 bg-slate-200 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {user.personalNotes.map((note) => (
                      <StickyNoteCard key={note.id} note={note} />
                   ))}
                </div>
              </section>
            )}

            {/* Content Display (Inventory / Orders) */}
            <div className="animate-in fade-in zoom-in-95 duration-700">
               <Outlet context={{ searchQuery, selectedCategory }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-komponen SidebarLink
function SidebarLink({ to, active, icon, label, variant = "default" }) {
    return (
        <Link
            to={to}
            className={cn(
              "flex items-center gap-4 p-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
              active 
                ? (variant === "danger" ? "bg-rose-600 text-white shadow-2xl shadow-rose-200" : "bg-slate-900 text-white shadow-2xl shadow-slate-400") 
                : "text-slate-900 hover:bg-slate-100 hover:translate-x-1"
            )}
        >
            <span className={cn(active ? "text-white" : "text-slate-900")}>{icon}</span>
            {label}
        </Link>
    );
}