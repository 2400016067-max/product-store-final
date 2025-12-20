import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditProductModal from "./EditProductModal"; // Import modal edit yang sudah dibuat [cite: 2025-09-29]

export default function ProductTable({ products, onDelete, onUpdate }) {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[300px]">Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                Belum ada data produk di database MockAPI. [cite: 2025-12-13]
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-slate-700">
                  Rp {product.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {/* Panggil Modal Edit dengan membawa data produk spesifik [cite: 2025-09-29] */}
                  <EditProductModal product={product} onUpdate={onUpdate} />
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => onDelete(product.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}