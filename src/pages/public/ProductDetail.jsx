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
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils"; 

// IMPORT KOMPONEN UI [cite: 2026-01-08]
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

  const waUrl = useMemo(() => {
    if (!product) return "";
    const phoneNumber = "6282220947302"; 
    const text = `*KONSULTASI PRODUK*\n` +
                 `------------------\n` +
                 `Item: ${product.name}\n` +
                 `Harga: Rp ${product.price?.toLocaleString("id-ID")}\n` +
                 `------------------\n` +
                 `Halo Admin, saya ingin menanyakan ketersediaan dan detail item ini.`; 
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  }, [product]);

  const handleTanyaAdmin = () => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Silakan masuk ke akun Anda untuk berdiskusi dengan Admin.");
      navigate("/login", { state: { from: location } }); 
      return;
    }
    window.open(waUrl, "_blank");
  };

  if (isLocalLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600 mb-6" size={50} />
      <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Sinkronisasi Basis Data</p>
          <div className="h-[1px] w-20 bg-slate-100 animate-pulse"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-rose-500">
      Produk Tidak Ditemukan dalam Sistem
    </div>
  );

  return (
    <div className="container mx-auto p-6 md:p-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans text-left">
      
      {/* Navigasi Header */}
      <div className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="font-black text-[10px] tracking-widest gap-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 group uppercase px-6">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Katalog
        </Button>
        <Badge variant="outline" className="text-[9px] font-black border-slate-100 uppercase tracking-[0.2em] text-slate-400">
          Sistem Intelijen v1.1
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-20 items-start">
        
        {/* MEDIA KONSOL [cite: 2026-01-08] */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl rounded-[3.5rem] bg-slate-50 relative">
            <img 
              src={product.image} 
              className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-1000" 
              alt={product.name}
            />
            {!product.isAvailable && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                  <span className="text-sm font-black uppercase tracking-[0.5em] text-rose-600 rotate-12 border-4 border-rose-600 p-4">Stok Habis</span>
               </div>
            )}
          </Card>
          
          {/* GRID DATA TEKNIS [cite: 2025-09-29] */}
          <div className="grid grid-cols-3 gap-4">
              <SpecCard icon={<Layers size={14}/>} label="Kategori" value={product.category} />
              <SpecCard icon={<Star size={14}/>} label="Rating" value={product.avgRating || "0.0"} />
              <SpecCard icon={<ShieldCheck size={14}/>} label="Kondisi" value={product.isAvailable ? "Terverifikasi" : "Kosong"} />
          </div>
        </div>

        {/* ANTARMUKA INFORMASI */}
        <div className="flex flex-col">
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-600 text-white border-none px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase">
                {product.isAvailable ? "Sistem Siap" : "Mode Siaga"}
              </Badge>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black italic uppercase text-slate-900 leading-[0.85] tracking-tighter">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <RatingStars rating={product.avgRating || 0} size={18} />
                <span className="text-sm font-black text-slate-900">{product.avgRating || "0.0"}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {product.reviews?.length || 0} Laporan Terverifikasi
              </p>
            </div>

            <div className="pt-6">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Nilai Investasi</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter italic">
                  <span className="text-xl align-top mr-2 text-indigo-600">IDR</span>
                  {product.price?.toLocaleString("id-ID")}
                </p>
            </div>
          </div>

          <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border-2 border-dashed border-indigo-100 mb-12 relative group">
              <div className="absolute -top-3 -left-3 bg-white p-2 rounded-xl border border-slate-100">
                  <Info size={16} className="text-indigo-600" />
              </div>
              <p className="text-base text-slate-600 leading-relaxed font-medium italic">
                "{product.description || "Memulai inisialisasi deskripsi produk..."}"
              </p>
          </div>

          {/* PUSAT INTERAKSI */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button 
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className="h-20 flex-1 rounded-[2rem] bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest gap-4 shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:grayscale"
            >
              <ShoppingCart size={22} /> Amankan Unit
            </Button>

            <Button 
              onClick={handleTanyaAdmin}
              disabled={!product.isAvailable}
              variant="outline"
              className="h-20 flex-1 rounded-[2rem] border-2 border-slate-200 font-black uppercase tracking-widest gap-4 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
            >
              <MessageCircle size={22} /> Tanya Admin
            </Button>
          </div>
        </div>
      </div>

      {/* ================= SEKSI ANALISIS PENGGUNA [cite: 2026-01-08] ================= */}
      <div className="mt-32 border-t-2 border-slate-50 pt-20">
        <div className="flex items-center gap-4 mb-16">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                Analisis <span className="text-indigo-600">Pengguna</span>
            </h3>
            <div className="h-[2px] flex-1 bg-slate-50"></div>
            <Zap className="text-amber-400" size={24} fill="currentColor" />
        </div>
        
        <ReviewSection 
          product={product} 
          onReviewSubmit={submitReview} 
        />
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }) {
    return (
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-all">
            <div className="text-indigo-600 p-2 bg-slate-50 rounded-xl">{icon}</div>
            <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-[10px] font-black text-slate-900 truncate max-w-[80px] uppercase">{value}</p>
            </div>
        </div>
    )
}