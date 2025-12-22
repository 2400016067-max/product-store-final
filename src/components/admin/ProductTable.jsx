import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { CheckCircle2, XCircle, Trash2, ShieldAlert, PencilLine } from "lucide-react"; 
import EditProductModal from "./EditProductModal"; 
import { useAuth } from "../../contexts/AuthContext";

export default function ProductTable({ products, onDelete, onUpdate }) {
  const { user } = useAuth();

  // Abstraksi Logika Otoritas (Clean Code)
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px] font-bold text-slate-600">Produk</TableHead>
            <TableHead className="font-bold text-slate-600">Kategori</TableHead>
            <TableHead className="font-bold text-slate-600">Harga</TableHead>
            <TableHead className="text-center font-bold text-slate-600">Stok</TableHead>
            
            {/* Header dinamis berdasarkan otoritas */}
            {canAction && (
              <TableHead className="text-right font-bold text-slate-600 px-6">Kontrol</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <ShieldAlert size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium italic">Database MockAPI kosong.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="group transition-colors hover:bg-blue-50/30">
                
                {/* 1. Nama Produk dengan Badge ID */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{product.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {product.id}</span>
                  </div>
                </TableCell>

                {/* 2. Kategori dengan Styling Lebih Soft */}
                <TableCell>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-tight">
                    {product.category}
                  </span>
                </TableCell>

                {/* 3. Harga */}
                <TableCell className="font-bold text-slate-700">
                  Rp {product.price?.toLocaleString("id-ID")}
                </TableCell>

                {/* 4. Status Stok */}
                <TableCell className="text-center">
                  {product.isAvailable ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 size={12} className="mr-1" /> Ready
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 px-3 py-1 rounded-lg">
                      <XCircle size={12} className="mr-1" /> Sold Out
                    </Badge>
                  )}
                </TableCell>

                {/* 5. Kolom Aksi (RBAC Filter) */}
                {canAction && (
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end items-center gap-3">
                      
                      {/* Otoritas Edit: Imam & Raka bisa */}
                      <div className="transition-transform active:scale-90">
                        <EditProductModal product={product} onUpdate={onUpdate} />
                      </div>
                      
                      {/* Otoritas Hapus: Hanya Imam */}
                      {isAdmin ? (
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="h-9 w-9 rounded-xl shadow-lg shadow-red-100 transition-all hover:rotate-6"
                          onClick={() => onDelete(product.id)}
                          title="Hapus Produk Permanen"
                        >
                          <Trash2 size={16} />
                        </Button>
                      ) : (
                        /* Visual Feedback untuk Raka (Staff) */
                        <div 
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 border border-dashed border-slate-200 cursor-not-allowed" 
                          title="Otoritas Admin diperlukan untuk menghapus"
                        >
                          <ShieldAlert size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}