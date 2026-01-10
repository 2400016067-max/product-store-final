import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  X 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CartModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    totalItems 
  } = useCart();

  // LOGIKA CHECKOUT: Transmisi data ke WhatsApp dengan rincian promo [cite: 2026-01-10]
  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Silakan login sebagai Viewer untuk verifikasi pesanan.");
      navigate("/login", { state: { from: location } }); 
      return;
    }

    const phoneNumber = "6282220947302"; 
    let message = `*KONFIRMASI PESANAN (CHECKOUT)*\n`;
    message += `--------------------------------\n\n`;

    cart.forEach((item, index) => {
      const isPromo = item.discountPercent > 0;
      const subtotal = item.price * item.quantity;
      
      message += `${index + 1}. *${item.name.toUpperCase()}*\n`;
      message += `   Jumlah: ${item.quantity} unit\n`;
      message += `   Harga: Rp ${item.price.toLocaleString("id-ID")}\n`;
      if (isPromo) message += `   _Status: Strategic Promo ${item.discountPercent}% Off_\n`;
      message += `   Subtotal: Rp ${subtotal.toLocaleString("id-ID")}\n\n`;
    });

    message += `--------------------------------\n`;
    message += `*TOTAL BAYAR: Rp ${totalPrice.toLocaleString("id-ID")}*\n`;
    message += `--------------------------------\n\n`;
    message += `Halo Admin, saya sudah memilih produk di atas. Mohon info pembayaran. Terima kasih!`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Tombol Keranjang di Header dengan Animasi Zoom Notifikasi [cite: 2026-01-10] */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-xl hover:bg-indigo-50 text-indigo-600 transition-all active:scale-95 group shadow-none"
        >
          <ShoppingCart className="group-hover:rotate-12 transition-transform" size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in shadow-sm">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 shadow-2xl bg-white sm:rounded-l-[2.5rem]">
        
        {/* HEADER MODER: Tombol Close (X) di Pojok Kanan Atas [cite: 2026-01-10] */}
        <div className="p-6 md:p-8 border-b bg-white rounded-tl-[2.5rem] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl rotate-3 shadow-lg shrink-0">
              <ShoppingBag size={18} />
            </div>
            <div className="text-left">
              <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">My Cart</SheetTitle>
              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">{totalItems} Items Ready</p>
            </div>
          </div>
          
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
              <X size={20} strokeWidth={3} />
              <span className="sr-only">Close Cart</span>
            </Button>
          </SheetClose>
        </div>

        <SheetDescription className="sr-only">Rincian produk di dalam keranjang belanja.</SheetDescription>

        <ScrollArea className="flex-1 px-4 md:px-8">
          {cart.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                <div className="relative p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <ShoppingCart size={40} className="text-slate-200" />
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight italic">Keranjang Kosong</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-[160px] leading-relaxed">
                Unit belum teridentifikasi. Silakan pilih produk terbaik Anda.
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-8">
              {cart.map((item) => {
                const isPromo = item.discountPercent > 0;
                return (
                  <div key={item.id} className="flex gap-4 group items-start animate-in fade-in slide-in-from-right-5 duration-500">
                    <div className="relative h-20 w-20 shrink-0">
                      <div className="absolute -inset-1 bg-slate-100 rounded-2xl scale-95 group-hover:scale-105 transition-transform duration-300"></div>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="relative h-full w-full object-cover rounded-2xl shadow-sm border border-white" 
                      />
                      {isPromo && (
                        <div className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-lg shadow-lg z-10">
                          -{item.discountPercent}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2 text-left">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-tight leading-tight italic truncate max-w-[160px]">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          {isPromo && (
                            <span className="text-[9px] text-slate-400 line-through font-bold">
                              Rp {item.originalPrice?.toLocaleString("id-ID")}
                            </span>
                          )}
                          <p className={cn("font-black text-xs italic", isPromo ? "text-rose-600" : "text-indigo-600")}>
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-slate-900 text-white rounded-lg px-2.5 py-1 shadow-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="hover:text-indigo-400 disabled:opacity-30 transition-all active:scale-125"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={10} strokeWidth={4} />
                          </button>
                          <span className="text-[10px] font-black w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="hover:text-indigo-400 transition-all active:scale-125"
                          >
                            <Plus size={10} strokeWidth={4} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* POLES ULANG FOOTER: Desain Checkout yang Ramah Mobile & Mewah [cite: 2026-01-10] */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col gap-5 sticky bottom-0 z-20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Estimated Total</span>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={12} className="text-indigo-600" />
                   <span className="text-[8px] font-bold text-indigo-600 uppercase">Strategic Verification Active</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </h3>
              </div>
            </div>

            <Button 
              onClick={handleCheckout} 
              className="w-full h-14 md:h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-[0_15px_30px_rgba(22,163,74,0.2)] transition-all active:scale-95 flex items-center justify-between px-6 md:px-8 group border-none"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} fill="currentColor" className="group-hover:animate-bounce shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy via WhatsApp</span>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}