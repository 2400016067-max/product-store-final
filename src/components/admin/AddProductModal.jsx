import { useState } from "react";
// PERBAIKAN: Tambahkan DialogDescription ke dalam import
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

export default function AddProductModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  
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
          
          {/* PERBAIKAN: Menambahkan deskripsi untuk aksesibilitas & menghilangkan warning console */}
          <DialogDescription className="sr-only">
            Silakan isi formulir di bawah ini untuk menambahkan produk baru ke dalam katalog sistem informasi toko Anda. [cite: 2025-09-29]
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* 1. Nama Produk */}
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
             {/* 2. Kategori */}
             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <Input 
                placeholder="Elektronik" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                required 
              />
            </div>

            {/* 3. Harga */}
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

          {/* 4. Status Stok */}
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

          {/* 5. URL Gambar */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Gambar</label>
            <Input 
              placeholder="https://images.unsplash.com/..." 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              required 
            />
          </div>

          {/* 6. Deskripsi */}
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