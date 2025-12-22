import React from "react";
import { useCart } from "../../contexts/CartContext";
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
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CartModal() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    totalItems,
    generateWAMessage 
  } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="fixed bottom-1 right-1 h-16 w-16 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 transition-all active:scale-90 z-50 group border-4 border-white"
        >
          <ShoppingCart className="text-white group-hover:rotate-12 transition-transform" size={28} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* 1. PERUBAHAN UTAMA: Lebar Sheet dinaikkan ke sm:max-w-xl (sekitar 576px) atau md:w-[500px] */}
      <SheetContent className="w-full sm:max-w-xl md:w-[550px] flex flex-col p-0 border-l-0 shadow-2xl rounded-l-[2rem]">
        <SheetHeader className="p-8 border-b bg-white rounded-tl-[2rem]">
          <SheetTitle className="flex items-center gap-4 text-xl font-black text-slate-900 uppercase tracking-tight">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            Keranjang Belanja
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-8">
          {cart.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-6">
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
                  {/* 2. UKURAN GAMBAR: Diperbesar dari h-20 ke h-28 agar seimbang dengan lebar card */}
                  <div className="h-28 w-28 rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-slate-900 text-base leading-snug uppercase tracking-tight">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-blue-600 font-black text-lg">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      
                      {/* 3. KONTROL QUANTITY: Dibuat lebih besar dan tactile */}
                      <div className="flex items-center gap-4 bg-slate-100 rounded-xl px-4 py-2 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-slate-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="text-base font-black w-6 text-center text-slate-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* 4. FOOTER LEBIH LEBAR DAN TEGAS */}
        {cart.length > 0 && (
          <SheetFooter className="p-8 bg-slate-50/50 border-t flex-col gap-6">
            <div className="space-y-4 w-full">
              <div className="flex justify-between text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                <span>Ringkasan Pesanan</span>
                <span>{totalItems} Item</span>
              </div>
              <Separator className="bg-slate-200" />
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-extrabold text-sm uppercase">Total Bayar</span>
                <span className="text-3xl font-black text-blue-600 tracking-tighter">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button 
                asChild 
                className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-100 transition-all active:scale-95 border-b-4 border-green-800"
              >
                <a 
                  href={generateWAMessage()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-base font-black"
                >
                  <MessageCircle size={24} fill="currentColor" />
                  KIRIM KE WHATSAPP
                </a>
              </Button>
              <p className="text-[11px] text-center text-slate-400 font-bold uppercase tracking-wider">
                🔒 Checkout Aman & Cepat via WhatsApp
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}