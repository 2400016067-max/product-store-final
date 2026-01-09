import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Star, Send, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ReviewForm({ productId, existingReviews = [], onReviewSubmit }) {
  const { user, isAuthenticated } = useAuth();
  
  // State untuk form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analisis SI: Validasi apakah user sudah pernah ulas produk ini [cite: 2026-01-08]
  const hasReviewed = existingReviews.some((rev) => rev.userId === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Pilih jumlah bintang dulu, Boy!");

    setIsSubmitting(true);
    
    const reviewPayload = {
      userId: user.id,
      username: user.username,
      rating: rating,
      comment: comment,
    };

    const result = await onReviewSubmit(productId, reviewPayload);
    
    if (result.success) {
      setRating(0);
      setComment("");
    } else {
      alert("Error: " + result.message);
    }
    setIsSubmitting(false);
  };

  // 1. TAMPILAN JIKA BELUM LOGIN
  if (!isAuthenticated) {
    return (
      <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-amber-500">
          <ShieldAlert size={24} />
        </div>
        <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Login Diperlukan</p>
        <p className="text-[10px] text-slate-400 italic">Silakan masuk untuk memberikan rating & ulasan.</p>
      </div>
    );
  }

  // 2. TAMPILAN JIKA SUDAH PERNAH ULAS (1 User 1 Komentar) [cite: 2025-09-29]
  if (hasReviewed) {
    return (
      <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 text-center space-y-3 animate-in zoom-in duration-500">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-200 text-white">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Terima Kasih!</p>
        <p className="text-[10px] text-blue-500 font-medium italic">Anda telah memberikan ulasan untuk produk ini.</p>
      </div>
    );
  }

  // 3. FORM UTAMA
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-2xl shadow-slate-100 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tulis Ulasan</h4>
        <p className="text-[10px] text-slate-400 font-medium italic">Bagikan pendapatmu tentang produk ini.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Interactive Star Picker */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rating Anda</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                disabled={isSubmitting}
                className="transition-all active:scale-75 disabled:opacity-50"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star 
                  size={32} 
                  className={cn(
                    "transition-all duration-200",
                    (hover || rating) >= star 
                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                      : "text-slate-200"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Komentar</span>
          <Textarea 
            disabled={isSubmitting}
            placeholder="Tulis ulasan jujur Anda..."
            className="rounded-[1.5rem] border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 min-h-[120px] font-medium transition-all"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:bg-slate-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} /> 
              Mengirim...
            </>
          ) : (
            <>
              <Send size={14} className="mr-2" /> 
              Kirim Ulasan
            </>
          )}
        </Button>
      </form>
    </div>
  );
}