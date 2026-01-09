import { useState } from "react";
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
  ArrowRightLeft, // Icon untuk pindah jalur
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem operasional?")) {
      logout();
      navigate("/login");
    }
  };

  // --- TEMA VISUAL BERDASARKAN ROLE ---
  const getRoleTheme = () => {
    switch(user?.role) {
      case "admin": return { color: "bg-red-500", badge: "bg-red-100 text-red-700", icon: <Shield size={10} className="mr-1" /> };
      case "manager": return { color: "bg-indigo-600", badge: "bg-indigo-100 text-indigo-700", icon: <Briefcase size={10} className="mr-1" /> };
      default: return { color: "bg-blue-500", badge: "bg-blue-100 text-blue-700", icon: <UserCheck size={10} className="mr-1" /> };
    }
  };

  const theme = getRoleTheme();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* ================= HEADER MOBILE ================= */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${theme.color} animate-pulse`}></div>
            <h2 className="font-black text-xl tracking-tighter text-slate-800 uppercase">Ops<span className="text-blue-600">Store</span></h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-md">
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* ================= SIDEBAR OPERASIONAL ================= */}
      <aside className={`
        w-full md:w-72 
        border-r bg-white p-6 
        flex flex-col shadow-sm 
        fixed md:sticky top-16 md:top-0 z-40 h-[calc(100vh-64px)] md:h-screen overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-10 px-2 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-3 w-3 rounded-full ${theme.color} animate-pulse`}></div>
            <h2 className="font-black text-2xl tracking-tighter text-slate-800 uppercase italic">Operasional</h2>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Inventory & Orders System</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          
          {/* --- SECTION 1: INVENTARIS & PESANAN (Tersedia untuk Semua Staff/Admin/Manager) --- */}
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2 mt-4">Logistik</div>
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              isActive("/admin") ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} /> Inventory List
          </Link>
          <Link
            to="/admin/orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              isActive("/admin/orders") ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-blue-50"
            }`}
          >
            <Package size={18} /> Daftar Pesanan
          </Link>

          {/* --- SECTION 2: OTORITAS (Hanya Admin Utama / Imam) [cite: 2026-01-08] --- */}
          {user?.role === "admin" && (
            <>
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-3 mb-2 mt-6">Sistem Root</div>
              <Link
                to="/admin/users"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin/users") ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:bg-red-50"
                }`}
              >
                <UserCog size={18} /> Kelola Otoritas
              </Link>
            </>
          )}

          {/* --- SECTION 3: JEMBATAN KE MANAGER (HANYA MUNCUL UNTUK MANAGER / Dadan) --- */}
          {/* REVISI KRITIS: Admin tidak lagi melihat bagian ini agar jalur ke manager tertutup */}
          {user?.role === "manager" && (
            <div className="mt-8 pt-6 border-t border-slate-100">
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-3 mb-2">Lintas Jalur</p>
               <Link
                to="/manager"
                className="flex items-center justify-between p-3 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft size={14} /> Ke Manager Suite
                </div>
              </Link>
            </div>
          )}

          <div className="py-4">
            <div className="h-px bg-slate-100 w-full"></div>
          </div>

          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-500 transition-all group"
          >
            <Store size={18} className="group-hover:text-blue-600" />
            Tampilan Toko
          </Link>
        </nav>

        {/* PROFILE CARD */}
        <div className="pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-md ${theme.color}`}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">
                  {user?.username}
                </p>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${theme.badge}`}>
                  {theme.icon}
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <header className="h-auto md:h-24 border-b bg-white/80 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center px-4 md:px-8 py-4 md:py-0 justify-between gap-4 sticky md:sticky top-0 z-30">
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-tight">Panel Operasional</h1>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-tight uppercase">
              {user?.role} Access
            </p>
          </div>

          {/* SEARCH & FILTER AREA */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Cari item..."
                className="pl-10 w-full md:w-64 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 outline-none cursor-pointer w-full md:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Semua">Kategori</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>

            <button
              onClick={handleLogout}
              className="flex justify-center items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 border border-red-100 shadow-sm text-xs w-full md:w-auto transition-all active:scale-95"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery, selectedCategory }} />
          </div>
        </main>
      </div>
    </div>
  );
}