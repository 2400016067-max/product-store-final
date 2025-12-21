import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, AlertTriangle } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // STATE BARU: Untuk Proteksi Brute Force
  const [failedAttempts, setFailedAttempts] = useState(0); // Hitung gagal
  const [isLocked, setIsLocked] = useState(false);         // Status terkunci
  const [timeLeft, setTimeLeft] = useState(0);             // Hitung mundur

  const { login, loading } = useAuth(); 
  const navigate = useNavigate();

  // EFEK TIMER: Menghitung mundur saat terkunci
  useEffect(() => {
    let timer;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsLocked(false); // Buka kunci jika waktu habis
      setFailedAttempts(0); // Reset counter
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. CEK KUNCI: Jika terkunci, tolak akses langsung
    if (isLocked) return;

    // Panggil logika login
    const result = await login(username, password);
    
    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      // 2. LOGIKA BRUTE FORCE: Jika Gagal...
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        // Hukuman: Kunci selama 30 detik
        setIsLocked(true);
        setTimeLeft(30); 
        setErrorMsg("Terlalu banyak percobaan gagal. Silakan tunggu 30 detik.");
      } else {
        // Peringatan biasa
        setErrorMsg(`Username/Password salah! (Sisa percobaan: ${3 - newAttempts})`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${isLocked ? 'bg-red-100 text-red-600' : 'bg-slate-900 text-white'}`}>
            {isLocked ? <AlertTriangle size={24} /> : <Lock size={20} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-2">
            {isLocked ? "AKSES DIBEKUKAN SEMENTARA" : "Masuk untuk mengelola inventaris toko"}
          </p>
        </div>

        {errorMsg && (
          <div className={`mb-6 p-3 border text-sm font-medium rounded-md animate-in fade-in slide-in-from-top-2 flex items-center gap-2 ${isLocked ? 'bg-red-100 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            {isLocked ? <AlertTriangle size={16}/> : <span>⚠️</span>}
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Username</label>
            <Input
              type="text"
              required
              disabled={isLocked || loading} // Disable input saat terkunci
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="bg-slate-50 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <Input
              type="password"
              required
              disabled={isLocked || loading} // Disable input saat terkunci
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-50 disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            // Disable tombol jika Loading ATAU Terkunci
            disabled={loading || isLocked}
            className={`w-full font-bold py-2 h-11 transition-all ${isLocked ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Memeriksa...</span>
            ) : isLocked ? (
              `Tunggu ${timeLeft} Detik...` // Tampilkan hitung mundur di tombol
            ) : (
              "MASUK SEKARANG"
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => navigate("/")}
            className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 w-full"
          >
            ← Kembali ke Katalog Publik
          </button>
        </div>
      </div>
    </div>
  );
}