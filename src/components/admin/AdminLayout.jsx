import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Wajib diimport untuk fungsi logout asli [cite: 2025-12-20]

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Ambil fungsi logout dan data user dari hook [cite: 2025-12-20]

  // Handler Logout dengan integrasi Keamanan & UX [cite: 2025-09-29]
  const handleLogout = () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin keluar dari Panel Admin?");
    
    if (isConfirm) {
      // 1. Jalankan fungsi logout (Hapus localStorage & Reset State) [cite: 2025-12-13]
      logout(); 
      // 2. Redirect dilakukan otomatis oleh fungsi logout di hook, 
      // tapi kita tambahkan navigasi manual sebagai cadangan [cite: 2025-12-20]
      navigate("/"); 
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Area Navigasi Admin [cite: 2025-09-29] */}
      <aside className="w-64 border-r bg-white p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="font-bold text-xl tracking-tight text-blue-600">Admin Panel</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">TechStore v1.0</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Link 
            to="/admin" 
            className="block p-2 bg-slate-100 rounded text-sm font-medium border border-slate-200 text-slate-700"
          >
            Dashboard / Inventory
          </Link>
          <Link 
            to="/" 
            className="block p-2 hover:bg-slate-50 rounded text-sm font-medium text-slate-500 transition-colors"
          >
            Lihat Toko (Public)
          </Link>
        </nav>

        {/* Info User yang Sedang Login [cite: 2025-12-13] */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">{user?.name || "Administrator"}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Area Kontrol Atas [cite: 2025-09-29] */}
        <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="font-medium text-slate-700 text-sm">Overview Manajemen Produk</span>
          </div>
          
          {/* Tombol Logout Aktif [cite: 2025-09-29] */}
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-md font-bold hover:bg-red-500 hover:text-white transition-all border border-red-100 active:scale-95 shadow-sm"
          >
            Logout
          </button>
        </header>

        {/* Content - Tempat ProdukTable Muncul [cite: 2025-09-29] */}
        <main className="p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}