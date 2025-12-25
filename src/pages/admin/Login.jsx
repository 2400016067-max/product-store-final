import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // TAMBAHKAN useLocation
import { useAuth } from "../../contexts/AuthContext"; 
import { Loader2, Lock, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); 
  
  const [localLoading, setLocalLoading] = useState(false); 
  const [failedAttempts, setFailedAttempts] = useState(0); 
  const [isLocked, setIsLocked] = useState(false);          
  const [timeLeft, setTimeLeft] = useState(0);              

  const { login, isAuthenticated, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); // Ambil data lokasi asal [cite: 2025-12-13]

  // --- 1. WATCHDOG REDIRECT (Sadar Konteks & Role) [cite: 2025-09-29] ---
  useEffect(() => {
    if (isAuthenticated && user) {
      // Ambil lokasi asal dari state, atau gunakan default berdasarkan role
      const from = location.state?.from?.pathname;

      if (from) {
        // Jika user datang karena dipaksa login (misal dari detail produk/keranjang)
        navigate(from, { replace: true });
      } else {
        // Jika login normal tanpa paksaan redirect
        if (user.role === "viewer") {
          navigate("/", { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // --- 2. LOGIKA TIMER BRUTE FORCE ---
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
        setErrorMsg("Akses dibekukan 30 detik karena terlalu banyak percobaan.");
      } else {
        setErrorMsg(apiMessage || `Username/Password salah! (Sisa: ${3 - nextValue})`);
      }
      return nextValue;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || localLoading || isSuccess) return;
    
    setErrorMsg("");
    setLocalLoading(true);

    try {
      const result = await login(username, password);
      
      if (result && result.success) {
        setFailedAttempts(0);
        setIsSuccess(true); // Memicu useEffect Watchdog di atas [cite: 2025-12-13]
      } else {
        setLocalLoading(false); 
        handleFailedAttempt(result?.message);
      }
    } catch (err) {
      setLocalLoading(false);
      setErrorMsg("Koneksi gagal. Pastikan server MockAPI aktif.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
        
        {/* Dekorasi Aksen Role */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* ICON & HEADER */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-500 shadow-lg ${
            isSuccess ? 'bg-green-500 text-white rotate-[360deg]' : 
            isLocked ? 'bg-red-100 text-red-600 animate-bounce' : 'bg-slate-900 text-white'
          }`}>
            {isSuccess ? <CheckCircle2 size={32} /> : isLocked ? <AlertTriangle size={32} /> : <Lock size={32} />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {isSuccess ? "Berhasil Masuk!" : "Otentikasi User"}
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium italic">
            {isSuccess ? "Menyiapkan data anda..." : "Akses khusus untuk pelanggan & staff."}
          </p>
        </div>

        {/* NOTIFIKASI ERROR */}
        {errorMsg && (
          <div className={`mb-8 p-4 border text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            isLocked ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            <AlertTriangle size={18} className="shrink-0" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Username</label>
            <Input
              type="text"
              required
              disabled={isLocked || localLoading || isSuccess} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username anda..."
              className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base px-5 shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Password</label>
            <Input
              type="password"
              required
              disabled={isLocked || localLoading || isSuccess} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base px-5 shadow-inner"
            />
          </div>

          <Button
            type="submit"
            disabled={localLoading || isLocked || isSuccess}
            className={`w-full font-black py-7 rounded-2xl text-sm tracking-widest transition-all active:scale-95 shadow-xl ${
              isSuccess ? 'bg-green-500 hover:bg-green-600 shadow-green-100' :
              isLocked ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 
              'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
            }`}
          >
            {localLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> MENYINKRONKAN...
              </span>
            ) : isLocked ? (
              `BEKU: ${timeLeft} DETIK` 
            ) : isSuccess ? (
              "MENGALIHKAN..."
            ) : (
              "VERIFIKASI & MASUK"
            )}
          </Button>
        </form>
        
        <div className="mt-10 text-center">
          <button 
            type="button"
            onClick={() => navigate("/")}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 w-full group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Lanjutkan sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
}