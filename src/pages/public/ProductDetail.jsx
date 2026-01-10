import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../contexts/CartContext"; 
import { useAuth } from "../../contexts/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MessageCircle, 
  Loader2, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Info,
  Clock,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils"; 

// IMPORT LOGIKA STRATEGIS [cite: 2026-01-10]
import { usePromo } from "../../hooks/usePromo";
import RatingStars from "../../components/ui/RatingStars";
import ReviewSection from "../../components/ui/ReviewSection";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { getProductById, submitReview } = useProducts();
  const { addToCart } = useCart(); 
  const { isAuthenticated } = useAuth(); 
  
  const [product, setProduct] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  // 1. Validasi Status Promo [cite: 2026-01-10]
  const isPromoExpired = usePromo(product?.promoEnd);
  const isPromoActive = product?.discountPercent > 0 && !isPromoExpired;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLocalLoading(true);
        const rawData = await getProductById(id);
        let cleanData = Array.isArray(rawData) ? (rawData.length > 0 ? rawData[0] : null) : rawData;
        setProduct(cleanData);
      } catch (err) {
        console.error("Kesalahan Sinkronisasi Data:", err);
      } finally {
        setIsLocalLoading(false);
      }
    };
    loadProduct();
  }, [id, getProductById]);

  // 2. Logika Countdown Detail [cite: 2026-01-10]
  useEffect(() => {
    if (!isPromoActive) return;

    const calculateTime = () => {
      const diff = new Date(product.promoEnd) - new Date();
      if (diff <= 0) return setTimeLeft("EXPIRED");
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000); // Detik untuk urgensi tinggi
    return () => clearInterval(timer);
  }, [product?.promoEnd, isPromoActive]);

  const waUrl = useMemo(() => {
    if (!product) return "";
    const phoneNumber = "6282220947302"; 
    const text = `*KONSULTASI PRODUK*\n` +
                 `------------------\n` +
                 `Item: ${product.name}\n` +
                 `Harga Aktif: Rp ${product.price?.toLocaleString("id-ID")}\n` +
                 `${isPromoActive ? `*Status: Sedang Promo ${product.discountPercent}%*\n` : ""}` +
                 `------------------\n` +
                 `Halo Admin, saya ingin menanyakan ketersediaan item ini.`; 
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  }, [product, isPromoActive]);

  const handleTanyaAdmin = () => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Silakan masuk untuk berdiskusi dengan Admin.");
      navigate("/login", { state: { from: location } }); 
      return;
    }
    window.open(waUrl, "_blank");
  };

  if (isLocalLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600 mb-6" size={50} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Product Specs...</p>
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-black uppercase text-rose-500">Produk Tidak Ditemukan</div>;

  return (
    <div className="container mx-auto p-6 md:p-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans text-left">
      
      {/* Header Navigasi */}
      <div className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="font-black text-[10px] tracking-widest gap-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 group uppercase px-6">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Katalog
        </Button>
        <Badge variant="outline" className="text-[9px] font-black border-slate-100 uppercase tracking-[0.2em] text-slate-400">
          Security Verified Product
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-20 items-start">
        
        {/* MEDIA SECTION */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl rounded-[3.5rem] bg-slate-50 relative">
            <img 
              src={product.image} 
              className={cn("w-full aspect-square object-cover hover:scale-110 transition-transform duration-1000", !product.isAvailable && "grayscale")} 
              alt={product.name}
            />
            {/* Promo Overlay di Gambar [cite: 2026-01-10] */}
            {isPromoActive && product.isAvailable && (
              <div className="absolute top-10 left-10">
                <Badge className="bg-rose-600 text-white border-none px-6 py-2 rounded-2xl text-xs font-black shadow-2xl animate-bounce">
                  OFF {product.discountPercent}%
                </Badge>
              </div>
            )}
            {!product.isAvailable && (
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center">
                  <span className="text-sm font-black uppercase tracking-[0.5em] text-white border-4 border-white p-6 rotate-12">Sold Out</span>
               </div>
            )}
          </Card>
          
          <div className="grid grid-cols-3 gap-4">
              <SpecCard icon={<Layers size={14}/>} label="Kategori" value={product.category} />
              <SpecCard icon={<Star size={14}/>} label="Rating" value={product.avgRating || "0.0"} />
              <SpecCard icon={<ShieldCheck size={14}/>} label="Status" value={product.isAvailable ? "Ready" : "Empty"} />
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col">
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Badge className={cn("px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase border-none", isPromoActive ? "bg-rose-600 animate-pulse" : "bg-indigo-600")}>
                {isPromoActive ? "Strategic Deal" : "Official Product"}
              </Badge>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black italic uppercase text-slate-900 leading-[0.85] tracking-tighter">
              {product.name}
            </h1>

            {/* UPGRADED PRICE SECTION [cite: 2026-01-10] */}
            <div className="pt-6">
                <div className="flex items-center gap-4 mb-2">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Nilai Investasi</p>
                  {isPromoActive && (
                    <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                      <Clock size={12} className="text-rose-600 animate-spin-slow" />
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{timeLeft}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {isPromoActive && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-slate-400 line-through decoration-rose-500/50">
                        Rp {product.originalPrice?.toLocaleString("id-ID")}
                      </span>
                      <Badge className="bg-rose-100 text-rose-600 border-none font-black text-[9px] px-2 py-0.5">
                        SAVE {product.discountPercent}%
                      </Badge>
                    </div>
                  )}
                  <p className={cn("text-6xl font-black tracking-tighter italic", isPromoActive ? "text-rose-600" : "text-slate-900")}>
                    <span className="text-xl align-top mr-2">IDR</span>
                    {product.price?.toLocaleString("id-ID")}
                  </p>
                </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-12 relative group">
              <div className="absolute -top-3 -left-3 bg-white p-2 rounded-xl border border-slate-100">
                  <Info size={16} className="text-indigo-600" />
              </div>
              <p className="text-base text-slate-600 leading-relaxed font-medium italic">
                "{product.description || "Inisialisasi spesifikasi unit..."}"
              </p>
          </div>

          {/* INTERACTION CENTER */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button 
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className="h-24 flex-1 rounded-[2.5rem] bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest gap-4 shadow-2xl transition-all active:scale-95 disabled:grayscale"
            >
              <ShoppingCart size={24} /> {isPromoActive ? "Amankan Promo" : "Tambah ke Keranjang"}
            </Button>

            <Button 
              onClick={handleTanyaAdmin}
              disabled={!product.isAvailable}
              variant="outline"
              className="h-24 flex-1 rounded-[2.5rem] border-2 border-slate-200 font-black uppercase tracking-widest gap-4 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
            >
              <MessageCircle size={24} /> Konsultasi Unit
            </Button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-32 border-t-2 border-slate-50 pt-20">
        <div className="flex items-center gap-4 mb-16">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                User <span className="text-indigo-600">Analytics</span>
            </h3>
            <div className="h-[2px] flex-1 bg-slate-50"></div>
            <Sparkles className="text-amber-400 animate-pulse" size={24} fill="currentColor" />
        </div>
        
        <ReviewSection product={product} onReviewSubmit={submitReview} />
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }) {
    return (
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-indigo-100 transition-all">
            <div className="text-indigo-600 p-2 bg-slate-50 rounded-xl">{icon}</div>
            <div className="space-y-0.5 overflow-hidden w-full">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-[10px] font-black text-slate-900 uppercase truncate">{value}</p>
            </div>
        </div>
    )
}