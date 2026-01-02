import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import { Loader2, Lock, AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"; 
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
  
  // STATE BARU: Untuk Show/Hide Password
  const [showPassword, setShowPassword] = useState(false);

  // Ambil login manual DAN loginWithGoogle dari Context [cite: 2025-09-29]
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- 1. WATCHDOG REDIRECT (Berlaku untuk Manual & Google) [cite: 2025-12-13] ---
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
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

  // --- 3. HANDLE LOGIN GOOGLE [cite: 2025-09-29] ---
  const handleGoogleLogin = async () => {
    if (isLocked || localLoading || isSuccess) return;
    setErrorMsg("");
    setLocalLoading(true);

    const result = await loginWithGoogle();
    if (result.success) {
      setIsSuccess(true);
    } else {
      setLocalLoading(false);
      setErrorMsg(result.message);
    }
  };

  // --- 4. HANDLE LOGIN MANUAL ---
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
        setIsSuccess(true);
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
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

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
          <p className="text-slate-400 text-sm mt-2 font-medium italic leading-tight">
            {isSuccess ? "Menyiapkan data anda..." : "Akses khusus untuk pelanggan & staff."}
          </p>
        </div>

        {errorMsg && (
          <div className={`mb-8 p-4 border text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            isLocked ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            <AlertTriangle size={18} className="shrink-0" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* TOMBOL LOGIN GOOGLE [cite: 2025-09-29, 2025-12-13] */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={localLoading || isLocked || isSuccess}
          variant="outline"
          className="w-full h-14 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 font-black text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk dengan Google
        </Button>

        {/* PEMBATAS VISUAL [cite: 2025-09-29] */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-white px-4 text-slate-300">Atau Manual</span>
          </div>
        </div>

        {/* FORM LOGIN MANUAL */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Username</label>
            <Input
              type="text"
              required
              disabled={isLocked || localLoading || isSuccess} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username anda..."
              className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base px-5 shadow-inner"
            />
          </div>

          {/* --- BAGIAN PASSWORD (DENGAN TOGGLE EYE ICON) --- */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"} 
                required
                disabled={isLocked || localLoading || isSuccess} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                // Tambahkan pr-12 supaya teks tidak nabrak ikon mata
                className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base px-5 pr-12 shadow-inner"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || localLoading || isSuccess}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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