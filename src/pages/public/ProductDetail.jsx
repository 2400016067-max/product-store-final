import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../contexts/CartContext"; 
import { useAuth } from "../../contexts/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Loader2, ShoppingCart } from "lucide-react";

// FIX UTAMA: Import utilitas cn agar tidak error "cn is not defined" [cite: 2025-09-29]
import { cn } from "@/lib/utils"; 

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { getProductById } = useProducts();
  const { addToCart } = useCart(); 
  const { isAuthenticated } = useAuth(); 
  
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
        console.error("Error Fetching Product:", err);
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

  // FUNGSI PROTEKSI: Paksa login sebelum tanya admin [cite: 2025-12-13, 2025-09-29]
  const handleTanyaAdmin = () => {
    if (!isAuthenticated) {
      alert("Sesi Diperlukan: Silakan login sebagai Viewer untuk menghubungi Admin.");
      // Simpan lokasi saat ini agar setelah login bisa balik lagi ke sini [cite: 2025-12-13]
      navigate("/login", { state: { from: location } }); 
      return;
    }
    // Jika sudah login, baru izinkan buka WhatsApp
    window.open(waUrl, "_blank");
  };

  if (isLocalLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!product) return <div className="p-20 text-center font-bold text-slate-500 uppercase tracking-widest">Produk Tidak Ditemukan</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl animate-in fade-in duration-500 font-sans">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 font-bold gap-2 hover:bg-slate-100 rounded-xl transition-all">
        <ArrowLeft size={18} /> KEMBALI KE KATALOG
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Gambar Produk */}
        <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-slate-100">
          <img 
            src={product.image} 
            className="w-full h-full min-h-[400px] object-cover hover:scale-105 transition-transform duration-500" 
            onError={(e) => e.target.src="https://placehold.co/600"}
            alt={product.name}
          />
        </Card>

        {/* Informasi Produk */}
        <div className="flex flex-col justify-center">
          <div className="space-y-4 mb-8">
            {product.isAvailable ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">Tersedia</Badge>
            ) : (
              <Badge className="bg-rose-500 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">Stok Habis</Badge>
            )}
            
            <h1 className="text-5xl font-black italic uppercase text-slate-900 leading-none tracking-tighter">{product.name}</h1>
            <p className="text-4xl font-black text-blue-600 tracking-tighter drop-shadow-sm">
              Rp {product.price?.toLocaleString("id-ID")}
            </p>
          </div>

          <Card className="bg-slate-50 border-none shadow-inner mb-10 rounded-2xl">
            <CardContent className="p-6 italic text-slate-500 leading-relaxed text-sm">
              "{product.description || "Tidak ada deskripsi untuk produk ini."}"
            </CardContent>
          </Card>

          {/* Area Tombol Aksi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              <ShoppingCart size={20} /> Keranjang
            </Button>

            {/* Tombol Tanya Admin dengan proteksi cn [cite: 2025-09-29] */}
            <Button 
              onClick={handleTanyaAdmin}
              disabled={!product.isAvailable}
              className={cn(
                "h-16 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 transition-all",
                product.isAvailable ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-300 text-slate-500 cursor-not-allowed"
              )}
            >
              <MessageCircle size={20} /> Tanya Admin
            </Button>
          </div>
          
          {!product.isAvailable && (
            <p className="mt-4 text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center italic animate-pulse">
              *Produk ini sedang tidak dapat dipesan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}