import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import RatingStars from "./RatingStars"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MessageSquare, 
  User, 
  Star, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  Quote,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewSection({ product, onReviewSubmit, onReviewDelete }) {
  const { user, isAuthenticated, isAdmin, isManager } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Menyimpan ID yang sedang dihapus

  // Proteksi SI: Cek duplikasi ulasan [cite: 2026-01-08]
  const hasReviewed = product.reviews?.some((rev) => rev.userId === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Berikan rating bintang dulu!");

    setIsSubmitting(true);
    const newReview = {
      userId: user.id,
      username: user.name, // Gunakan name yang lebih rapi
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

  const handleDeleteReview = async (reviewId) => {
    setIsDeleting(reviewId);
    const result = await onReviewDelete(product.id, reviewId);
    if (!result.success) {
      alert("Gagal menghapus ulasan: " + result.message);
    }
    setIsDeleting(null);
  };

  return (
    <div className="mt-20 space-y-12 border-t border-slate-100 pt-16">
      {/* Header Section */}
      <div className="flex flex-col gap-2 text-left">
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
            product.reviews.map((rev, index) => {
              // LOGIKA OTORITAS KRITIS [cite: 2026-01-10]
              const isOwner = user?.id === rev.userId;
              const canManage = isAdmin || isManager || isOwner;

              return (
                <div 
                  key={rev.id || index} 
                  className="relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <Quote className="absolute top-6 right-8 text-slate-50 group-hover:text-blue-50 transition-colors" size={40} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm text-slate-400 font-bold">
                          {rev.username?.charAt(0).toUpperCase() || <User size={20} />}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{rev.username}</p>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            {isOwner ? "Ulasan Anda" : "Verified Buyer"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <RatingStars rating={rev.rating} size={12} />
                        </div>

                        {/* TOMBOL HAPUS DENGAN PROTEKSI [cite: 2026-01-10] */}
                        {canManage && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                {isDeleting === rev.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-none">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-black uppercase tracking-tight">Hapus Ulasan?</AlertDialogTitle>
                                <AlertDialogDescription className="text-xs font-medium italic">
                                  Tindakan ini permanen. Ulasan ini akan dihapus dari basis data sistem.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="rounded-xl bg-rose-600 hover:bg-rose-700 font-bold uppercase text-[10px]"
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 text-left leading-relaxed font-medium italic">
                      "{rev.comment}"
                    </p>

                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                         {new Date(rev.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Star size={24} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 italic text-sm font-bold uppercase tracking-widest">Belum Ada Cerita Pengguna</p>
            </div>
          )}
        </div>

        {/* ================= FORM INPUT (Kanan) ================= */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            {!isAuthenticated ? (
              <div className="p-10 bg-slate-900 rounded-[3rem] text-center space-y-6 shadow-2xl">
                <ShieldAlert size={32} className="mx-auto text-amber-400" />
                <div className="space-y-2">
                  <h4 className="text-white font-black uppercase text-sm">Gate Locked</h4>
                  <p className="text-slate-400 text-[10px] italic">Login untuk memberikan ulasan.</p>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl">Sign In Now</Button>
              </div>
            ) : hasReviewed ? (
              <div className="p-10 bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] text-center space-y-4">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                <div className="space-y-1">
                  <h4 className="text-emerald-900 font-black uppercase text-sm">Feedback Saved</h4>
                  <p className="text-emerald-600/70 text-[10px] italic">Terima kasih atas ulasan Anda.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] text-center">Share Experience</h4>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className="transition-all hover:scale-110"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                        >
                          <Star 
                            size={32} 
                            className={cn(
                              "transition-all duration-300",
                              (hover || rating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-100"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea 
                    placeholder="Apa pendapatmu tentang produk ini?"
                    className="rounded-[2rem] bg-slate-50 focus:bg-white min-h-[140px] p-6 text-sm italic"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />

                  <Button 
                    disabled={isSubmitting || rating === 0}
                    className="w-full h-14 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Kirim Feedback"}
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