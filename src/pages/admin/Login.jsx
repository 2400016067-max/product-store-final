import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import { Loader2, Lock, AlertTriangle, ArrowLeft } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // --- STATE KEAMANAN & LOADING LOKAL ---
  const [localLoading, setLocalLoading] = useState(false); 
  const [failedAttempts, setFailedAttempts] = useState(0); 
  const [isLocked, setIsLocked] = useState(false);         
  const [timeLeft, setTimeLeft] = useState(0);             

  const { login, isAuthenticated } = useAuth(); // Ambil isAuthenticated untuk "Watchdog"
  const navigate = useNavigate();

  // --- 1. WATCHDOG REDIRECT (Solusi Bug Refresh) ---
  // Jika status auth berubah jadi true, langsung pindahkan ke admin secara otomatis
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // --- 2. LOGIKA TIMER (COUNTDOWN) ---
  useEffect(() => {
    let timer;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isLocked && timeLeft === 0) {
      setIsLocked(false); 
      setFailedAttempts(0); 
      setErrorMsg(""); 
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  // --- 3. FUNGSI PENANGGULANGAN GAGAL LOGIN ---
  const handleFailedAttempt = (apiMessage) => {
    setFailedAttempts((prev) => {
      const nextValue = prev + 1;
      if (nextValue >= 3) {
        setIsLocked(true);
        setTimeLeft(30);
        setErrorMsg("Terlalu banyak percobaan gagal. Akses dibekukan 30 detik.");
      } else {
        setErrorMsg(apiMessage || `Username/Password salah! (Sisa percobaan: ${3 - nextValue})`);
      }
      return nextValue;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || localLoading) return;
    setErrorMsg("");
    setLocalLoading(true);

    try {
      const result = await login(username, password);
      
      if (result && result.success) {
        // Kita tidak panggil navigate() di sini.
        // Biarkan useEffect "Watchdog" di atas yang menangani perpindahan halaman
        // agar data user benar-benar sudah siap sebelum pindah.
        setFailedAttempts(0);
      } else {
        setLocalLoading(false); 
        handleFailedAttempt(result?.message);
      }
    } catch (err) {
      setLocalLoading(false);
      setErrorMsg("Terjadi kesalahan koneksi server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        
        {/* ICON & HEADER */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-all duration-300 ${isLocked ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-900 text-white'}`}>
            {isLocked ? <AlertTriangle size={28} /> : <Lock size={24} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-2">
            {isLocked ? "AKSES TERKUNCI" : "Silakan masuk untuk mengelola sistem"}
          </p>
        </div>

        {/* NOTIFIKASI ERROR */}
        {errorMsg && (
          <div className={`mb-6 p-3 border text-sm font-medium rounded-lg flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${isLocked ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <AlertTriangle size={18} className="shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
            <Input
              type="text"
              required
              disabled={isLocked || localLoading} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username admin"
              className="h-11 bg-slate-50 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <Input
              type="password"
              required
              disabled={isLocked || localLoading} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 bg-slate-50 disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={localLoading || isLocked}
            className={`w-full font-bold py-6 h-12 text-base transition-all active:scale-95 ${isLocked ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {localLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Memproses...
              </span>
            ) : isLocked ? (
              `Tunggu ${timeLeft} Detik...` 
            ) : (
              "MASUK KE DASHBOARD"
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 w-full group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}