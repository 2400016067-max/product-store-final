import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Wajib untuk navigasi

export default function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* 1. Gambar Produk dengan Fallback Logic */}
      <img 
        src={product.image} 
        alt={product.name} 
        className="h-48 w-full object-cover"
        // Menangani jika URL gambar di MockAPI mati [cite: 2025-09-29]
        onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Gambar+Kosong" }}
      />
      
      <CardHeader className="flex-grow">
        <div className="text-xs text-muted-foreground uppercase font-semibold">
          {product.category}
        </div>
        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="font-bold text-primary text-lg">
          Rp {product.price.toLocaleString("id-ID")}
        </div>
      </CardContent>

      <CardFooter>
        {/* 2. Navigasi Dinamis: 
          Mengarahkan user ke halaman detail berdasarkan ID unik produk.
        */}
        <Link to={`/detail/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full hover:bg-primary hover:text-white transition-colors">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}