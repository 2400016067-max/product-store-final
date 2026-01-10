import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
// IMPORT KOMPONEN PROMO
import PromoSection from "./PromoSection"; 
import { 
  ShoppingBag, Trash2, Plus, Minus, MessageCircle, 
  ShoppingCart, ArrowRight, ShieldCheck, X, Trash,
  CheckCircle2, PartyPopper, ArrowLeft, Copy, Check, Ticket, Loader2
} from "lucide-react";
import {
  Sheet, SheetContent, SheetTitle, SheetDescription,
  SheetTrigger, SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Pastikan sonner terinstal untuk feedback

export default function CartModal() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UPGRADE: Ambil redeemPersonalPromo dari AuthContext [cite: 2026-01-10]
  const { isAuthenticated, user, redeemPersonalPromo } = useAuth();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // State loading checkout
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const { 
    cart, removeFromCart, updateQuantity, 
    totalPrice, totalItems, clearCart 
  } = useCart();

  const finalPrice = totalPrice - appliedDiscount;

  const generateOrderId = () => {
    const date = new Date();
    const segment1 = date.getTime().toString().slice(-4);
    const segment2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORDER-${segment1}-${segment2}`;
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================
  // LOGIKA CHECKOUT DENGAN EKSEKUSI REDEEM PROMO [cite: 2026-01-10]
  // ============================================================
  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Silakan login untuk memproses pesanan.");
      navigate("/login", { state: { from: location } }); 
      return;
    }

    setIsProcessing(true);
    const newId = generateOrderId();
    setOrderId(newId);
    const phoneNumber = "6282220947302"; 
    
    // 1. Konstruksi Pesan WA
    let messageWA = `*KONFIRMASI PESANAN - ${newId}*\n`;
    messageWA += `------------------------------------------\n`;
    messageWA += `👤 *DATA PELANGGAN*\n`;
    messageWA += `Nama : ${user.name.toUpperCase()}\n`;
    messageWA += `------------------------------------------\n\n`;
    
    messageWA += `🛒 *ITEM*\n`;
    cart.forEach((item, index) => {
      messageWA += `${index + 1}. ${item.name.toUpperCase()} (x${item.quantity})\n`;
    });
    
    messageWA += `\n💰 *PEMBAYARAN*\n`;
    messageWA += `Subtotal : Rp ${totalPrice.toLocaleString("id-ID")}\n`;
    
    if (appliedDiscount > 0) {
      messageWA += `Promo    : - Rp ${appliedDiscount.toLocaleString("id-ID")}\n`;
      messageWA += `Kode     : ${user.personalPromo?.code}\n`;
    }
    
    messageWA += `*TOTAL    : Rp ${finalPrice.toLocaleString("id-ID")}*\n`;
    messageWA += `------------------------------------------\n\n`;
    messageWA += `Halo Admin, saya ingin konfirmasi pesanan ini.`;

    try {
      // 2. LOGIKA KRITIS: HANGUSKAN PROMO JIKA DIGUNAKAN [cite: 2026-01-10]
      if (appliedDiscount > 0) {
        console.log("Sistem mendeteksi penggunaan promo. Menjalankan proses redeem...");
        const redeemResult = await redeemPersonalPromo();
        if (!redeemResult.success) {
          throw new Error("Gagal melakukan verifikasi kode promo.");
        }
      }

      // 3. Buka WhatsApp
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageWA)}`, "_blank");
      
      // 4. Update UI Sukses
      setIsSuccess(true);
      // clearCart(); // Aktifkan jika ingin keranjang kosong setelah klik checkout
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setTimeout(() => {
        setIsSuccess(false);
        setAppliedDiscount(0);
      }, 400);
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-indigo-50 text-indigo-600 transition-all group">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 shadow-2xl bg-white sm:rounded-l-[3rem] overflow-hidden">
        
        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
             <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-100 blur-3xl rounded-full opacity-60 animate-pulse"></div>
                <div className="relative bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-2xl rotate-3">
                  <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-4 -right-4 bg-amber-400 p-3 rounded-2xl animate-bounce shadow-lg">
                  <PartyPopper size={24} className="text-white" />
                </div>
             </div>
             
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">Order <span className="text-emerald-500">Sent!</span></h2>
             
             <div onClick={() => handleCopyId(orderId)} className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 mb-8 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors group">
                <span className="text-[10px] font-black text-slate-400 uppercase">ID: {orderId}</span>
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-300 group-hover:text-indigo-600" />}
             </div>

             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed mb-12 max-w-[260px]">
                Pesanan diteruskan ke WhatsApp Admin. Promo otomatis dinonaktifkan setelah penggunaan ini.
             </p>

             <div className="w-full space-y-4 px-4">
                <SheetClose asChild>
                  <Button className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                    Continue Shopping
                  </Button>
                </SheetClose>
                <Button variant="ghost" onClick={() => setIsSuccess(false)} className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 gap-2">
                  <ArrowLeft size={14} /> Back to Cart
                </Button>
             </div>
          </div>
        ) : (
          <>
            <div className="p-6 md:p-8 border-b bg-white flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-white rounded-xl rotate-3 shadow-lg"><ShoppingBag size={18} /></div>
                <div>
                  <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Review Cart</SheetTitle>
                  <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{totalItems} Units</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100"><X size={20} strokeWidth={3} /></Button>
              </SheetClose>
            </div>

            <SheetDescription className="sr-only">Daftar item belanja dalam keranjang.</SheetDescription>

            <ScrollArea className="flex-1 px-6 md:px-8">
              {cart.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <ShoppingCart size={48} className="text-slate-100 mb-4" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Inventory Empty</h3>
                </div>
              ) : (
                <div className="py-8 space-y-10">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-5 group items-start animate-in fade-in slide-in-from-right-5 duration-500">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] border border-slate-50 shadow-sm">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-black text-slate-900 text-[12px] uppercase truncate">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <p className="text-[11px] font-black text-indigo-600 italic">Rp {item.price.toLocaleString("id-ID")}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-900 text-white rounded-xl px-3 py-1.5 shadow-md">
                            <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="disabled:opacity-30"><Minus size={11} strokeWidth={4} /></button>
                            <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={11} strokeWidth={4} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 pb-8 border-t border-dashed border-slate-100">
                     <PromoSection onApply={(discountValue) => setAppliedDiscount(discountValue)} />
                  </div>
                </div>
              )}
            </ScrollArea>

            {cart.length > 0 && (
              <div className="p-6 md:p-8 bg-white border-t border-slate-50 flex flex-col gap-6 sticky bottom-0 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.04)]">
                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    <span>Subtotal</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                      <span className="flex items-center gap-1"><Ticket size={10}/> Diskon Promo</span>
                      <span>- Rp {appliedDiscount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Total</span>
                    <div className="flex items-center gap-2 mt-2">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-slate-900 uppercase">Verified</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">
                      Rp {finalPrice.toLocaleString("id-ID")}
                    </h3>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full h-16 rounded-[1.8rem] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-between px-8 group active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center w-full gap-3">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Verifying Promo...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <MessageCircle size={22} fill="currentColor" className="group-hover:animate-bounce" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Confirm & Checkout</span>
                      </div>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}