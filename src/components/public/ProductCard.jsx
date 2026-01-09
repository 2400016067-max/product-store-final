import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 
import { Eye, Star, Box, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// IMPORT RATINGSTARS: Pastikan file ini sudah ada di folder ui kamu [cite: 2026-01-08]
import RatingStars from "../ui/RatingStars";

export default function ProductCard({ product }) {
  const hasReviews = product.reviews && product.reviews.length > 0;
  const isTopRated = product.avgRating >= 4.5;

  return (
    <Card className="group flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 shadow-sm hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-500 overflow-hidden text-left relative">
      
      {/* 1. MEDIA & OVERLAY SECTION */}
      <div className="relative h-72 w-full overflow-hidden bg-slate-50">
        {/* Category Badge */}
        <div className="absolute top-5 left-5 z-20">
          <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-none px-4 py-1.5 text-[7px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
            {product.category}
          </Badge>
        </div>

        {/* Top Rated Indicator [cite: 2025-09-29] */}
        {isTopRated && (
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
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Premium+Item" }} 
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Stock Status Badge */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Badge variant="destructive" className="font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-2xl">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      {/* 2. CONTENT SECTION */}
      <CardHeader className="flex-grow pt-8 px-8 pb-3">
        {/* RATING DISPLAY: Integrated Numeric + Stars [cite: 2026-01-08] */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-inner">
            <Star size={10} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-black text-slate-900 italic tracking-tighter">
              {product.avgRating || "0.0"}
            </span>
          </div>
          <Separator orientation="vertical" className="h-3 bg-slate-200" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            {hasReviews ? `${product.reviews.length} Feedbacks` : "No Reviews Yet"}
          </span>
        </div>
        
        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9] group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-2 mb-6 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Market Price</span>
            <div className="font-black text-slate-900 text-3xl tracking-tighter italic leading-none">
              <span className="text-sm align-top mr-1">Rp</span>
              {product.price?.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </CardContent>

      {/* 3. ACTION SECTION */}
      <CardFooter className="px-8 pb-8 pt-0 mt-auto">
        <Link to={`/detail/${product.id}`} className="w-full">
          <Button 
            variant="default" 
            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-between px-8 shadow-xl shadow-slate-200 group-hover:shadow-blue-200/50 active:scale-95 border-none"
          >
            <div className="flex items-center gap-3">
              <Eye size={16} />
              <span>Explore Detail</span>
            </div>
            <div className="w-6 h-[1px] bg-white/30 group-hover:w-10 transition-all" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// Helper Separator simple agar tidak perlu install Radix Separator jika belum ada
function Separator({ className, orientation = "horizontal" }) {
  return (
    <div className={`${orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full"} ${className}`} />
  );
}