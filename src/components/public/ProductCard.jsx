import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 
import { Eye, Star, Zap, TrendingDown, Clock, Sparkles, BoxSelect } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// IMPORT LOGIKA WAKTU PROMO [cite: 2026-01-10]
import { usePromo } from "../../hooks/usePromo";

export default function ProductCard({ product }) {
  const isPromoExpired = usePromo(product.promoEnd);
  const isPromoActive = product.discountPercent > 0 && !isPromoExpired;
  
  const [timeLeft, setTimeLeft] = useState("");

  // LOGIKA COUNTDOWN: Memberikan tekanan psikologis real-time [cite: 2025-09-29, 2026-01-10]
  useEffect(() => {
    if (!isPromoActive) return;

    const calculateTime = () => {
      const diff = new Date(product.promoEnd) - new Date();
      if (diff <= 0) return setTimeLeft("EXPIRED");

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      if (hours > 0) return setTimeLeft(`${hours}j ${minutes}m`);
      return setTimeLeft(`${minutes}m`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Sinkronisasi tiap menit [cite: 2026-01-10]
    return () => clearInterval(timer);
  }, [product.promoEnd, isPromoActive]);

  const hasReviews = product.reviews && product.reviews.length > 0;
  const isTopRated = product.avgRating >= 4.5;

  return (
    <Card className={cn(
      "group flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] transition-all duration-500 overflow-hidden text-left relative",
      product.isAvailable 
        ? "hover:border-indigo-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/40" 
        : "opacity-80 grayscale-[0.3] shadow-none border-slate-50"
    )}>
      
      {/* 1. MEDIA & OVERLAY SECTION [cite: 2026-01-10] */}
      <div className="relative h-72 w-full overflow-hidden bg-slate-50">
        
        {/* SOLD OUT OVERLAY: Memastikan user tidak melakukan spekulasi pada stok kosong [cite: 2026-01-10] */}
        {!product.isAvailable && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-[3px] animate-in fade-in duration-500">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl transform -rotate-12 border-2 border-slate-200 flex items-center gap-3">
              <BoxSelect size={18} className="text-rose-600 animate-pulse" />
              <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs leading-none">
                Sold Out
              </p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-5 left-5 z-20">
          <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-none px-4 py-1.5 text-[7px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
            {product.category}
          </Badge>
        </div>

        {/* STRATEGIC PROMO BADGE: Desain Gradient High-Contrast [cite: 2026-01-10] */}
        {isPromoActive && product.isAvailable && (
          <div className="absolute top-16 left-5 z-20 flex flex-col gap-2 animate-in slide-in-from-left duration-500">
            <Badge className="bg-gradient-to-r from-rose-600 to-orange-500 text-white border-none px-4 py-2 text-[11px] font-black uppercase tracking-tighter rounded-xl shadow-[0_10px_20px_rgba(225,29,72,0.4)] flex items-center gap-2 group-hover:scale-110 transition-transform">
              <TrendingDown size={14} className="animate-bounce" />
              SAVE {product.discountPercent}%
            </Badge>
            
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xl border border-white/10 self-start">
              <Clock size={10} className="text-rose-400 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                Sisa: {timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* Top Rated Indicator */}
        {isTopRated && product.isAvailable && (
          <div className="absolute top-5 right-5 z-20 animate-in fade-in zoom-in duration-700">
            <div className="bg-amber-400 text-slate-900 p-2 rounded-xl shadow-xl shadow-amber-200/50 -rotate-12 group-hover:rotate-0 transition-transform">
              <Zap size={14} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className={cn(
            "h-full w-full object-cover transition-transform duration-1000",
            product.isAvailable && "group-hover:scale-110"
          )}
          onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Premium+Item" }} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* 2. CONTENT SECTION */}
      <CardHeader className="flex-grow pt-8 px-8 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-inner">
            <Star size={10} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-black text-slate-900 italic tracking-tighter">
              {product.avgRating || "0.0"}
            </span>
          </div>
          <div className="w-[1px] h-3 bg-slate-200" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            {hasReviews ? `${product.reviews.length} Feedbacks` : "No Reviews Yet"}
          </span>
        </div>
        
        <CardTitle className={cn(
          "text-2xl font-black italic uppercase tracking-tighter leading-[0.9] transition-colors duration-300",
          product.isAvailable ? "text-slate-900 group-hover:text-indigo-600" : "text-slate-400"
        )}>
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-2 mb-6 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
          {product.description}
        </p>
        
        {/* PRICE DISPLAY: Transparansi Nilai Investasi [cite: 2026-01-10] */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col text-left">
            <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.3em] mb-1 transition-colors",
                isPromoActive && product.isAvailable ? "text-rose-600 animate-pulse" : "text-indigo-600",
                !product.isAvailable && "text-slate-400 opacity-50"
            )}>
              {isPromoActive && product.isAvailable ? "Strategic Limited Offer" : "Market Price"}
            </span>
            
            <div className="flex flex-col">
              {isPromoActive && product.isAvailable && (
                <span className="text-xs font-bold text-slate-400 line-through tracking-tighter mb-1 opacity-60">
                  Rp {product.originalPrice?.toLocaleString("id-ID")}
                </span>
              )}
              <div className={cn(
                "font-black text-3xl tracking-tighter italic leading-none transition-all duration-300",
                isPromoActive && product.isAvailable ? "text-rose-600 scale-105 origin-left" : "text-slate-900",
                !product.isAvailable && "text-slate-400"
              )}>
                <span className="text-sm align-top mr-1">Rp</span>
                {product.price?.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 3. ACTION SECTION [cite: 2025-09-29] */}
      <CardFooter className="px-8 pb-8 pt-0 mt-auto">
        <Link to={`/detail/${product.id}`} className={cn("w-full", !product.isAvailable && "pointer-events-none")}>
          <Button 
            variant="default" 
            disabled={!product.isAvailable}
            className={cn(
              "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-between px-8 border-none shadow-xl",
              product.isAvailable 
                ? "bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-200 group-hover:shadow-indigo-200/50 active:scale-95" 
                : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3 text-left">
              <Eye size={16} />
              <span>{product.isAvailable ? "Explore Detail" : "Unit Unavailable"}</span>
            </div>
            {product.isAvailable && <Sparkles size={16} className="text-white/30 group-hover:text-amber-400 group-hover:animate-spin transition-all" />}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}