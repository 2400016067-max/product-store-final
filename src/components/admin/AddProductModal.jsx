import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircle, Loader2 } from "lucide-react"; 
import { CATEGORIES } from "@/lib/constants";

export default function AddProductModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: "", 
    category: "", 
    price: "", 
    image: "", 
    description: "",
    isAvailable: true 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!formData.name || !formData.price || !formData.category) {
      alert("Mohon lengkapi Nama, Kategori, dan Harga!");
      return;
    }

    
    setIsLoading(true); 

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        isAvailable: formData.isAvailable === true || formData.isAvailable === "true"
      };

      
      const result = await onAdd(payload);
      
      if (result.success) {
        setOpen(false);
        setFormData({ 
          name: "", 
          category: "", 
          price: "", 
          image: "", 
          description: "", 
          isAvailable: true 
        });
      }
    } catch (error) {
      console.error("Error submit:", error);
    } finally {
      
      setIsLoading(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex gap-2 items-center transition-all active:scale-95">
          <PlusCircle size={18} />
          Tambah Produk
        </Button>
      </DialogTrigger>
      
      
      <DialogContent 
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tambah Produk Baru</DialogTitle>
          <DialogDescription className="sr-only">
            Silakan isi formulir di bawah ini untuk menambahkan produk baru.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</label>
            <Input 
              placeholder="Contoh: Sony WH-1000XM5" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                disabled={isLoading} 
              >
                <option value="" disabled>Pilih Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
                disabled={isLoading}
              />
            </div>
          </div>

          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Stok</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.isAvailable}
              onChange={(e) => setFormData({...formData, isAvailable: e.target.value === "true"})}
              disabled={isLoading} 
            >
              <option value="true">✅ Tersedia (Ready Stock)</option>
              <option value="false">❌ Habis (Out of Stock)</option>
            </select>
          </div>

          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Gambar</label>
            <Input 
              placeholder="https://images.unsplash.com/..." 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              required 
              disabled={isLoading} 
            />
          </div>

          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</label>
            <Input 
              placeholder="Jelaskan fitur utama produk..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              disabled={isLoading}
            />
          </div>

          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold mt-4 transition-all active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Ikon Muter */}
                MENYIMPAN...
              </>
            ) : (
              "SIMPAN KE DATABASE"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}