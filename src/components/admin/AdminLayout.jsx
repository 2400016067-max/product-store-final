import { Outlet, useNavigate } from "react-router-dom"; // Tambahkan useNavigate [cite: 2025-09-29]

export default function AdminLayout() {
  const navigate = useNavigate(); // Inisialisasi fungsi navigasi [cite: 2025-09-29]

  // Handler Logout dengan pendekatan UX Profesional [cite: 2025-12-13]
  const handleLogout = () => {
    // Memberikan konfirmasi agar tidak sengaja keluar [cite: 2025-09-29]
    const isConfirm = window.confirm("Apakah Anda yakin ingin keluar dari Panel Admin?");
    
    if (isConfirm) {
      // Mengarahkan user kembali ke halaman Katalog Produk [cite: 2025-09-29]
      navigate("/"); 
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Area Navigasi Admin [cite: 2025-09-29] */}
      <aside className="w-64 border-r bg-white p-6 hidden md:block">
        <h2 className="font-bold mb-6 text-xl tracking-tight">Admin Panel</h2>
        <nav className="space-y-2">
          <div className="p-2 bg-slate-100 rounded text-sm font-medium border border-slate-200">
            Dashboard
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Area Kontrol Atas [cite: 2025-09-29] */}
        <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
          <span className="font-medium text-slate-700">Overview</span>
          
          {/* Tombol Logout Aktif [cite: 2025-09-29] */}
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-md font-medium hover:bg-red-100 hover:text-red-700 transition-all border border-red-100 active:scale-95"
          >
            Logout
          </button>
        </header>

        {/* Content - Tempat ProdukTable Muncul [cite: 2025-09-29] */}
        <main className="p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}