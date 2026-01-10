import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  LayoutDashboard, 
  FilePieChart, 
  LogOut, 
  ArrowLeftRight, 
  UserCircle,
  Menu,
  X,
  Instagram,
  MessageCircle,
  ShieldCheck,
  StickyNote,
  UserCheck, // Ikon untuk Manajemen Otoritas
  Briefcase,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function ManagerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Konfirmasi Keamanan: Apakah Anda yakin ingin mengakhiri sesi Suite Manager?")) {
      logout();
      navigate("/login");
    }
  };

  // Sidebar Content (Desktop & Mobile) [cite: 2025-12-24]
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8 text-white text-left">
      {/* Brand Identity */}
      <div className="mb-14 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-4 w-4 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
          <h2 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
            Tech<span className="text-indigo-400 font-black">Suite</span>
          </h2>
        </div>
        <p className="text-[10px] text-indigo-300 font-black tracking-[0.3em] uppercase">Executive Intelligence</p>
      </div>

      {/* Navigasi Utama */}
      <nav className="space-y-3 flex-1">
        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4 mb-4">Strategic Tools</div>
        
        <ManagerLink 
          to="/manager" 
          icon={<LayoutDashboard size={22} />} 
          label="Dashboard Utama" 
          active={isActive("/manager")} 
          onClick={() => setOpen(false)} 
        />

        <ManagerLink 
          to="/manager/reports" 
          icon={<FilePieChart size={22} />} 
          label="Laporan Analitik" 
          active={isActive("/manager/reports")} 
          onClick={() => setOpen(false)} 
        />

        <ManagerLink 
          to="/manager/notes" 
          icon={<StickyNote size={22} />} 
          label="Penugasan Tim" 
          active={isActive("/manager/notes")} 
          onClick={() => setOpen(false)} 
        />

        {/* MENU BARU: MANAJEMEN OTORITAS */}
        <ManagerLink 
          to="/manager/authority" 
          icon={<UserCheck size={22} />} 
          label="Manajemen Otoritas" 
          active={isActive("/manager/authority")} 
          onClick={() => setOpen(false)} 
        />

        {/* Cross-Functional Link */}
        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4 mb-4">Operations Center</div>
          <Link 
            to="/admin" 
            className="flex items-center justify-between p-5 rounded-[1.5rem] text-sm font-black text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all group shadow-inner"
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight size={18} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
              Cek Inventaris
            </div>
            <Badge className="text-[8px] bg-indigo-600 text-white border-none uppercase font-black">Admin</Badge>
          </Link>
        </div>
      </nav>

      {/* Profile Footer */}
      <div className="mt-auto space-y-6">
        <div className="p-6 bg-indigo-900/40 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg border border-indigo-400/30 rotate-3">
              <UserCircle size={28} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Chief Executive</p>
              <p className="text-sm font-black truncate leading-tight uppercase italic">{user?.name || "Manager"}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="w-full rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase h-12 shadow-xl shadow-red-950/20 active:scale-95 transition-all gap-2" 
            onClick={handleLogout}
          >
            <LogOut size={16} /> Akhiri Sesi
          </Button>
          <Zap className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden text-left">
      
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-80 bg-indigo-950 sticky top-0 h-screen shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <SidebarContent />
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-24 px-12 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-6">
            {/* Hamburger Mobile */}
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
                            <Menu size={22} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-indigo-950 w-80 border-none shadow-2xl">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Manager Navigation Menu</SheetTitle>
                            <SheetDescription>Panel kontrol utama untuk navigasi Suite Manager.</SheetDescription>
                        </SheetHeader>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col text-left">
                <h1 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] leading-none mb-2">Control Console</h1>
                <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">
                  {isActive("/manager/reports") ? "Strategic Reporting" : 
                   isActive("/manager/notes") ? "Team Delegation" : 
                   isActive("/manager/authority") ? "Authority Control" : 
                   "Enterprise Dashboard"}
                </p>
            </div>
          </div>

          <Badge className="hidden sm:flex bg-indigo-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 border-none">
            <ShieldCheck size={14} className="mr-2" /> Tactical Mode Active
          </Badge>
        </header>

        {/* 3. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white/40 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-komponen Navigasi untuk Kebersihan Kode [cite: 2025-09-29]
function ManagerLink({ to, icon, label, active, onClick }) {
    return (
        <Link 
          to={to} 
          onClick={onClick}
          className={cn(
            "flex items-center gap-4 p-5 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all duration-500 group",
            active 
              ? "bg-indigo-600 shadow-2xl shadow-indigo-900/50 translate-x-2 text-white" 
              : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
          )}
        >
          <span className={cn(active ? "text-white" : "text-indigo-400 group-hover:text-white")}>
            {icon}
          </span>
          {label}
        </Link>
    );
}