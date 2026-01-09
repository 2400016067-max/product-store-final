import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({ 
  rating = 0, 
  maxStars = 5, 
  size = 16, 
  className = "" 
}) {
  // Logika Matematika Bintang [cite: 2025-09-29]
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {/* 1. Render Bintang Penuh */}
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`full-${i}`} 
          size={size} 
          className="fill-amber-400 text-amber-400" 
        />
      ))}

      {/* 2. Render Bintang Setengah (Jika Ada) */}
      {hasHalfStar && (
        <StarHalf 
          size={size} 
          className="fill-amber-400 text-amber-400" 
        />
      )}

      {/* 3. Render Bintang Kosong */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          size={size} 
          className="text-slate-300" 
        />
      ))}

      {/* Menampilkan angka rating (Opsional) */}
      {rating > 0 && (
        <span className="ml-1 text-xs font-bold text-slate-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}