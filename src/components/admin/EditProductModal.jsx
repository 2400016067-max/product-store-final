import { useState, useEffect } from "react";
// PERBAIKAN: Menambahkan DialogDescription ke dalam import
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
import { Pencil } from "lucide-react"; 

export default function EditProductModal({ product, onUpdate }) {
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", 
    category: "", 
    price: "", 
    image: "", 
    description: "",
    isAvailable: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        image: product.image || "",
        description: product.description || "",
        isAvailable: product.isAvailable 
      });
    }
  }, [product, open]); // Menambahkan 'open' agar data reset setiap modal dibuka

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      price: Number(formData.price),
      isAvailable: formData.isAvailable === true || formData.isAvailable === "true"
    };

    const result = await onUpdate(product.id, updatedData);
    
    if (result.success) {
      setOpen(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-amber-200 hover:bg-amber-50 text-amber-600">
          <Pencil size={14} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Pencil size={18} className="text-amber-600" /> 
            Edit Produk
          </DialogTitle>
          
          {/* PERBAIKAN UTAMA: Menambahkan deskripsi aksesibilitas */}
          {/* sr-only membuat teks ini hanya terbaca oleh screen reader, tidak muncul di UI */}
          <DialogDescription className="sr-only">
            Perbarui detail produk ID: {product?.id}. Pastikan semua informasi sudah benar sebelum menyimpan.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp)</label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Gambar</label>
            <Input 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</label>
            <Input 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all active:scale-95">
              SIMPAN PERUBAHAN
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}