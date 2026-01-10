import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ShoppingBag, Trash2, Plus, Minus, MessageCircle, 
  ShoppingCart, ArrowRight, ShieldCheck, X, Trash,
  CheckCircle2, PartyPopper, ArrowLeft, Copy, Check
} from "lucide-react";
import {
  Sheet, SheetContent, SheetTitle, SheetDescription,
  SheetTrigger, SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CartModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // STATE MANAGEMENT
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);

  const { 
    cart, removeFromCart, updateQuantity, 
    totalPrice, totalItems, clearCart 
  } = useCart();

  // 1. GENERATOR ID TRANSAKSI STRATEGIS
  const generateOrderId = () => {
    const date = new Date();
    const segment1 = date.getTime().toString().slice(-4);
    const segment2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORDER-${segment1}-${segment2}`;
  };

  // 2. LOGIKA COPY ID KE CLIPBOARD
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3. LOGIKA CHECKOUT INTEGRASI WHATSAPP
  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Silakan login untuk verifikasi pesanan.");
      navigate("/login", { state: { from: location } }); 
      return;
    }

    const newId = generateOrderId();
    setOrderId(newId);
    const phoneNumber = "6282220947302"; 
    
    let message = `*KONFIRMASI PESANAN - ${newId}*\n`;
    message += `------------------------------------------\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name.toUpperCase()}*\n`;
      message += `   Qty: ${item.quantity} Unit | Rp ${item.price.toLocaleString("id-ID")}\n`;
      message += `   Subtotal: Rp ${subtotal.toLocaleString("id-ID")}\n\n`;
    });
    message += `------------------------------------------\n`;
    message += `*TOTAL PEMBAYARAN: Rp ${totalPrice.toLocaleString("id-ID")}*\n`;
    message += `------------------------------------------\n\n`;
    message += `Halo Admin, saya ingin memproses pesanan dengan ID: ${newId}.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    
    setTimeout(() => {
      setIsSuccess(true);
      // clearCart(); // Aktifkan jika ingin mengosongkan keranjang otomatis
    }, 600);
  }, [cart, totalPrice, isAuthenticated, navigate, location]);

  const handleOpenChange = (open) => {
    if (!open) setTimeout(() => setIsSuccess(false), 400);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-indigo-50 text-indigo-600 transition-all active:scale-95 group shadow-none">
          <ShoppingCart className="group-hover:rotate-12 transition-transform" size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in shadow-md">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 shadow-2xl bg-white sm:rounded-l-[3rem] overflow-hidden">
        
        {isSuccess ? (
          /* ================= SUCCESS UI ================= */
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
             
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-2">Order <span className="text-emerald-500">Sent!</span></h2>
             
             <div 
               onClick={() => handleCopyId(orderId)}
               className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 mb-8 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors group"
             >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {orderId}</span>
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-300 group-hover:text-indigo-600" />}
             </div>

             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed mb-12 max-w-[260px]">
               Pesanan diteruskan ke WhatsApp Admin. Mohon tunggu verifikasi selanjutnya.
             </p>

             <div className="w-full space-y-4">
                <SheetClose asChild>
                  <Button className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                    Continue Shopping
                  </Button>
                </SheetClose>
                <Button variant="ghost" onClick={() => setIsSuccess(false)} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 gap-2">
                  <ArrowLeft size={14} /> Back to Cart
                </Button>
             </div>
          </div>
        ) : (
          /* ================= CART UI ================= */
          <>
            <div className="p-6 md:p-8 border-b bg-white flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-white rounded-xl rotate-3 shadow-lg"><ShoppingBag size={18} /></div>
                <div>
                  <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Review Cart</SheetTitle>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">{totalItems} Units Syncing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={() => confirm("Kosongkan keranjang?") && clearCart()} className="text-slate-300 hover:text-rose-600 transition-colors">
                    <Trash size={18} />
                  </Button>
                )}
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100"><X size={20} strokeWidth={3} /></Button>
                </SheetClose>
              </div>
            </div>

            <SheetDescription className="sr-only">Daftar item belanja dalam keranjang.</SheetDescription>

            <ScrollArea className="flex-1 px-6 md:px-8">
              {cart.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-50 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                    <ShoppingCart size={48} className="text-slate-100 relative" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Inventory Empty</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Pilih unit terbaik untuk Anda.</p>
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
                          <h4 className="font-black text-slate-900 text-[12px] uppercase tracking-tight leading-tight italic truncate">{item.name}</h4>
                          
                          {/* TOMBOL HAPUS PER ITEM (TRASH2) */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <p className="text-[11px] font-black text-indigo-600 italic">Rp {item.price.toLocaleString("id-ID")}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Sub: Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-slate-900 text-white rounded-xl px-3 py-1.5 shadow-md">
                            <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="hover:text-indigo-400 disabled:opacity-30 transition-all"><Minus size={11} strokeWidth={4} /></button>
                            <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-indigo-400 transition-all"><Plus size={11} strokeWidth={4} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {cart.length > 0 && (
              <div className="p-6 md:p-8 bg-white border-t border-slate-50 flex flex-col gap-6 sticky bottom-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Investment Total</span>
                    <div className="flex items-center gap-2 mt-2">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-slate-900 uppercase">Secure Verification</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Rp {totalPrice.toLocaleString("id-ID")}</h3>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100 transition-all flex items-center justify-between px-8 group border-none active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={22} fill="currentColor" className="group-hover:animate-bounce shrink-0 text-white/90" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Checkout via WhatsApp</span>
                  </div>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}