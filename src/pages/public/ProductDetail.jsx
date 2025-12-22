import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../contexts/CartContext"; // 1. Import Mesin Keranjang [cite: 2025-12-22]
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Loader2, Ban, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart(); // 2. Ambil fungsi addToCart [cite: 2025-12-22]
  
  const [product, setProduct] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLocalLoading(true);
        const rawData = await getProductById(id);
        let cleanData = Array.isArray(rawData) ? (rawData.length > 0 ? rawData[0] : null) : rawData;
        setProduct(cleanData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLocalLoading(false);
      }
    };
    loadProduct();
  }, [id, getProductById]);

  const waUrl = useMemo(() => {
    if (!product || !product.name) return "";
    const phoneNumber = "6282220947302"; 
    const text = `Halo Admin, saya ingin bertanya tentang produk:\n` +
                 `*${product.name}*\n` +
                 `Harga: Rp ${product.price?.toLocaleString("id-ID")}`; 
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  }, [product]);

  if (isLocalLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!product) return <div className="p-20 text-center font-bold text-slate-500">Produk Tidak Ditemukan</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 font-bold gap-2 hover:bg-slate-100 rounded-xl">
        <ArrowLeft size={18} /> KEMBALI KE KATALOG
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        <Card className="overflow-hidden border-none shadow-2xl rounded-[2rem] bg-slate-100">
          <img 
            src={product.image} 
            className="w-full h-full min-h-[400px] object-cover hover:scale-105 transition-transform duration-500" 
            onError={(e) => e.target.src="https://placehold.co/600"}
            alt={product.name}
          />
        </Card>

        <div className="flex flex-col justify-center">
          <div className="space-y-4 mb-8">
            {product.isAvailable ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Tersedia</Badge>
            ) : (
              <Badge className="bg-rose-500 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Stok Habis</Badge>
            )}
            
            <h1 className="text-5xl font-black italic uppercase text-slate-900 leading-none">{product.name}</h1>
            <p className="text-4xl font-black text-blue-600 tracking-tighter">
              Rp {product.price?.toLocaleString("id-ID")}
            </p>
          </div>

          <Card className="bg-slate-50 border-none shadow-inner mb-10 rounded-2xl">
            <CardContent className="p-6 italic text-slate-500 leading-relaxed">
              "{product.description || "Tidak ada deskripsi untuk produk ini."}"
            </CardContent>
          </Card>

          {/* AREA TOMBOL AKSI [cite: 2025-12-22] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TOMBOL 1: ADD TO CART [cite: 2025-12-22] */}
            <Button 
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              <ShoppingCart size={20} /> Keranjang
            </Button>

            {/* TOMBOL 2: DIRECT WA [cite: 2025-12-22] */}
            <Button 
              asChild
              disabled={!product.isAvailable}
              className={`h-16 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 transition-all ${
                product.isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-slate-300 pointer-events-none"
              }`}
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} /> Tanya Admin
              </a>
            </Button>
          </div>
          
          {!product.isAvailable && (
            <p className="mt-4 text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center italic">
              *Produk ini sedang tidak dapat dipesan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}