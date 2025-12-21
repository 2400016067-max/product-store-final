import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Loader2, Ban } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // 1. FETCH DATA (DENGAN PERBAIKAN ARRAY)
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLocalLoading(true);
        const rawData = await getProductById(id);
        
        let cleanData = null;
        if (Array.isArray(rawData)) {
          cleanData = rawData.length > 0 ? rawData[0] : null;
        } else {
          cleanData = rawData;
        }
        
        setProduct(cleanData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLocalLoading(false);
      }
    };
    loadProduct();
  }, [id, getProductById]);

  // 2. LOGIKA URL WHATSAPP
  const waUrl = useMemo(() => {
    if (!product || !product.name) return "";
    
    const phoneNumber = "6282220947302"; 
    const text = `Halo Admin, saya ingin memesan:\n` +
                 `*${product.name}*\n` +
                 `Harga: Rp ${product.price?.toLocaleString("id-ID")}\n` +
                 `(Status Stok: ${product.isAvailable ? "Ada" : "Habis"})`; 
                 
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  }, [product]);

  if (isLocalLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!product) return <div className="p-20 text-center">Produk Tidak Ditemukan</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 font-bold gap-2">
        <ArrowLeft size={18} /> KEMBALI
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-none shadow-2xl rounded-2xl">
          <img src={product.image} className="w-full h-[400px] object-cover" onError={(e) => e.target.src="https://placehold.co/600"}/>
        </Card>

        <div className="flex flex-col py-4">
          <div className="space-y-4 mb-8">
            {/* BADGE STATUS STOK */}
            {product.isAvailable ? (
              <Badge className="bg-green-600">STOK TERSEDIA</Badge>
            ) : (
              <Badge className="bg-red-500">STOK HABIS</Badge>
            )}
            
            <h1 className="text-5xl font-black italic uppercase">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600">Rp {product.price?.toLocaleString("id-ID")}</p>
          </div>

          <Card className="bg-slate-50 border-none shadow-inner mb-8">
            <CardContent className="p-6 italic text-slate-600">"{product.description}"</CardContent>
          </Card>

          <div className="mt-auto pt-6 border-t">
            {waUrl ? (
              // TOMBOL FINAL: Perhatikan ini adalah tag <a>, bukan <Button>
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`
                  flex items-center justify-center w-full text-white gap-3 font-black py-8 text-2xl shadow-xl rounded-2xl cursor-pointer no-underline relative z-[999] transition-all
                  ${product.isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}
                `}
              >
                {/* Perhatikan Teksnya Berubah Jadi "BELI SEKARANG" */}
                {product.isAvailable ? (
                  <><MessageCircle size={32} /> BELI SEKARANG</>
                ) : (
                  <><Ban size={32} /> PRE-ORDER (STOK HABIS)</>
                )}
              </a>
            ) : (
              <div className="p-4 bg-gray-100 text-center animate-pulse">Loading Link...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}