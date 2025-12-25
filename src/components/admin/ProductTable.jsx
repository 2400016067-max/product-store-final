import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { exportToCSV } from "../../utils/exportUtils"; // Pastikan path benar
import { 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldAlert, 
  Download, // Icon untuk export
  PackageSearch // Icon tambahan untuk visual
} from "lucide-react"; 
import EditProductModal from "./EditProductModal"; 
import { useAuth } from "../../contexts/AuthContext";

export default function ProductTable({ products, onDelete, onUpdate }) {
  const { user } = useAuth();

  // Abstraksi Logika Otoritas
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;

  // URL Gambar Placeholder
  const placeholderImage = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

  // --- LOGIKA EXPORT PRODUK (Analisis Sistem Informasi) --- [cite: 2025-11-02]
  const handleExportProducts = () => {
    if (products.length === 0) return alert("Database produk kosong!");

    // Mapping: Fokus pada data operasional gudang
    const reportData = products.map(p => ({
      ID_Produk: p.id,
      Nama_Barang: p.name,
      Kategori: p.category,
      Harga_Satuan: p.price, // Biarkan angka murni agar bisa di-SUM di Excel [cite: 2025-09-29]
      Status_Stok: p.isAvailable ? "Ready" : "Sold Out",
      Deskripsi: p.description || "-"
    }));

    const headers = ["ID", "Nama Produk", "Kategori", "Harga (Rp)", "Status", "Keterangan"];
    
    const fileName = `Laporan_Inventaris_${new Date().toISOString().split('T')[0]}`;
    
    exportToCSV(reportData, fileName, headers);
  };

  return (
    <div className="space-y-4">
      {/* HEADER INTERNAL TABEL */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PackageSearch size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Daftar Inventaris</h3>
            <p className="text-[10px] text-slate-400 font-medium">Total: {products.length} Produk Terdaftar</p>
          </div>
        </div>

        {/* Tombol Export Khusus Produk */}
        <Button 
          onClick={handleExportProducts}
          variant="outline"
          size="sm"
          className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[10px] shadow-sm transition-all active:scale-95"
        >
          <Download size={14} className="mr-2" /> Export Inventaris
        </Button>
      </div>

      {/* TABEL DATA */}
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-100/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Preview</TableHead>
              <TableHead className="w-[250px] font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Produk</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Kategori</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Harga</TableHead>
              <TableHead className="text-center font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Stok</TableHead>
              {canAction && (
                <TableHead className="text-right font-black text-[10px] uppercase tracking-wider text-slate-400 p-6 px-8">Kontrol</TableHead>
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
                <tr key={product.id} className="group transition-colors hover:bg-blue-50/30 border-b border-slate-50">
                  <TableCell className="p-4 pl-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
                      <img 
                        src={product.image || placeholderImage} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = placeholderImage;
                        }}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 uppercase text-xs tracking-tight">{product.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-tighter">REF-ID: {product.id}</span>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tight shadow-sm">
                      {product.category}
                    </span>
                  </TableCell>

                  <TableCell className="p-4 font-black text-slate-700 text-xs">
                    Rp {product.price?.toLocaleString("id-ID")}
                  </TableCell>

                  <TableCell className="p-4 text-center">
                    {product.isAvailable ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1 rounded-lg shadow-none font-black text-[9px] uppercase">
                        <CheckCircle2 size={10} className="mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 px-3 py-1 rounded-lg shadow-none font-black text-[9px] uppercase">
                        <XCircle size={10} className="mr-1" /> Sold Out
                      </Badge>
                    )}
                  </TableCell>

                  {canAction && (
                    <TableCell className="p-4 text-right px-8">
                      <div className="flex justify-end items-center gap-3">
                        <div className="transition-transform active:scale-90">
                          <EditProductModal product={product} onUpdate={onUpdate} />
                        </div>
                        
                        {isAdmin ? (
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="h-9 w-9 rounded-xl shadow-lg shadow-rose-100 transition-all hover:rotate-6 active:scale-90 bg-rose-500 hover:bg-rose-600"
                            onClick={() => onDelete(product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        ) : (
                          <div 
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 border border-dashed border-slate-200 cursor-not-allowed" 
                            title="Akses Admin Diperlukan untuk Menghapus"
                          >
                            <ShieldAlert size={16} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}