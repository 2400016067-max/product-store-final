import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddProductModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  
  // State awal form
  const [formData, setFormData] = useState({
    name: "", 
    category: "", 
    price: "", 
    image: "", 
    description: "",
    isAvailable: true // Default stok tersedia
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi & Konversi Data
    const payload = {
      ...formData,
      price: Number(formData.price), // Pastikan harga jadi angka
      isAvailable: formData.isAvailable === true || formData.isAvailable === "true" // Pastikan boolean
    };

    const result = await onAdd(payload);
    
    if (result.success) {
      setOpen(false);
      // Reset form setelah sukses
      setFormData({ name: "", category: "", price: "", image: "", description: "", isAvailable: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
          + Tambah Produk
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tambah Produk Baru</DialogTitle>
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

          {/* 4. Status Stok (FITUR BARU) [cite: 2025-09-29] */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Stok</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* 6. Deskripsi (YANG HILANG SEBELUMNYA) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</label>
            <Input 
              placeholder="Jelaskan fitur utama produk..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <Button type="submit" className="w-full bg-slate-900 font-bold mt-4">
            SIMPAN KE DATABASE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}