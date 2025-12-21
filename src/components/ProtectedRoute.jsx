import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. TAHAP PENANTIAN: Jika masih loading (cek session), jangan lakukan apa-apa dulu
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-600 font-medium">Memverifikasi Sesi...</p>
      </div>
    );
  }

  // 2. TAHAP PENYARINGAN: Jika loading selesai dan user TIDAK ada, tendang ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. TAHAP IZIN: Jika user ada, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;