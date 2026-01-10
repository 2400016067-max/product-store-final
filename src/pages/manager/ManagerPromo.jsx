import { useState, useEffect, useCallback } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { 
  Tag, Clock, Send, Package, Percent, Zap, Sparkles, 
  ShieldCheck, AlertCircle, TrendingDown, MessageSquare, Edit3, Eye, Trash2,
  Gift, User, Calendar, CheckCircle2, Loader2, ListFilter, XCircle, Fingerprint, RefreshCcw
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
  // UPGRADE: Tambahkan deletePersonalPromo dari AuthContext [cite: 2026-01-10]
  const { broadcastMessage, sendPersonalPromo, deletePersonalPromo } = useAuth(); 
  
  // ==========================================
  // STATE: PROMO GLOBAL (PRODUK)
  // ==========================================
  const [selectedId, setSelectedId] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("2");
  const [isAutoMessage, setIsAutoMessage] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // ==========================================
  // STATE: USER & GIFT PERSONAL
  // ==========================================
  const [allUsers, setAllUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState("");
  const [giftData, setGiftData] = useState({
    code: "",
    discount: "",
    message: "", 
    validUntil: ""
  });
  const [giftLoading, setGiftLoading] = useState(false);

  // STATE: REFERRAL IDENTITY
  const [referralInput, setReferralInput] = useState("");
  const [refLoading, setRefLoading] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedId);
  const activePromos = products.filter(p => p.discountPercent > 0);

  // 1. FETCH DATA USER UNTUK LIST
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
      if (!res.ok) throw new Error("Gagal mengambil data user");
      const data = await res.json();
      setAllUsers(data.filter(u => u.role?.toLowerCase() === "viewer"));
    } catch (e) {
      console.error(e);
      toast.error("Gagal sinkronisasi database user.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update input referral secara otomatis saat user dipilih
  useEffect(() => {
    const user = allUsers.find(u => u.id === targetUserId);
    if (user) {
      setReferralInput(user.referralCode || "");
    } else {
      setReferralInput("");
    }
  }, [targetUserId, allUsers]);

  // 2. GENERATE AUTO MESSAGE LOGIC (GLOBAL PROMO)
  useEffect(() => {
    if (selectedProduct && isAutoMessage) {
      const msg = `🚀 STRATEGIC PROMO: ${selectedProduct.name.toUpperCase()} DISKON ${discount || "0"}% HANYA UNTUK ${duration} JAM KE DEPAN! BURUAN SERBU!`;
      setCustomMessage(msg);
    }
  }, [selectedProduct, discount, duration, isAutoMessage]);

  // ==========================================
  // HANDLER: REFERRAL IDENTITY
  // ==========================================
  const handleUpdateReferral = async () => {
    if (!targetUserId) return toast.error("Pilih target user terlebih dahulu!");
    if (!referralInput) return toast.error("Masukkan kode referral!");

    setRefLoading(true);
    const selectedUser = allUsers.find(u => u.id === targetUserId);

    try {
      const response = await fetch(`https://694615d7ed253f51719d04d2.mockapi.io/users/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedUser,
          referralCode: referralInput.toUpperCase().trim()
        })
      });

      if (response.ok) {
        toast.success(`Referral ${referralInput.toUpperCase()} Berhasil Di-update!`);
        fetchUsers(); 
      }
    } catch (e) {
      toast.error("Gagal memperbarui identitas referral.");
    } finally {
      setRefLoading(false);
    }
  };

  // ==========================================
  // HANDLER: OPERASI PROMO GLOBAL
  // ==========================================
  const handleApplyPromo = async () => {
    if (!selectedProduct) return toast.error("Kesalahan: Pilih produk terlebih dahulu.");
    if (!discount || Number(discount) <= 0 || Number(discount) > 95) {
      return toast.error("Kesalahan: Diskon harus di antara 1-95%.");
    }

    setIsDeploying(true);
    const durationHours = parseInt(duration) || 1;
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    const discountPrice = Math.round(selectedProduct.originalPrice - (selectedProduct.originalPrice * (parseInt(discount) / 100)));

    try {
      await toast.promise(
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
          loading: "Deploying Campaign...",
          success: () => {
            setSelectedId("");
            setDiscount("");
            setIsDeploying(false);
            return "Kampanye Promo Berhasil Diaktivasi!";
          },
          error: (err) => {
            setIsDeploying(false);
            return "Gagal: " + err.message;
          },
        }
      );
    } catch (error) {
      setIsDeploying(false);
    }
  };

  const handleTerminatePromo = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    toast.promise(
      async () => {
        await updateProduct(productId, {
          price: product.originalPrice,
          discountPercent: 0,
          promoStart: "", 
          promoEnd: new Date().toISOString()
        });
      },
      { loading: "Terminating...", success: "Harga Normal!", error: "Gagal." }
    );
  };

  const handleTerminateAll = async () => {
    if (!window.confirm("Hentikan SEMUA promo aktif?")) return;
    toast.promise(
      async () => {
        const promises = activePromos.map(p => 
          updateProduct(p.id, {
            price: p.originalPrice,
            discountPercent: 0,
            promoStart: "", 
            promoEnd: new Date().toISOString()
          })
        );
        await Promise.all(promises);
      },
      { loading: "Memulihkan...", success: "Semua Sistem Normal!", error: "Gagal." }
    );
  };

  // ==========================================
  // HANDLER: OPERASI GIFT PERSONAL (WITH MESSAGE FIX)
  // ==========================================
  const handleSendGift = async () => {
    if (!targetUserId || !giftData.code || !giftData.discount || !giftData.validUntil) {
      return toast.error("Lengkapi parameter Gift.");
    }

    setGiftLoading(true);
    try {
      const payload = {
        code: giftData.code.toUpperCase(),
        discount: Number(giftData.discount),
        message: giftData.message || "Hadiah spesial untuk Anda!",
        validUntil: new Date(giftData.validUntil).toISOString(),
        isActive: true
      };

      const res = await sendPersonalPromo(targetUserId, payload);

      if (res.success) {
        toast.success(`Gift & Pesan berhasil dikirim ke ${allUsers.find(u => u.id === targetUserId)?.name}!`);
        setGiftData({ code: "", discount: "", message: "", validUntil: "" });
        setTargetUserId("");
        fetchUsers(); 
      } else {
        throw new Error(res.message);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setGiftLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-left max-w-7xl mx-auto font-sans p-4 md:p-6 pb-20">
      
      {/* 1. EXECUTIVE COMMAND HEADER */}
      <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl border border-slate-800 relative overflow-hidden text-left">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={20} className="text-amber-400 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-300/80">Market Strategy Authority</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Strategic <span className="text-indigo-500">Marketing</span>
          </h2>
        </div>
        <TrendingDown className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. MODUL KIRI: GLOBAL PRODUCT PROMO */}
        <Card className="lg:col-span-7 rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden text-left">
          <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-indigo-600" />
              <CardTitle className="text-xl font-black uppercase italic text-slate-900">Mass Deployment (Produk)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Target Unit</label>
              <Select onValueChange={setSelectedId} value={selectedId}>
                <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none font-black text-xs uppercase shadow-inner">
                  <SelectValue placeholder="SCAN DATABASE PRODUK..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id} className="py-4 px-4 uppercase font-black text-[11px]">
                      {p.name} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.originalPrice)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-center block w-full">Discount (%)</label>
                <Input type="number" className="h-16 rounded-2xl bg-slate-50 border-none font-black text-lg text-center" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase">Duration</label>
                <Select onValueChange={setDuration} value={duration}>
                  <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none font-black text-[11px] uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">01 JAM</SelectItem>
                    <SelectItem value="2">02 JAM</SelectItem>
                    <SelectItem value="24">24 JAM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleApplyPromo} disabled={!selectedId || !discount || isDeploying} className="w-full h-20 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl active:scale-95 gap-4">
              {isDeploying ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Deploy Strategic Promo</>}
            </Button>
          </CardContent>
        </Card>

        {/* 3. MODUL KANAN: USER-SPECIFIC (REFERRAL & GIFT) */}
        <div className="lg:col-span-5 space-y-8">
          
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden border-t-4 border-amber-400 text-left">
            <CardHeader className="p-8 border-b border-amber-50 bg-amber-50/20">
              <div className="flex items-center gap-3 text-amber-600">
                <Gift size={22} className="animate-bounce" />
                <CardTitle className="text-lg font-black uppercase italic">Personal Gift & Message</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <Select onValueChange={setTargetUserId} value={targetUserId}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-xs shadow-sm">
                  <SelectValue placeholder="PILIH CUSTOMER..." />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map(u => (
                    <SelectItem key={u.id} value={u.id} className="font-bold text-xs">{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Voucher Code</label>
                  <Input className="h-14 rounded-2xl bg-slate-50 border-none font-black text-xs uppercase" placeholder="PROMO20" value={giftData.code} onChange={(e) => setGiftData({...giftData, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Value (IDR)</label>
                  <Input type="number" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-xs" placeholder="50000" value={giftData.discount} onChange={(e) => setGiftData({...giftData, discount: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                  <MessageSquare size={14} className="text-amber-500" /> Personal Message for User
                </label>
                <Textarea 
                  placeholder="Contoh: Halo! Ini hadiah ulang tahun untuk Anda..." 
                  className="h-28 rounded-2xl bg-slate-50 border-none font-bold text-xs shadow-inner focus:ring-2 ring-amber-400"
                  value={giftData.message}
                  onChange={(e) => setGiftData({...giftData, message: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Limit Expired</label>
                <Input type="datetime-local" className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-xs" value={giftData.validUntil} onChange={(e) => setGiftData({...giftData, validUntil: e.target.value})} />
              </div>

              <Button onClick={handleSendGift} disabled={giftLoading} className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-[10px] shadow-lg active:scale-95 gap-3">
                {giftLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16} /> Deploy Gift & Message</>}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 overflow-hidden text-left border-t-4 border-indigo-500">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3 text-indigo-400">
                <Fingerprint size={22} />
                <CardTitle className="text-lg font-black uppercase italic">Referral Identity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="flex gap-2">
                <Input 
                  className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-black text-sm tracking-widest uppercase" 
                  placeholder="KODE REFERRAL" 
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                />
                <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white" onClick={() => setReferralInput(Math.random().toString(36).substring(2, 8).toUpperCase())}>
                  <RefreshCcw size={16} />
                </Button>
              </div>
              <Button onClick={handleUpdateReferral} disabled={refLoading || !targetUserId} className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] shadow-lg active:scale-95 disabled:opacity-50">
                {refLoading ? <Loader2 className="animate-spin" /> : "Update Referral Code"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. FOOTER: MONITORING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] bg-white p-8 shadow-xl text-left border-none">
            <CardTitle className="text-[11px] font-black uppercase flex items-center gap-2 mb-6 text-slate-900">
              <ListFilter size={16} className="text-indigo-600" /> Live Campaign Monitor
            </CardTitle>
            <div className="space-y-3">
              {activePromos.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-rose-50 transition-all">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-900">{p.name}</p>
                    <span className="text-[8px] font-black text-rose-500 uppercase bg-white px-2 py-0.5 rounded border border-rose-100 italic mt-1 inline-block">-{p.discountPercent}% OFF</span>
                  </div>
                  <Button size="sm" onClick={() => handleTerminatePromo(p.id)} className="h-9 rounded-xl bg-slate-950 text-[9px] font-black hover:bg-rose-600 px-4">STOP</Button>
                </div>
              ))}
              {activePromos.length === 0 && <p className="text-[10px] text-slate-400 italic">Tidak ada promo produk aktif.</p>}
            </div>
          </Card>

          {/* UPGRADE: MONITORING PROMO PERSONAL (CABUT PROMO) [cite: 2026-01-10] */}
          <Card className="rounded-[2.5rem] bg-white p-8 shadow-xl text-left border-none">
            <CardTitle className="text-[11px] font-black uppercase flex items-center gap-2 mb-6 text-amber-600">
              <Gift size={16} /> Active Personal Gifts
            </CardTitle>
            <div className="space-y-3">
              {allUsers.filter(u => u.personalPromo?.isActive).map(u => (
                <div key={u.id} className="flex justify-between items-center p-4 bg-amber-50/50 rounded-2xl border border-amber-100 group hover:bg-rose-50 transition-all">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-900">{u.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-100 uppercase">
                        CODE: {u.personalPromo.code}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 uppercase">
                        Exp: {new Date(u.personalPromo.validUntil).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      if(window.confirm(`Cabut promo milik ${u.name}?`)) {
                        deletePersonalPromo(u.id).then(res => {
                          if(res.success) {
                            toast.success("Promo berhasil dicabut.");
                            fetchUsers(); // Refresh list user lokal [cite: 2026-01-08]
                          }
                        });
                      }
                    }} 
                    className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-100 p-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              {allUsers.filter(u => u.personalPromo?.isActive).length === 0 && (
                <p className="text-[10px] text-slate-400 italic">Tidak ada promo personal aktif.</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="rounded-[2.5rem] bg-indigo-600 text-white p-8 shadow-xl relative overflow-hidden text-left border-none">
          <CardTitle className="text-[11px] font-black uppercase flex items-center gap-2 mb-6">
            <Eye size={16} className="text-indigo-200" /> Logic Impact Preview
          </CardTitle>
          <div className="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm">
            <p className="text-xs font-black italic leading-relaxed uppercase">"{customMessage || "Awaiting configuration..."}"</p>
          </div>
          <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
        </Card>
      </div>
    </div>
  );
}