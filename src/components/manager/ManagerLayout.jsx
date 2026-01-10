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
  ShieldCheck,
  StickyNote,
  UserCheck,
  Zap,
  Tag,
  ChevronRight
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 text-white text-left overflow-y-auto custom-scrollbar">
      {/* Brand Identity dengan Glow Effect */}
      <div className="mb-12 px-4 py-6 rounded-[2rem] bg-white/5 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-3 w-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
          <h2 className="text-xl font-black tracking-tighter uppercase leading-none italic">
            Tech<span className="text-indigo-400">Suite</span>
          </h2>
        </div>
        <p className="text-[8px] text-indigo-300 font-black tracking-[0.4em] uppercase opacity-70">Executive Command Center</p>
      </div>

      {/* Navigasi Utama: Strategic Tools */}
      <nav className="space-y-2 flex-1">
        <div className="flex items-center justify-between px-5 mb-4">
          <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em]">Strategic Tools</span>
          <Zap size={10} className="text-indigo-500 animate-bounce" />
        </div>
        
        <ManagerLink 
          to="/manager" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={isActive("/manager")} 
          onClick={() => setOpen(false)} 
        />

        <ManagerLink 
          to="/manager/reports" 
          icon={<FilePieChart size={20} />} 
          label="Analitik Data" 
          active={isActive("/manager/reports")} 
          onClick={() => setOpen(false)} 
        />

        <ManagerLink 
          to="/manager/promo" 
          icon={<Tag size={20} />} 
          label="Strategi Promo" 
          active={isActive("/manager/promo")} 
          onClick={() => setOpen(false)} 
          isNew={true} 
        />

        <div className="h-px bg-white/5 my-6 mx-4" />

        <div className="px-5 mb-4 text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em]">Personnel Control</div>

        <ManagerLink 
          to="/manager/notes" 
          icon={<StickyNote size={20} />} 
          label="Delegasi Tim" 
          active={isActive("/manager/notes")} 
          onClick={() => setOpen(false)} 
        />

        <ManagerLink 
          to="/manager/authority" 
          icon={<UserCheck size={20} />} 
          label="Otoritas Akses" 
          active={isActive("/manager/authority")} 
          onClick={() => setOpen(false)} 
        />
      </nav>

      {/* Profile Command */}
      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
        <Link 
          to="/admin" 
          className="flex items-center justify-between p-4 rounded-2xl text-[11px] font-black text-white bg-indigo-500/10 border border-white/5 hover:bg-indigo-500/20 transition-all group"
        >
          <div className="flex items-center gap-3">
            <ArrowLeftRight size={16} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
            Control Registry
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </Link>

        <div className="p-5 bg-slate-900/80 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UserCircle size={22} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Chief Manager</p>
              <p className="text-xs font-black truncate uppercase italic">{user?.name || "Executive"}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="w-full rounded-xl font-black text-[9px] tracking-[0.2em] uppercase h-10 shadow-xl bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all gap-2 border-none" 
            onClick={handleLogout}
          >
            <LogOut size={14} /> Terminasi Sesi
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden text-left">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-indigo-950 sticky top-0 h-screen shadow-[15px_0_40px_rgba(0,0,0,0.2)] shrink-0">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            {/* Sidebar Mobile */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100 text-slate-900">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-indigo-950 w-72 border-none shadow-2xl">
                  {/* FIX: Menambahkan Header, Title, dan Description tersembunyi untuk aksesibilitas */}
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Akses navigasi kontrol panel manager untuk TechSuite.</SheetDescription>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col text-left">
              <h1 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1.5">Intelligence Console</h1>
              <p className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">
                {isActive("/manager/reports") ? "Strategic Analytics" : 
                 isActive("/manager/notes") ? "Personnel Delegation" : 
                 isActive("/manager/authority") ? "Access Control" : 
                 isActive("/manager/promo") ? "Strategic Promotion" : 
                 "System Overview"}
              </p>
            </div>
          </div>
          <Badge className="hidden sm:flex bg-indigo-600 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-100 border-none">
            <ShieldCheck size={12} className="mr-2" /> Security Active
          </Badge>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}

function ManagerLink({ to, icon, label, active, onClick, isNew }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group relative",
        active 
          ? "bg-indigo-600 shadow-[0_10px_20px_rgba(79,70,229,0.3)] text-white translate-x-2" 
          : "text-indigo-200/70 hover:bg-white/5 hover:text-white hover:translate-x-1"
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn(
          "transition-colors duration-300",
          active ? "text-white" : "text-indigo-400 group-hover:text-white"
        )}>
          {icon}
        </span>
        {label}
      </div>
      
      {isNew && !active && (
        <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
      )}
      
      {active && <ChevronRight size={14} className="text-white animate-in slide-in-from-left-2" />}
    </Link>
  );
}