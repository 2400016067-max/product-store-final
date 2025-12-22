import { Outlet, Link } from "react-router-dom";
// 1. IMPORT MODAL KERANJANG [cite: 2025-12-22]
import CartModal from "./CartModal"; 

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Area Navigasi Utama [cite: 2025-12-13] */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="font-extrabold text-xl tracking-tighter text-blue-600">
            ProductStore
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Katalog
            </Link>
            
            {/* 2. INTEGRASI KERANJANG DI NAVBAR [cite: 2025-12-22] */}
            <div className="border-l pl-6">
               <CartModal />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content - Tempat Katalog & Detail Produk Muncul [cite: 2025-09-29] */}
      <main className="flex-1 container mx-auto p-6">
        <Outlet /> 
      </main>

      {/* Footer - Area Informasi & Pintu Rahasia [cite: 2025-12-13] */}
      <footer className="p-8 border-t bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2025 Product Store Team - IS Project
          </p>

          <div className="flex items-center space-x-4">
            {/* PINTU RAHASIA: Link Login yang disamarkan [cite: 2025-11-02] */}
            <Link 
              to="/login" 
              className="text-[10px] uppercase tracking-widest text-slate-300 hover:text-slate-500 font-bold transition-all"
            >
              Staff Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}