import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { CheckCircle2, XCircle, Trash2, ShieldAlert, ImageOff } from "lucide-react"; 
import EditProductModal from "./EditProductModal"; 
import { useAuth } from "../../contexts/AuthContext";

export default function ProductTable({ products, onDelete, onUpdate }) {
  const { user } = useAuth();

  // Abstraksi Logika Otoritas
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;

  // URL Gambar Placeholder jika data kosong atau error
  const placeholderImage = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            {/* Tambahan Kolom Preview Gambar */}
            <TableHead className="w-[80px] font-bold text-slate-600">Preview</TableHead>
            <TableHead className="w-[250px] font-bold text-slate-600">Produk</TableHead>
            <TableHead className="font-bold text-slate-600">Kategori</TableHead>
            <TableHead className="font-bold text-slate-600">Harga</TableHead>
            <TableHead className="text-center font-bold text-slate-600">Stok</TableHead>
            
            {canAction && (
              <TableHead className="text-right font-bold text-slate-600 px-6">Kontrol</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <ShieldAlert size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium italic">Database produk kosong.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="group transition-colors hover:bg-blue-50/30">
                
                {/* PERBAIKAN: Preview Gambar dengan Logika Anti-Error 404 */}
                <TableCell>
                  <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img 
                      src={product.image || placeholderImage} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                      // Jika URL gambar error (404), ganti otomatis ke placeholder
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{product.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {product.id}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-tight">
                    {product.category}
                  </span>
                </TableCell>

                <TableCell className="font-bold text-slate-700">
                  Rp {product.price?.toLocaleString("id-ID")}
                </TableCell>

                <TableCell className="text-center">
                  {product.isAvailable ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-3 py-1 rounded-lg shadow-none">
                      <CheckCircle2 size={12} className="mr-1" /> Ready
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 px-3 py-1 rounded-lg shadow-none">
                      <XCircle size={12} className="mr-1" /> Sold Out
                    </Badge>
                  )}
                </TableCell>

                {canAction && (
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end items-center gap-3">
                      <div className="transition-transform active:scale-90">
                        <EditProductModal product={product} onUpdate={onUpdate} />
                      </div>
                      
                      {isAdmin ? (
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="h-9 w-9 rounded-xl shadow-lg shadow-red-100 transition-all hover:rotate-6 active:scale-90"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      ) : (
                        <div 
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 border border-dashed border-slate-200 cursor-not-allowed" 
                          title="Akses Admin Diperlukan"
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