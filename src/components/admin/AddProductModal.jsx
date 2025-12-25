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
import { PlusCircle } from "lucide-react";
// 1. IMPORT KONSTANTA KATEGORI
import { CATEGORIES } from "@/lib/constants";

export default function AddProductModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", 
    category: "", // Akan diisi melalui select
    price: "", 
    image: "", 
    description: "",
    isAvailable: true 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex gap-2 items-center transition-all active:scale-95">
          <PlusCircle size={18} />
          Tambah Produk
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tambah Produk Baru</DialogTitle>
          <DialogDescription className="sr-only">
            Silakan isi formulir di bawah ini untuk menambahkan produk baru ke dalam katalog sistem informasi toko Anda.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nama Produk */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</label>
            <Input 
              placeholder="Contoh: Sony WH-1000XM5" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 2. PERUBAHAN: DARI INPUT KE SELECT KATEGORI */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="" disabled>Pilih Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Harga */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Status Stok */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Stok</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.isAvailable}
              onChange={(e) => setFormData({...formData, isAvailable: e.target.value === "true"})}
            >
              <option value="true">✅ Tersedia (Ready Stock)</option>
              <option value="false">❌ Habis (Out of Stock)</option>
            </select>
          </div>

          {/* URL Gambar */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Gambar</label>
            <Input 
              placeholder="https://images.unsplash.com/..." 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              required 
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</label>
            <Input 
              placeholder="Jelaskan fitur utama produk..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold mt-4 transition-all active:scale-95 shadow-xl">
            SIMPAN KE DATABASE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}