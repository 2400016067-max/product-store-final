import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import { 
  LogOut, 
  LayoutDashboard, 
  Store, 
  UserCheck, 
  Shield, 
  UserCog 
} from "lucide-react"; 

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi halaman aktif
  const { logout, user } = useAuth(); 

  const handleLogout = () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin keluar dari Panel Admin?");
    if (isConfirm) {
      logout(); 
      navigate("/login"); 
    }
  };

  // Logika warna dinamis berdasarkan ROLE
  const roleColor = user?.role === "admin" 
    ? "bg-red-500 border-red-600 shadow-red-100" 
    : "bg-blue-500 border-blue-600 shadow-blue-100";

  const badgeStyle = user?.role === "admin"
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-blue-100 text-blue-700 border-blue-200";

  // Helper untuk mengecek apakah link sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white p-6 hidden md:flex flex-col shadow-sm">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-3 w-3 rounded-full ${user?.role === "admin" ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`}></div>
            <h2 className="font-black text-2xl tracking-tighter text-slate-800">TECH<span className="text-blue-600">STORE</span></h2>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Management System v1.1</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {/* Menu Dashboard: Diakses Admin & Staff */}
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              isActive("/admin") 
              ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
              : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} />
            Inventory Dashboard
          </Link>

          {/* UPGRADE: Menu Kelola User (HANYA UNTUK ADMIN/IMAM) */}
          {user?.role === "admin" && (
            <Link 
              to="/admin/users" 
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b bg-white/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dashboard Admin</h1>
            <p className="text-lg font-black text-slate-800 tracking-tight">Halo, {user?.username}!</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs font-bold text-slate-400">STATUS LOGIN</p>
              <p className={`text-xs font-black uppercase ${user?.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                {user?.role} Access
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-all border border-red-100 active:scale-95 shadow-sm text-sm"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}