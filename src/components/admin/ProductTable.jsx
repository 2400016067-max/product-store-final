import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { exportToCSV } from "../../utils/exportUtils"; 
import { 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldAlert, 
  Download, 
  PackageSearch,
  CheckSquare, 
  Square,
  X
} from "lucide-react"; 
import EditProductModal from "./EditProductModal"; 
import { useAuth } from "../../contexts/AuthContext";

export default function ProductTable({ products, onDelete, onUpdate, onBulkDelete }) {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState([]);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;
  const placeholderImage = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

  // --- LOGIKA PILIH SEMUA ---
  const handleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]); // Kosongkan jika sudah terpilih semua
    } else {
      setSelectedIds(products.map(p => p.id)); // Pilih semua
    }
  };

  // --- LOGIKA PILIH SATUAN ---
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- LOGIKA HAPUS MASSAL ---
  const handleBulkDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`)) {
      await onBulkDelete(selectedIds);
      setSelectedIds([]); // Reset seleksi setelah hapus
    }
  };

  const handleExportProducts = () => {
    if (products.length === 0) return alert("Database produk kosong!");
    const reportData = products.map(p => ({
      ID_Produk: p.id,
      Nama_Barang: p.name,
      Kategori: p.category,
      Harga_Satuan: p.price,
      Status_Stok: p.isAvailable ? "Ready" : "Sold Out",
      Deskripsi: p.description || "-"
    }));
    const headers = ["ID", "Nama Produk", "Kategori", "Harga (Rp)", "Status", "Keterangan"];
    const fileName = `Laporan_Inventaris_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(reportData, fileName, headers);
  };

  return (
    <div className="space-y-4">
      
      {/* HEADER DINAMIS: Berubah jika ada item yang dipilih */}
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all duration-500">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-4 w-full animate-in slide-in-from-left-2 duration-300">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100">
              {selectedIds.length} Item Terpilih
            </div>
            {isAdmin && (
              <Button 
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
                className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-red-100"
              >
                <Trash2 size={14} className="mr-2" /> Hapus Massal
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase"
            >
              <X size={14} className="mr-1" /> Batal
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-in fade-in duration-500">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
              <PackageSearch size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">Inventaris Gudang</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Total: {products.length} Produk Terdaftar
              </p>
            </div>
          </div>
        )}

        {selectedIds.length === 0 && (
          <Button 
            onClick={handleExportProducts}
            variant="outline"
            size="sm"
            className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[9px] tracking-[0.1em] px-6 shadow-sm transition-all active:scale-95"
          >
            <Download size={14} className="mr-2" /> Export Data
          </Button>
        )}
      </div>

      {/* TABEL INVENTARIS */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="w-[60px] p-6 text-center">
                  <button 
                    onClick={handleSelectAll} 
                    className="text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {selectedIds.length === products.length && products.length > 0 
                      ? <CheckSquare size={20} className="text-blue-600" /> 
                      : <Square size={20} />
                    }
                  </button>
                </TableHead>
                <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6">Visual</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6">Informasi Produk</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6">Kategori</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6 text-right">Harga Unit</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6">Status</TableHead>
                {canAction && (
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 p-6 px-10">Opsi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-28">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <ShieldAlert size={48} strokeWidth={1.5} />
                      <p className="text-xs font-black uppercase tracking-[0.3em] italic">No Inventory Data Found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className={`group transition-all duration-300 border-b border-slate-50 ${
                      selectedIds.includes(product.id) ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="p-4 text-center">
                      <button 
                        onClick={() => handleSelectOne(product.id)}
                        className={`transition-all ${selectedIds.includes(product.id) ? "text-blue-600 scale-110" : "text-slate-200"}`}
                      >
                        {selectedIds.includes(product.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </TableCell>

                    {/* Image */}
                    <TableCell className="p-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={product.image || placeholderImage} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = placeholderImage; }}
                        />
                      </div>
                    </TableCell>

                    {/* Info */}
                    <TableCell className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-slate-800 uppercase text-[11px] tracking-tight group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold font-mono tracking-tighter">
                          ID: {product.id.substring(0, 12)}...
                        </span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="p-4">
                      <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">
                        {product.category}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="p-4 font-black text-slate-900 text-xs text-right italic">
                      Rp {product.price?.toLocaleString("id-ID")}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="p-4 text-center">
                      {product.isAvailable ? (
                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg shadow-emerald-100">
                          <CheckCircle2 size={10} className="mr-1.5" /> Ready
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-200 text-slate-500 border-none px-3 py-1 rounded-lg font-black text-[8px] uppercase tracking-widest">
                          <XCircle size={10} className="mr-1.5" /> Sold
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    {canAction && (
                      <TableCell className="p-4 text-right px-10">
                        <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <EditProductModal product={product} onUpdate={onUpdate} />
                          {isAdmin && (
                            <Button 
                              variant="destructive" 
                              size="icon"
                              className="h-10 w-10 rounded-2xl bg-rose-500 hover:bg-rose-600 transition-all active:scale-90 shadow-xl shadow-rose-100"
                              onClick={() => onDelete(product.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
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
      </div>
    </div>
  );
}