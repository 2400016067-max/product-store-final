import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute Upgrade
 * @param {Array} allowRoles - Daftar role yang diizinkan (contoh: ['admin', 'staff'])
 */
const ProtectedRoute = ({ children, allowRoles }) => {
  const { user, loading } = useAuth();

  // 1. TAHAP PENANTIAN: Tunggu sampai AuthContext selesai cek sessionStorage
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-600 font-medium text-sm">Memverifikasi Otoritas...</p>
      </div>
    );
  }

  // 2. TAHAP AUTENTIKASI: Jika tidak ada user yang login, tendang ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. TAHAP OTORISASI (RBAC): 
  // Jika rute ini membatasi role tertentu, dan role user tidak ada di daftar tersebut
  if (allowRoles && !allowRoles.includes(user.role)) {
    // Tendang balik ke halaman publik (Home) karena tidak punya hak akses
    return <Navigate to="/" replace />;
  }

  // 4. TAHAP IZIN: User sudah login DAN role sesuai
  return children;
};

export default ProtectedRoute;