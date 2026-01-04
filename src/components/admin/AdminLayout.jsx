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
  Package, // Icon untuk Manajemen Pesanan
  Menu, // Icon Menu Hamburger (Pastikan import ini ada)
  X // Icon Close Menu
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // --- 1. STATE UNTUK PENCARIAN & FILTER TABEL ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // --- STATE BARU: TOGGLE SIDEBAR MOBILE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin keluar dari Panel Admin?");
    if (isConfirm) {
      logout();
      navigate("/login");
    }
  };

  // Dinamis berdasarkan Role (Admin = Merah, Staff = Biru)
  const roleColor = user?.role === "admin"
    ? "bg-red-500 border-red-600 shadow-red-100"
    : "bg-blue-500 border-blue-600 shadow-blue-100";

  const badgeStyle = user?.role === "admin"
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-blue-100 text-blue-700 border-blue-200";

  const isActive = (path) => location.pathname === path;

  return (
    // UBAH 1: Flex-col di mobile, flex-row di desktop (md)
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* ================= HEADER MOBILE (HANYA MUNCUL DI HP) ================= */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${user?.role === "admin" ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`}></div>
            <h2 className="font-black text-xl tracking-tighter text-slate-800">TECH<span className="text-blue-600">STORE</span></h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-md">
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      {/* Logic: Hidden di mobile KECUALI tombol menu diklik. Di desktop selalu tampil (flex). */}
      <aside className={`
        w-full md:w-72 
        border-r bg-white p-6 
        flex flex-col shadow-sm 
        fixed md:sticky top-16 md:top-0 z-40 h-[calc(100vh-64px)] md:h-screen overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Desktop (Hidden di mobile karena sudah ada header mobile) */}
        <div className="mb-10 px-2 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-3 w-3 rounded-full ${user?.role === "admin" ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`}></div>
            <h2 className="font-black text-2xl tracking-tighter text-slate-800">PRODUCT<span className="text-blue-600">STORE</span></h2>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Management System v1.1</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {/* Menu Dashboard: Admin & Staff */}
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat diklik di HP
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              isActive("/admin")
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} />
            Inventory Dashboard
          </Link>

          {/* MENU BARU: Manajemen Pesanan (Admin & Staff) */}
          <Link
            to="/admin/orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              isActive("/admin/orders")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "text-slate-500 hover:bg-blue-50"
            }`}
          >
            <Package size={18} />
            Manajemen Pesanan
          </Link>

          {/* Menu Otoritas: HANYA ADMIN */}
          {user?.role === "admin" && (
            <Link
              to="/admin/users"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive("/admin/users")
                  ? "bg-red-600 text-white shadow-lg shadow-red-100"
                  : "text-slate-500 hover:bg-red-50"
              }`}
            >
              <UserCog size={18} className={isActive("/admin/users") ? "text-white" : "group-hover:text-red-600"} />
              Kelola Otoritas
            </Link>
          )}

          <div className="py-2">
            <div className="h-px bg-slate-100 w-full"></div>
          </div>

          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-500 transition-all group"
          >
            <Store size={18} className="group-hover:text-blue-600" />
            Ke Tampilan Toko
          </Link>
        </nav>

        {/* PROFILE CARD */}
        <div className="pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden">
            <div className={`absolute -right-2 -top-2 h-12 w-12 rounded-full opacity-10 ${user?.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-md ${roleColor}`}>
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">
                  {user?.name || "User"}
                </p>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${badgeStyle}`}>
                  {user?.role === "admin" ? <Shield size={10} className="mr-1" /> : <UserCheck size={10} className="mr-1" />}
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        {/* Header Desktop (Flex berubah di mobile jadi column) */}
        <header className="h-auto md:h-24 border-b bg-white/80 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center px-4 md:px-8 py-4 md:py-0 justify-between gap-4 sticky md:sticky top-0 z-30">
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-tight">Dashboard Admin</h1>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-tight">Halo, {user?.username}!</p>
          </div>

          {/* SEARCH & FILTER AREA (Stacking di Mobile) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Cari item..."
                className="pl-10 w-full md:w-64 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer w-full md:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>

            <button
              onClick={handleLogout}
              className="flex justify-center items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition-all border border-red-100 active:scale-95 shadow-sm text-xs w-full md:w-auto"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mengirimkan data filter ke component anak */}
            <Outlet context={{ searchQuery, selectedCategory }} />
          </div>
        </main>
      </div>
    </div>
  );
}