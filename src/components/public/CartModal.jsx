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
  ArrowRight
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Anda harus login sebagai Viewer untuk melakukan pemesanan agar status paket dapat dipantau.");
      navigate("/login", { state: { from: location } }); 
      return;
    }

    const phoneNumber = "6282220947302"; 
    let message = `*KONFIRMASI PESANAN (CHECKOUT)*\n`;
    message += `--------------------------------\n\n`;

    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Jumlah: ${item.quantity}x\n`;
      message += `   Harga: Rp ${item.price.toLocaleString("id-ID")}\n`;
      message += `   Subtotal: Rp ${subtotal.toLocaleString("id-ID")}\n\n`;
    });

    message += `--------------------------------\n`;
    message += `*TOTAL BAYAR: Rp ${totalPrice.toLocaleString("id-ID")}*\n`;
    message += `--------------------------------\n\n`;
    message += `Halo Admin, saya sudah memilih produk di atas. Mohon info detail pembayaran dan pengirimannya. Terima kasih!`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* INTERACTION DESIGN: Efek hover rotate & active scale untuk feedback mikro yang responsif */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-xl hover:bg-blue-50 text-blue-600 transition-all active:scale-95 group shadow-none"
        >
          <ShoppingCart className="group-hover:rotate-12 transition-transform" size={22} />
          {/* BADGE DESIGN: Animasi zoom-in & font-black agar angka notifikasi terlihat kontras */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in shadow-sm">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* MODERN RADIUS: Penggunaan rounded-l-[2.5rem] memberikan kesan "Soft Frame" yang mewah */}
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 shadow-2xl bg-white sm:rounded-l-[2.5rem]">
        
        {/* HEADER SECTION: Bold Typography (font-black, uppercase, italic) untuk identitas brand yang kuat */}
        <SheetHeader className="p-8 border-b bg-white rounded-tl-[2.5rem] sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
              {/* PILL ICON: Rotasi 3 derajat memberikan kesan dinamis dan tidak kaku */}
              <div className="p-2.5 bg-slate-900 text-white rounded-xl rotate-3">
                <ShoppingBag size={20} />
              </div>
              My Cart
            </SheetTitle>
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
              {totalItems} Items
            </span>
          </div>
          <SheetDescription className="sr-only">
            Kelola daftar produk pilihan Anda.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-8">
          {cart.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              {/* VISUAL DEPTH: Efek blur-3xl di belakang ikon menciptakan kedalaman visual (Depth) */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                <div className="relative p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <ShoppingCart size={48} className="text-slate-200" />
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Keranjang Kosong</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-[180px] leading-relaxed">
                Temukan produk terbaik dan masukkan ke sini!
              </p>
            </div>
          ) : (
            <div className="py-8 space-y-10">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-5 group items-start animate-in fade-in slide-in-from-right-5 duration-500">
                  {/* MODERN IMAGE PILL: Container gambar dengan rounded-2xl & efek scale saat hover */}
                  <div className="relative h-24 w-24 shrink-0">
                    <div className="absolute -inset-1 bg-slate-100 rounded-2xl scale-95 group-hover:scale-105 transition-transform duration-300"></div>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="relative h-full w-full object-cover rounded-2xl shadow-sm border border-white" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight leading-tight max-w-[140px]">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price</p>
                        <p className="text-blue-600 font-black text-sm italic">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      
                      {/* DARK PILL CONTROL: Kontras tinggi menggunakan bg-slate-900 untuk elemen interaktif */}
                      <div className="flex items-center gap-4 bg-slate-900 text-white rounded-xl px-3 py-1.5 shadow-lg shadow-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="hover:text-blue-400 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} strokeWidth={4} />
                        </button>
                        <span className="text-xs font-black min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="hover:text-blue-400 transition-colors"
                        >
                          <Plus size={12} strokeWidth={4} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* FOOTER SUMMARY: Penggunaan rounded-[2rem] & bg-slate-50 memisahkan area total dengan jelas (Sectioning) */}
        {cart.length > 0 && (
          <SheetFooter className="p-8 bg-white border-t-2 border-slate-50 flex-col gap-6 sticky bottom-0">
            <div className="space-y-4 w-full bg-slate-50 p-6 rounded-[2rem]">
              <div className="flex justify-between items-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <span>Order Summary</span>
                <span>Subtotal</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-900 font-black text-sm uppercase tracking-tighter italic">Total Amount</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* CHECKOUT BUTTON: High-contrast green dengan shadow lembut untuk Call to Action (CTA) utama */}
            <Button 
              onClick={handleCheckout} 
              className="w-full h-16 rounded-[1.5rem] bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-between px-8 group border-none"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} fill="currentColor" className="group-hover:animate-bounce" />
                <span className="text-xs font-black uppercase tracking-[0.1em]">Checkout via WhatsApp</span>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}