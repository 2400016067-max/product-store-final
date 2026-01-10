import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Path disesuaikan: naik 2 tingkat (ke pages, lalu ke src) untuk cari contexts
import { useAuth } from "../../contexts/AuthContext"; 
import { 
  User, Mail, Lock, ShieldCheck, 
  ArrowRight, Loader2, CheckCircle2, 
  AlertCircle, ArrowLeft, UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { registerManual } = useAuth();
  const navigate = useNavigate();

  // Handle Input perubahan state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(""); 
  };

  // --- LOGIKA UTAMA REGISTER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi Dasar (Sistem Informasi Integrity Check)
    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Konfirmasi password tidak sesuai!");
    }
    if (formData.password.length < 6) {
      return setErrorMsg("Keamanan lemah: Password minimal 6 karakter.");
    }

    setIsLoading(true);

    try {
      // Panggil fungsi register yang sudah kita buat di AuthContext
      const result = await registerManual(formData.name, formData.email, formData.password);
      
      if (result.success) {
        setIsSuccess(true);
        // Beri jeda 2 detik agar user bisa melihat animasi sukses
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErrorMsg(result.message || "Gagal membuat identitas baru.");
      }
    } catch (err) {
      setErrorMsg("Gangguan Jaringan: Gagal menghubungi Firebase/MockAPI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
        
        {/* Dekorasi Garis Atas (Premium Look) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 transition-all duration-700 shadow-xl",
            isSuccess ? "bg-emerald-500 text-white scale-110 rotate-[360deg]" : "bg-slate-950 text-white"
          )}>
            {isSuccess ? <CheckCircle2 size={36} /> : <UserPlus size={36} />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {isSuccess ? "Pendaftaran Berhasil!" : "Buat Akun"}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 italic">
            {isSuccess ? "Menyinkronkan data profil..." : "Daftarkan identitas logistik anda."}
          </p>
        </div>

        {/* NOTIFIKASI ERROR */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-wider leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* FORM REGISTRASI */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                name="name"
                type="text"
                required
                placeholder="Contoh: Imam Faqih"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading || isSuccess}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email (Username)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || isSuccess}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  className="h-14 pl-12 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Konfirmasi</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  className="h-14 pl-12 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className={cn(
              "w-full h-16 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-4",
              isSuccess ? "bg-emerald-500 shadow-emerald-100" : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
            )}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSuccess ? (
              "SINKRONISASI BERHASIL"
            ) : (
              <>DAFTAR SEKARANG <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        {/* FOOTER NAVIGASI */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Sudah punya akses?</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-[11px] font-black text-blue-600 hover:text-indigo-600 transition-all uppercase group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Balik ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}