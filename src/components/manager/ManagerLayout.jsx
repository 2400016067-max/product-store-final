import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  LayoutDashboard, 
  FilePieChart, 
  LogOut, 
  ArrowLeftRight, 
  UserCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ManagerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari Suite Manager?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* SIDEBAR EXCLUSIVE: Fokus pada Strategis & Dashboard */}
      <aside className="w-80 bg-indigo-950 text-white p-8 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-20">
        <div className="mb-14 px-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-indigo-400 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Tech<span className="text-indigo-400">Suite</span>
            </h2>
          </div>
          <p className="text-[10px] text-indigo-300/50 font-black tracking-[0.3em] uppercase">Decision Support System</p>
        </div>

        <nav className="space-y-3 flex-1">
          <div className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest ml-4 mb-4">Executive Tools</div>
          
          <Link 
            to="/manager" 
            className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
              isActive("/manager") 
                ? "bg-indigo-600 shadow-xl shadow-indigo-900/40 translate-x-2" 
                : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
            }`}
          >
            <LayoutDashboard size={22} className={isActive("/manager") ? "text-white" : "text-indigo-400 group-hover:text-white"} />
            Dashboard Utama
          </Link>

          <Link 
            to="/manager/reports" 
            className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
              isActive("/manager/reports") 
                ? "bg-indigo-600 shadow-xl shadow-indigo-900/40 translate-x-2" 
                : "text-indigo-200 hover:bg-white/5 hover:translate-x-1"
            }`}
          >
            <FilePieChart size={22} className={isActive("/manager/reports") ? "text-white" : "text-indigo-400 group-hover:text-white"} />
            Laporan Analitik
          </Link>

          {/* FITUR LINTAS JALUR: Lompat ke Admin Panel */}
          <div className="pt-8 mt-8 border-t border-white/10">
            <div className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest ml-4 mb-4">Cross-Functional</div>
            <Link 
              to="/admin" 
              className="flex items-center justify-between p-4 rounded-2xl text-sm font-bold text-indigo-100 bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight size={18} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                Cek Operasional
              </div>
              <Badge variant="outline" className="text-[9px] border-indigo-500 text-indigo-400 uppercase font-black">Admin</Badge>
            </Link>
          </div>
        </nav>

        {/* PROFILE EXECUTIVE */}
        <div className="mt-auto p-5 bg-indigo-900/30 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg border-2 border-indigo-400/50">
              <UserCircle size={28} />
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Executive</p>
              <p className="text-sm font-bold truncate leading-tight">{user?.name || "Manager Name"}</p>
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
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Floating Header */}
        <header className="h-24 px-12 flex items-center justify-between bg-white border-b border-slate-100 z-10">
          <div className="flex flex-col">
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-2">Manager Control Suite</h1>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase">
              {isActive("/manager/reports") ? "Strategic Reporting" : "Enterprise Dashboard"}
            </p>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-4 py-1.5 rounded-full font-black text-[10px] uppercase">
            Active Mode: Strategic Analysis
          </Badge>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-12 bg-white/50">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}