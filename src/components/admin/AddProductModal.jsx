import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddProductModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", image: "", description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Konversi harga ke number sebelum dikirim [cite: 2025-09-29]
    const result = await onAdd({ ...formData, price: Number(formData.price), isAvailable: true });
    if (result.success) {
      setOpen(false);
      setFormData({ name: "", category: "", price: "", image: "", description: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">+ Tambah Produk</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tambah Produk Baru</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Produk" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Kategori" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          <Input type="number" placeholder="Harga" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <Input placeholder="URL Gambar (Unsplash)" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
          <Button type="submit" className="w-full">Simpan ke Database</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}