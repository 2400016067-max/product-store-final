import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { 
  Tag, Clock, Send, Package, Percent, Zap, Sparkles, 
  ShieldCheck, AlertCircle, TrendingDown, MessageSquare, Edit3, Eye, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ManagerPromo() {
  const { products, updateProduct } = useProducts();
  const { broadcastMessage } = useAuth();
  
  const [selectedId, setSelectedId] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("2");
  const [isAutoMessage, setIsAutoMessage] = useState(true);
  const [customMessage, setCustomMessage] = useState("");

  const selectedProduct = products.find(p => p.id === selectedId);
  const activePromos = products.filter(p => p.discountPercent > 0);

  // Generate Auto Message Logic
  useEffect(() => {
    if (selectedProduct && isAutoMessage) {
      const msg = `🚀 STRATEGIC PROMO: ${selectedProduct.name.toUpperCase()} DISKON ${discount || "0"}% HANYA UNTUK ${duration} JAM KE DEPAN! BURUAN SERBU!`;
      setCustomMessage(msg);
    }
  }, [selectedProduct, discount, duration, isAutoMessage]);

  const handleApplyPromo = async () => {
    if (!selectedProduct) return toast.error("Kesalahan: Produk tidak teridentifikasi.");
    if (!discount || Number(discount) <= 0 || Number(discount) > 99) {
      return toast.error("Kesalahan: Persentase diskon tidak valid (1-99%).");
    }

    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000).toISOString();
    const discountPrice = Math.round(selectedProduct.originalPrice - (selectedProduct.originalPrice * (parseInt(discount) / 100)));

    toast.promise(
      async () => {
        await updateProduct(selectedId, {
          price: discountPrice,
          discountPercent: parseInt(discount),
          promoStart: startTime,
          promoEnd: endTime
        });
        await broadcastMessage(customMessage);
      },
      {
        loading: (
          <div className="flex items-center gap-3">
            <Zap className="animate-pulse text-indigo-600" size={16} />
            <span className="font-black uppercase text-[10px] tracking-widest text-slate-900">Mengkalkulasi & Menyebarkan Kampanye...</span>
          </div>
        ),
        success: "Kampanye Promo Berhasil Diaktivasi Global!",
        error: "Kegagalan Sistem: Gagal mengeksekusi perintah promo.",
      }
    );
  };

  // FITUR TERBARU: TERMINASI PROMO TUNGGAL [cite: 2026-01-10]
  const handleTerminatePromo = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    toast.promise(
      async () => {
        await updateProduct(productId, {
          price: product.originalPrice,
          discountPercent: 0,
          promoStart: null,
          promoEnd: new Date().toISOString()
        });
        await broadcastMessage(`SISTEM ALERT: PROMO UNTUK ${product.name.toUpperCase()} TELAH BERAKHIR. HARGA KEMBALI NORMAL.`);
      },
      {
        loading: "Mengeksekusi Terminasi...",
        success: `${product.name} Kembali ke Harga Normal!`,
        error: "Gagal menghentikan promo.",
      }
    );
  };

  // FITUR TERBARU: GLOBAL TERMINATION [cite: 2026-01-10]
  const handleTerminateAll = async () => {
    if (!window.confirm("PERINGATAN STRATEGIS: Hentikan SEMUA promo aktif sekarang?")) return;

    toast.promise(
      async () => {
        for (const p of activePromos) {
          await updateProduct(p.id, {
            price: p.originalPrice,
            discountPercent: 0,
            promoStart: null,
            promoEnd: new Date().toISOString()
          });
        }
        await broadcastMessage("SISTEM ALERT: SELURUH PROMO GLOBAL TELAH DIAKHIRI. HARGA KEMBALI NORMAL.");
      },
      {
        loading: "Memulihkan Harga Global...",
        success: "Seluruh Promo Berhasil Dihentikan!",
        error: "Gagal menghentikan seluruh promo.",
      }
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-left max-w-6xl mx-auto font-sans p-4 md:p-0">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown size={20} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300/80">Revenue Optimization</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Strategic <span className="text-indigo-500">Marketing</span>
          </h2>
          <p className="text-slate-400 text-sm mt-6 font-medium max-w-lg leading-relaxed uppercase">
            Otoritas Manager: Manipulasi harga pasar & kontrol narasi promosi secara real-time.
          </p>
        </div>
        <Tag className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: CONFIGURATION COMMAND */}
        <Card className="lg:col-span-7 rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-indigo-600" />
              <CardTitle className="text-xl font-black uppercase italic text-slate-900">Konfigurasi Parameter</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            
            {/* Input Row 1: Product Selection */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Package size={14} className="text-indigo-600" /> Target Unit
              </label>
              <Select onValueChange={setSelectedId}>
                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-xs uppercase shadow-inner">
                  <SelectValue placeholder="SCAN DATABASE PRODUK..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl p-2">
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id} className="py-4 px-4 uppercase font-black text-[11px] rounded-xl cursor-pointer">
                      {p.name} <span className="ml-2 text-slate-400 font-normal italic">({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.originalPrice)})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input Row 2: Discount & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Percent size={14} className="text-indigo-600" /> Nilai Diskon (%)
                </label>
                <Input 
                  type="number" 
                  placeholder="1-99" 
                  className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-black text-lg text-center shadow-inner"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600" /> Masa Berlaku
                </label>
                <Select onValueChange={setDuration} defaultValue="2">
                  <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase shadow-inner">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2">
                    <SelectItem value="1" className="font-black uppercase text-[10px]">01 JAM (Express)</SelectItem>
                    <SelectItem value="2" className="font-black uppercase text-[10px]">02 JAM (Standard)</SelectItem>
                    <SelectItem value="24" className="font-black uppercase text-[10px]">24 JAM (Full Day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Input Row 3: Custom Narrative */}
            <div className="space-y-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <MessageSquare size={14} className="text-indigo-600" /> Narasi Siaran (Broadcast)
                </label>
                <div className="flex items-center space-x-2 scale-75 md:scale-90 origin-right">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Auto</Label>
                  <Switch checked={!isAutoMessage} onCheckedChange={(val) => setIsAutoMessage(!val)} />
                  <Label className="text-[10px] font-bold text-slate-900 uppercase">Manual</Label>
                </div>
              </div>
              <Textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                disabled={isAutoMessage}
                placeholder="Tulis pesan promo spesial..."
                className={cn(
                  "min-h-[100px] rounded-xl border-none font-bold text-xs leading-relaxed transition-all",
                  isAutoMessage ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white shadow-md text-indigo-600 focus:ring-2 ring-indigo-500"
                )}
              />
            </div>

            <Button 
              onClick={handleApplyPromo}
              disabled={!selectedId || !discount}
              className="w-full h-20 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-95 gap-4"
            >
              <Send size={20} /> Deploy Strategic Promo
            </Button>

            {/* SECTION TERBARU: ACTIVE DEPLOYMENT CONTROL [cite: 2026-01-10] */}
            <div className="mt-12 pt-10 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-rose-600" size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Active Campaign Monitor</h3>
                </div>
                {activePromos.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={handleTerminateAll}
                    className="h-8 rounded-full text-[9px] font-black text-rose-600 hover:bg-rose-50 uppercase tracking-widest gap-2"
                  >
                    <Trash2 size={12} /> Global Restoration
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {activePromos.map(p => (
                  <div key={p.id} className="group flex items-center justify-between p-5 bg-slate-50 hover:bg-rose-50 rounded-[1.5rem] border border-slate-100 transition-all duration-300">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter group-hover:text-rose-700 transition-colors">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-rose-500 uppercase italic bg-white px-2 py-0.5 rounded-md border border-rose-100 shadow-sm">
                          -{p.discountPercent}% OFF
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">ID: {p.id}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleTerminatePromo(p.id)}
                      className="h-10 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-5 shadow-lg border-none"
                    >
                      Force Stop
                    </Button>
                  </div>
                ))}
                {activePromos.length === 0 && (
                  <div className="p-10 rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center gap-3">
                    <Zap size={20} className="text-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">Tidak ada deployment aktif terdeteksi.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: LIVE IMPACT PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] bg-indigo-600 text-white border-none p-8 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <Eye size={20} className="text-indigo-200" />
                   <p className="font-black uppercase text-xs tracking-widest">Financial Impact Preview</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-indigo-200 uppercase">Harga Final Pasar:</p>
                   <p className="text-4xl font-black italic">
                      {selectedProduct && discount 
                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Math.round(selectedProduct.originalPrice - (selectedProduct.originalPrice * (parseInt(discount) / 100))))
                        : "Rp 0"}
                   </p>
                </div>
                {selectedProduct && (
                  <div className="pt-4 border-t border-indigo-500 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-200 uppercase">Original</p>
                      <p className="text-sm font-bold line-through opacity-60">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedProduct.originalPrice)}
                      </p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                       <p className="text-[10px] font-black text-white italic">SAVE {discount}%</p>
                    </div>
                  </div>
                )}
             </div>
             <Sparkles className="absolute -right-6 -top-6 w-32 h-32 text-white/10" />
          </Card>

          <Card className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Edit3 className="text-amber-400" size={20} />
                   <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Global Broadcast View</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">Live Feed Preview:</p>
                   <p className="text-xs font-black text-indigo-600 italic leading-relaxed uppercase">
                      {customMessage || "Menunggu Input Konfigurasi..."}
                   </p>
                </div>
                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <AlertCircle className="text-amber-600 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-amber-700 leading-tight uppercase">
                    Pesan ini akan dikirimkan ke seluruh user yang sedang online saat tombol deploy ditekan.
                  </p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}