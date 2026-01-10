import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  Calendar, 
  Tag, 
  Loader2, 
  Send, 
  MessageSquare, 
  Percent 
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Pastikan path benar
import { toast } from "sonner";

export default function PersonalPromoModal({ targetUser }) {
  const { sendPersonalPromo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Untuk menutup modal otomatis
  
  const [promo, setPromo] = useState({
    code: "",
    discount: "",
    message: "",
    validUntil: ""
  });

  // --- LOGIKA PENGIRIMAN DATA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Dasar SI
    if (!promo.code || !promo.discount || !promo.validUntil) {
      return toast.error("Data Tidak Lengkap", { 
        description: "Kode, nominal, dan batas waktu wajib diisi." 
      });
    }

    setLoading(true);

    try {
      // Mengirim data ke mesin AuthContext [cite: 2026-01-10]
      const res = await sendPersonalPromo(targetUser.id, {
        ...promo,
        discount: Number(promo.discount), // Memastikan tipe data number
        validUntil: new Date(promo.validUntil).toISOString() // Standarisasi ISO
      });

      if (res.success) {
        toast.success("Promo Berhasil Terkirim", {
          description: `Voucher ${promo.code} telah diaktifkan untuk ${targetUser.name}.`
        });
        setOpen(false); // Tutup modal jika sukses
        setPromo({ code: "", discount: "", message: "", validUntil: "" }); // Reset form
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error("Gagal Mengirim Promo", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-4 rounded-2xl gap-2 text-[10px] font-black uppercase tracking-widest border-amber-200 text-amber-600 hover:bg-amber-50 transition-all active:scale-95 shadow-sm"
        >
          <Gift size={14} className="animate-bounce" /> Gift Promo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] rounded-[3rem] p-10 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-4">
            <Gift size={32} />
          </div>
          <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Personal Offer
          </DialogTitle>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Target: <span className="text-indigo-600 underline">{targetUser.name}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Kode Promo */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
              <Tag size={12} /> Voucher Code
            </label>
            <Input 
              required
              placeholder="CONTOH: IMAMVIP20" 
              value={promo.code} 
              onChange={(e) => setPromo({...promo, code: e.target.value.toUpperCase()})}
              className="h-14 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Nominal Diskon */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Percent size={12} /> Discount (IDR)
              </label>
              <Input 
                type="number" 
                required
                placeholder="20000" 
                value={promo.discount} 
                onChange={(e) => setPromo({...promo, discount: e.target.value})}
                className="h-14 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold shadow-inner"
              />
            </div>

            {/* Input Batas Waktu */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Expiry Date
              </label>
              <Input 
                type="datetime-local" 
                required
                value={promo.validUntil} 
                onChange={(e) => setPromo({...promo, validUntil: e.target.value})}
                className="h-14 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold shadow-inner text-xs"
              />
            </div>
          </div>

          {/* Input Pesan Personal */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> Personal Message
            </label>
            <Input 
              placeholder="Berikan pesan hangat untuk user..." 
              value={promo.message} 
              onChange={(e) => setPromo({...promo, message: e.target.value})}
              className="h-14 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold shadow-inner"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-[1.8rem] bg-slate-950 hover:bg-slate-800 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Kirim Voucher <Send size={18} /></>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}