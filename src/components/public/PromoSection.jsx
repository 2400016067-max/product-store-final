import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { Ticket, CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

/**
 * PROMO SECTION COMPONENT
 * @param {Function} onApply - Fungsi callback untuk mengirim nilai diskon ke CardModal
 */
export default function PromoSection({ onApply }) {
  const { user, refreshUserData } = useAuth();
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleVerifyPromo = async () => {
    if (!user) return toast.error("Silahkan login untuk menggunakan kode promo.");
    if (!inputCode) return toast.error("Masukkan kode promo/referral Anda.");

    setIsLoading(true);
    
    try {
      // 1. Ketuk pintu API untuk ambil data promo terbaru (Injeksi Manager terbaru)
      const result = await refreshUserData();
      
      if (result.success) {
        const promo = result.data.personalPromo;

        // 2. LOGIC GATE: Validasi Kode
        if (!promo || promo.code === "") {
          throw new Error("Anda tidak memiliki promo aktif.");
        }

        if (inputCode.toUpperCase() !== promo.code.toUpperCase()) {
          throw new Error("Kode promo tidak valid.");
        }

        // 3. LOGIC GATE: Validasi Status Aktif
        if (!promo.isActive) {
          throw new Error("Kode promo ini sudah tidak aktif.");
        }

        // 4. LOGIC GATE: Validasi Tanggal Kadaluarsa
        const now = new Date();
        const expiryDate = new Date(promo.validUntil);
        if (now > expiryDate) {
          throw new Error("Yah! Kode promo ini sudah kadaluarsa.");
        }

        // JIKA SEMUA LOLOS:
        setIsApplied(true);
        onApply(promo.discount); // Kirim angka diskon ke CardModal (Kasir)
        
        toast.success(`Berhasil! ${promo.message || "Diskon diaktifkan."}`, {
          icon: <Sparkles className="text-amber-500" />
        });

      } else {
        throw new Error("Gagal verifikasi ke server.");
      }
    } catch (error) {
      setIsApplied(false);
      onApply(0); // Reset diskon di Kasir jika gagal
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsApplied(false);
    setInputCode("");
    onApply(0);
  };

  return (
    <Card className="p-4 bg-slate-50 border-dashed border-2 border-slate-200 rounded-2xl shadow-none">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Ticket size={16} className="rotate-45" />
          <span className="text-[11px] font-black uppercase tracking-wider">Voucher & Referral</span>
        </div>

        <div className="flex gap-2">
          <Input 
            placeholder="KODE PROMO..." 
            className="h-11 rounded-xl bg-white border-none shadow-sm font-bold text-xs uppercase tracking-widest focus-visible:ring-indigo-500"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            disabled={isLoading || isApplied}
          />
          
          {!isApplied ? (
            <Button 
              onClick={handleVerifyPromo}
              disabled={isLoading}
              className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "APPLY"}
            </Button>
          ) : (
            <Button 
              onClick={handleReset}
              variant="outline"
              className="h-11 px-4 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 font-bold text-[10px] uppercase"
            >
              <XCircle size={16} />
            </Button>
          )}
        </div>

        {isApplied && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 size={12} />
            KODE BERHASIL TERPASANG
          </div>
        )}
      </div>
    </Card>
  );
}