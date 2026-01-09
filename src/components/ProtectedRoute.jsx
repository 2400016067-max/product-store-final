import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute Upgrade - Mendukung Multi-Role (Admin, Staff, Manager)
 * @param {Array} allowRoles - Daftar role yang diizinkan (contoh: ['admin', 'manager'])
 */
const ProtectedRoute = ({ children, allowRoles }) => {
  const { user, loading } = useAuth();

  // 1. TAHAP PENANTIAN: Mencegah "Flicker" saat aplikasi mengecek sesi [cite: 2025-12-26]
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 font-bold text-xs uppercase tracking-widest">
            Memverifikasi Otoritas...
          </p>
        </div>
      </div>
    );
  }

  // 2. TAHAP AUTENTIKASI: Jika user belum login, arahkan ke Login [cite: 2025-12-26]
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. TAHAP OTORISASI (RBAC): Cek hak akses berdasarkan role [cite: 2025-11-02, 2025-12-26]
  // Kita pastikan role dari user selalu dibandingkan dalam format lowercase [cite: 2025-09-29]
  const userRole = user.role?.toLowerCase();
  
  if (allowRoles && !allowRoles.map(r => r.toLowerCase()).includes(userRole)) {
    // Jika role tidak sesuai (misal: Staff mencoba buka menu Manager), tendang ke Home [cite: 2025-12-26]
    return <Navigate to="/" replace />;
  }

  // 4. TAHAP IZIN: Akses diberikan [cite: 2025-12-26]
  return children;
};

export default ProtectedRoute;