import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Wajib untuk navigasi
import { Eye, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full bg-white border-2 border-slate-50 rounded-[2rem] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 active:scale-[0.98]">
      {/* 1. MEDIA SECTION: Gambar dengan Overlay */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        {/* Category Badge di atas gambar */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 backdrop-blur-md text-blue-600 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-sm">
            {product.category}
          </Badge>
        </div>

        {/* Gambar Produk dengan Fallback Logic */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Produk+Eksklusif" }} 
        />
        
        {/* Overlay Hover Effect */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* 2. CONTENT SECTION */}
      <CardHeader className="flex-grow pt-6 px-6 pb-2">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase">Top Rated</span>
        </div>
        <CardTitle className="text-xl font-black italic uppercase tracking-tighter text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-4">
        <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mb-4 leading-relaxed uppercase tracking-tight">
          {product.description}
        </p>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga Terbaik</span>
          <div className="font-black text-blue-600 text-2xl tracking-tighter italic">
            Rp {product.price?.toLocaleString("id-ID")}
          </div>
        </div>
      </CardContent>

      {/* 3. ACTION SECTION */}
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="grid grid-cols-1 w-full gap-2">
          {/* Navigasi Dinamis ke Halaman Detail */}
          <Link to={`/detail/${product.id}`} className="w-full">
            <Button 
              variant="default" 
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all flex gap-2 shadow-lg shadow-slate-100 group-hover:shadow-blue-100"
            >
              <Eye size={14} />
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}