import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import { 
  User, Mail, Lock, ShieldCheck, 
  ArrowRight, Loader2, CheckCircle2, 
  AlertCircle, ArrowLeft, UserPlus, Eye, EyeOff, Zap
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
  const [showPassword, setShowPassword] = useState(false);

  const { registerManual } = useAuth();
  const navigate = useNavigate();

  // --- POLESAN 1: PASSWORD STRENGTH LOGIC (BACKEND READY) --- [cite: 2026-01-10]
  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: "", color: "bg-slate-100" };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const results = [
      { label: "Lemah", color: "bg-rose-500", width: "25%" },
      { label: "Cukup", color: "bg-amber-500", width: "50%" },
      { label: "Kuat", color: "bg-indigo-500", width: "75%" },
      { label: "Sangat Aman", color: "bg-emerald-500", width: "100%" }
    ];
    
    return score > 0 ? results[score - 1] : { label: "Terlalu Pendek", color: "bg-slate-200", width: "10%" };
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setErrorMsg("Konfirmasi password tidak cocok!");
    if (formData.password.length < 6) return setErrorMsg("Keamanan rendah: Minimal 6 karakter.");

    setIsLoading(true);
    try {
      const result = await registerManual(formData.name, formData.email, formData.password);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(result.message || "Gagal membuat identitas.");
      }
    } catch (err) {
      setErrorMsg("Koneksi bermasalah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 font-sans selection:bg-indigo-100">
      <div className="max-w-md w-full bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden transition-all duration-500">
        
        {/* Luxury Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

        {/* Header Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] mb-8 transition-all duration-700 shadow-2xl rotate-3",
            isSuccess ? "bg-emerald-500 text-white scale-110 rotate-[360deg]" : "bg-slate-950 text-white"
          )}>
            {isSuccess ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <UserPlus size={40} strokeWidth={2.5} />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            {isSuccess ? "Terdaftar" : "Buat Akun"}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <Zap size={12} className="text-amber-400 fill-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
               Pendaftaran Identitas Digital
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-5 border-2 border-rose-100 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center gap-4 animate-in zoom-in-95">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* NAMA LENGKAP */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nama Personel</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                name="name"
                required
                placeholder="Imam Faqih"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading || isSuccess}
                className="h-16 pl-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600 font-bold shadow-inner"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">ID Digital (Email)</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                name="email"
                type="email"
                required
                placeholder="operator@store.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || isSuccess}
                className="h-16 pl-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600 font-bold shadow-inner"
              />
            </div>
          </div>

          {/* PASSWORD GRID */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Kunci Akses</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  className="h-16 px-6 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600 font-bold shadow-inner pr-14"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* POLESAN 2: STRENGTH METER UI [cite: 2026-01-10] */}
              {formData.password && (
                <div className="px-2 mt-3 space-y-2 animate-in slide-in-from-top-1 duration-300">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                    <span className="text-slate-400">Keamanan:</span>
                    <span className={cn("italic", passwordStrength.color.replace('bg-', 'text-'))}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-500", passwordStrength.color)} style={{ width: passwordStrength.width }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Konfirmasi Kunci</label>
              <Input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading || isSuccess}
                className="h-16 px-6 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600 font-bold shadow-inner"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className={cn(
              "w-full h-20 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 mt-4",
              isSuccess ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-100" : "bg-slate-900 hover:bg-indigo-600 shadow-indigo-100"
            )}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : isSuccess ? (
              "SINKRONISASI BERHASIL"
            ) : (
              <>DAFTARKAN PERSONEL <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Sudah terverifikasi?</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-[11px] font-black text-indigo-600 hover:text-indigo-400 transition-all uppercase group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform" /> 
            Kembali ke Gerbang Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}