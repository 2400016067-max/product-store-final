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
  StickyNote // [cite: 2025-11-02]
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription // PERBAIKAN: Import Deskripsi [cite: 2025-09-29]
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
      <div className="mb-14 px-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
          <h2 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
            Tech<span className="text-indigo-400 font-black">Suite</span>
          </h2>
        </div>
        <p className="text-[10px] text-indigo-300/50 font-black tracking-[0.3em] uppercase">Decision Support System</p>
      </div>

      <nav className="space-y-3 flex-1">
        <div className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest ml-4 mb-4">Executive Tools</div>
        
        <Link 
          to="/manager" 
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
            isActive("/manager") 
              ? "bg-indigo-600 shadow-xl shadow-indigo-950/40 translate-x-2 text-white" 
              : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
          )}
        >
          <LayoutDashboard size={22} className={isActive("/manager") ? "text-white" : "text-indigo-400 group-hover:text-white"} />
          Dashboard Utama
        </Link>

        <Link 
          to="/manager/reports" 
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
            isActive("/manager/reports") 
              ? "bg-indigo-600 shadow-xl shadow-indigo-950/40 translate-x-2 text-white" 
              : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
          )}
        >
          <FilePieChart size={22} className={isActive("/manager/reports") ? "text-white" : "text-indigo-400 group-hover:text-white"} />
          Laporan Analitik
        </Link>

        {/* FITUR PENUGASAN TIM [cite: 2025-09-29] */}
        <Link 
          to="/manager/notes" 
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
            isActive("/manager/notes") 
              ? "bg-indigo-600 shadow-xl shadow-indigo-950/40 translate-x-2 text-white" 
              : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
          )}
        >
          <StickyNote size={22} className={isActive("/manager/notes") ? "text-white" : "text-indigo-400 group-hover:text-white"} />
          Penugasan Tim
        </Link>

        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest ml-4 mb-4">Cross-Functional</div>
          <Link 
            to="/admin" 
            className="flex items-center justify-between p-4 rounded-2xl text-sm font-bold text-indigo-100 bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3 text-left">
              <ArrowLeftRight size={18} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
              Cek Operasional
            </div>
            <Badge variant="outline" className="text-[9px] border-indigo-500 text-indigo-400 uppercase font-black">Admin</Badge>
          </Link>
        </div>
      </nav>

      {/* Footer Profile Section */}
      <div className="mt-auto space-y-6">
        <div className="flex justify-center gap-4 py-4 border-t border-white/5">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-indigo-600 transition-colors"><Instagram size={16}/></a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-600 transition-colors"><MessageCircle size={16}/></a>
        </div>
        
        <div className="p-5 bg-indigo-900/30 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-5 text-left">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg border-2 border-indigo-400/50">
              <UserCircle size={28} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Executive</p>
              <p className="text-sm font-bold truncate leading-tight">{user?.name || "Manager"}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="w-full rounded-xl font-black text-[11px] tracking-widest uppercase h-12 shadow-lg shadow-red-950/20 active:scale-95 transition-all" 
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" /> Akhiri Sesi
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden text-left">
      
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-80 bg-indigo-950 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP HEADER: Adaptive for Mobile & Desktop */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 border border-slate-200">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-indigo-950 w-80 border-none">
                        {/* PERBAIKAN: Header dengan Deskripsi untuk Aksesibilitas [cite: 2025-09-29] */}
                        <SheetHeader className="sr-only">
                            <SheetTitle>Manager Navigation Console</SheetTitle>
                            <SheetDescription>
                                Panel navigasi pusat untuk mengakses alat analisis dan delegasi tugas Manager.
                            </SheetDescription>
                        </SheetHeader>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col">
                <h1 className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1 lg:mb-2">Control Suite</h1>
                <p className="text-sm lg:text-lg font-black text-slate-800 tracking-tight leading-none uppercase italic">
                {isActive("/manager/reports") ? "Strategic Reporting" : isActive("/manager/notes") ? "Team Assignment" : "Enterprise Dashboard"}
                </p>
            </div>
          </div>

          <Badge className="hidden sm:flex bg-indigo-50 text-indigo-700 border-indigo-100 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider">
            <ShieldCheck size={12} className="mr-2" /> Strategic Analysis Mode
          </Badge>
        </header>

        {/* 3. CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-white/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}