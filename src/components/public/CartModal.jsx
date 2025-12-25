import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Tambahkan ini
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext"; // Tambahkan ini
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ShoppingCart
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
  const { isAuthenticated } = useAuth(); // Ambil status login [cite: 2025-12-13]
  
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    totalItems,
    generateWAMessage 
  } = useCart();

  // FUNGSI PROTEKSI CHECKOUT [cite: 2025-09-29, 2025-12-13]
  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Otoritas Terbatas: Anda harus login sebagai Viewer untuk melakukan pemesanan agar status paket dapat dipantau.");
      // Simpan lokasi saat ini agar setelah login bisa balik lagi ke sini (Opsional untuk Modal)
      navigate("/login", { state: { from: location } }); 
      return;
    }
    // Jika sudah login, baru buka WhatsApp
    window.open(generateWAMessage(), "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-xl hover:bg-blue-50 text-blue-600 transition-all active:scale-95 group"
        >
          <ShoppingCart className="group-hover:rotate-12 transition-transform" size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in shadow-sm">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-xl md:w-[500px] flex flex-col p-0 border-l-0 shadow-2xl rounded-l-[2rem]">
        <SheetHeader className="p-8 border-b bg-white rounded-tl-[2rem]">
          <SheetTitle className="flex items-center gap-4 text-xl font-black text-slate-900 uppercase tracking-tight">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            Keranjang Belanja
          </SheetTitle>
          
          <SheetDescription className="sr-only">
            Kelola daftar produk pilihan Anda sebelum melanjutkan ke pembayaran via WhatsApp. [cite: 2025-09-29]
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-8">
          {cart.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 bg-slate-50 rounded-full">
                <ShoppingCart size={60} className="text-slate-200" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-lg">Keranjang Kosong</p>
                <p className="text-slate-400 text-sm italic">Belum ada produk yang kamu pilih.</p>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 group items-center animate-in fade-in slide-in-from-right-4">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug uppercase tracking-tight">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-blue-600 font-black text-base">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      
                      <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-slate-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="text-sm font-black w-4 text-center text-slate-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="p-8 bg-slate-50/50 border-t flex-col gap-6">
            <div className="space-y-4 w-full">
              <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Ringkasan Pesanan</span>
                <span>{totalItems} Item</span>
              </div>
              <Separator className="bg-slate-200" />
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-black text-xs uppercase tracking-tighter">Total Bayar</span>
                <span className="text-2xl font-black text-blue-600 tracking-tighter">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {/* TOMBOL UPGRADE: Menggunakan onClick untuk validasi auth [cite: 2025-12-13] */}
              <Button 
                onClick={handleCheckout} 
                className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-100 transition-all active:scale-95 border-b-4 border-green-800 flex items-center justify-center gap-3 text-sm font-black"
              >
                <MessageCircle size={20} fill="currentColor" />
                KIRIM KE WHATSAPP
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}