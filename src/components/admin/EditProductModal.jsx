import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProductModal({ product, onUpdate }) {
  const [open, setOpen] = useState(false);
  // Inisialisasi state dengan data produk yang sudah ada [cite: 2025-12-13]
  const [formData, setFormData] = useState({ ...product });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onUpdate(product.id, { ...formData, price: Number(formData.price) });
    if (result.success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Produk: {product.name}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Kategori" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          <Input type="number" placeholder="Harga" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <Input placeholder="URL Gambar" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Simpan Perubahan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}