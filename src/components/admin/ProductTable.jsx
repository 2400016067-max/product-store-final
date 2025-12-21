import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Pastikan sudah install badge: npx shadcn@latest add badge
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"; // Import Ikon
import EditProductModal from "./EditProductModal"; 

export default function ProductTable({ products, onDelete, onUpdate }) {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[250px]">Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead className="text-center">Status Stok</TableHead> {/* Kolom Baru */}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              {/* colSpan jadi 5 karena kolom bertambah */}
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                Belum ada data produk di database MockAPI. [cite: 2025-12-13]
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                {/* 1. Nama Produk */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-slate-900">{product.name}</span>
                  </div>
                </TableCell>

                {/* 2. Kategori */}
                <TableCell>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600 border border-slate-200">
                    {product.category}
                  </span>
                </TableCell>

                {/* 3. Harga */}
                <TableCell className="font-semibold text-slate-700">
                  Rp {product.price?.toLocaleString("id-ID")}
                </TableCell>

                {/* 4. STATUS STOK (Fitur Baru) [cite: 2025-09-29] */}
                <TableCell className="text-center">
                  {product.isAvailable ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 pr-3">
                      <CheckCircle2 size={14} /> Tersedia
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 pr-3">
                      <XCircle size={14} /> Habis
                    </Badge>
                  )}
                </TableCell>

                {/* 5. Aksi */}
                <TableCell className="text-right space-x-2">
                  <div className="flex justify-end items-center gap-2">
                    {/* Tombol Edit */}
                    <EditProductModal product={product} onUpdate={onUpdate} />
                    
                    {/* Tombol Hapus */}
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      onClick={() => onDelete(product.id)}
                      title="Hapus Produk"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}