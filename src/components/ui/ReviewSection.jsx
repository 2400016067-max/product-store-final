import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import RatingStars from "./RatingStars"; // Sesuaikan path karena satu folder
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  User, 
  Star, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewSection({ product, onReviewSubmit }) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proteksi SI: Cek duplikasi ulasan [cite: 2026-01-08]
  const hasReviewed = product.reviews?.some((rev) => rev.userId === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Berikan rating bintang dulu, Boy!");

    setIsSubmitting(true);
    const newReview = {
      userId: user.id,
      username: user.username,
      rating: rating,
      comment: comment,
    };

    const result = await onReviewSubmit(product.id, newReview);
    
    if (result.success) {
      setRating(0);
      setComment("");
    } else {
      alert("Gagal: " + result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-20 space-y-12 border-t border-slate-100 pt-16">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
            Customer Voice
          </h3>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
          Total {product.reviews?.length || 0} Feedback Terverifikasi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        
        {/* ================= DAFTAR ULASAN (Kiri) ================= */}
        <div className="lg:col-span-3 space-y-8">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, index) => (
              <div 
                key={index} 
                className="relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <Quote className="absolute top-6 right-8 text-slate-50 group-hover:text-blue-50 transition-colors" size={40} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{rev.username}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Verified Buyer</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <RatingStars rating={rev.rating} size={12} />
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>

                  <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                       Dikirim pada {new Date(rev.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                     </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Star size={24} className="text-slate-200" />
              </div>
              <p className="text-slate-400 italic text-sm font-bold uppercase tracking-widest">Belum Ada Cerita Pengguna</p>
            </div>
          )}
        </div>

        {/* ================= FORM INPUT (Kanan) ================= */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            {!isAuthenticated ? (
              <div className="p-10 bg-slate-900 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-slate-200">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
                  <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">Gate Locked</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">Hanya pengguna terdaftar yang dapat memberikan ulasan pada sistem ini.</p>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl h-12 uppercase text-[10px] tracking-[0.2em]">
                  Sign In Now
                </Button>
              </div>
            ) : hasReviewed ? (
              <div className="p-10 bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] text-center space-y-4 animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-emerald-900 font-black uppercase tracking-widest text-sm">Feedback Saved</h4>
                  <p className="text-emerald-600/70 text-[10px] italic font-medium">Terima kasih atas partisipasi Anda dalam meningkatkan kualitas layanan kami.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 space-y-8 animate-in slide-in-from-right-4 duration-1000">
                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Share Experience</h4>
                  <div className="h-1 w-8 bg-blue-600 mx-auto rounded-full mt-2"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Star Picker */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ketuk Untuk Menilai</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className="transition-all active:scale-75 hover:scale-110"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                        >
                          <Star 
                            size={32} 
                            className={cn(
                              "transition-all duration-300",
                              (hover || rating) >= star 
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" 
                                : "text-slate-100"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Tulis Testimoni</span>
                    <Textarea 
                      placeholder="Bagaimana pendapatmu tentang produk ini?"
                      className="rounded-[2rem] border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-blue-600/5 min-h-[140px] font-medium transition-all p-6 text-sm italic"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    disabled={isSubmitting || rating === 0}
                    className="w-full h-14 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Kirim Feedback
                        <Send size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}