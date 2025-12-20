import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const { getProductById, loading, error } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => setProduct(data));
  }, [id]);

  if (loading) return <div className="text-center py-20">Memuat detail produk...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">Produk tidak ditemukan.</div>;

  return (
    <div className="grid md:grid-cols-2 gap-10 py-10">
      <img src={product.image} alt={product.name} className="rounded-xl shadow-lg w-full object-cover h-[400px]" />
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-primary font-bold text-2xl mt-2">Rp {product.price.toLocaleString("id-ID")}</p>
        </div>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        <div className="pt-6 space-x-4">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">Beli via WhatsApp</Button>
          <Link to="/"><Button variant="outline" size="lg">Kembali</Button></Link>
        </div>
      </div>
    </div>
  );
}