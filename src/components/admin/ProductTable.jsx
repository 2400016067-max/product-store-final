
import { useState } from "react"; // Tambahkan useState
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
  CheckSquare, // Icon untuk bulk select
  Square

  PackageSearch

} from "lucide-react"; 
import EditProductModal from "./EditProductModal"; 
import { useAuth } from "../../contexts/AuthContext";

// Perhatikan penambahan prop onBulkDelete
export default function ProductTable({ products, onDelete, onUpdate, onBulkDelete }) {
  const { user } = useAuth();

  
  // --- STATE UNTUK PILIH PRODUK ---
  const [selectedIds, setSelectedIds] = useState([]);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;

  const placeholderImage = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

  // --- LOGIKA PILIH SEMUA (SELECT ALL) --- [cite: 2026-01-08]
  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]); // Kosongkan jika sudah terpilih semua
    } else {
      setSelectedIds(products.map(p => p.id)); // Pilih semua ID yang tampil
    }
  };

  // --- LOGIKA PILIH SATUAN ---
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
=======
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canAction = isAdmin || isStaff;
  const placeholderImage = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

  
  const [selectedIds, setSelectedIds] = useState([]);

  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      
      const allIds = products.map((p) => p.id);
      setSelectedIds(allIds);
    } else {
      
      setSelectedIds([]);
    }
  };

  
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      
>>>>>>> 3a63c18e971785355a3933578d1b5c90b243dad3
      setSelectedIds([...selectedIds, id]);
    }
  };


  
  const handleBulkDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`)) {
    
      const deletePromises = selectedIds.map((id) => onDelete(id));
      
      await Promise.all(deletePromises);
      
      
      setSelectedIds([]);
      
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

      {/* HEADER INTERNAL TABEL */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PackageSearch size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Daftar Inventaris</h3>
            <p className="text-[10px] text-slate-400 font-medium">
              {selectedIds.length > 0 
                ? `${selectedIds.length} item dipilih` 
                : `Total: ${products.length} Produk Terdaftar`}
            </p>
      
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all">
        
        
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-4 w-full animate-in fade-in slide-in-from-left-2">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold border border-red-100">
              {selectedIds.length} Produk Dipilih
            </div>
            {isAdmin ? (
               <Button 
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
                className="rounded-xl shadow-lg shadow-red-100 font-bold"
              >
                <Trash2 size={16} className="mr-2" /> Hapus Terpilih
              </Button>
            ) : (
              <span className="text-xs text-slate-400 italic">Hanya Admin bisa menghapus</span>
            )}
            
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedIds([])}
              className="text-slate-500"
            >
              Batal
            </Button>
          </div>
        ) : (
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PackageSearch size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Daftar Inventaris</h3>
              <p className="text-[10px] text-slate-400 font-medium">Total: {products.length} Produk Terdaftar</p>
            </div>
          </div>
        )}


        <div className="flex items-center gap-2">
          {/* TOMBOL HAPUS MASSAL: Hanya muncul jika ada yang dipilih & User adalah Admin */}
          {isAdmin && selectedIds.length > 0 && (
            <Button 
              onClick={() => {
                onBulkDelete(selectedIds);
                setSelectedIds([]); // Reset setelah hapus
              }}
              variant="destructive"
              size="sm"
              className="rounded-xl font-black uppercase text-[10px] shadow-lg animate-in zoom-in duration-300"
            >
              <Trash2 size={14} className="mr-2" /> Hapus ({selectedIds.length})
            </Button>
          )}

        
        {selectedIds.length === 0 && (
          <Button 
            onClick={handleExportProducts}
            variant="outline"
            size="sm"
            className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[10px] shadow-sm transition-all active:scale-95"
          >
            <Download size={14} className="mr-2" /> Export
          </Button>
        </div>
=======
            <Download size={14} className="mr-2" /> Export Inventaris
          </Button>
        )}
      </div>

      
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-100/50 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              {/* Kolom Checkbox Header [cite: 2026-01-08] */}
              <TableHead className="w-[50px] p-6 text-center">
                <button onClick={handleSelectAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                  {selectedIds.length === products.length && products.length > 0 
                    ? <CheckSquare size={18} className="text-blue-600" /> 
                    : <Square size={18} />
                  }
                </button>
              </TableHead>
              
              
              {canAction && (
                <TableHead className="w-[50px] p-6 text-center">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    onChange={handleSelectAll}
                    checked={products.length > 0 && selectedIds.length === products.length}
                  />
                </TableHead>
              )}
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
                <TableCell colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ShieldAlert size={40} />
                    <p className="text-sm font-medium italic">Database produk kosong.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <tr 
                  key={product.id} 
                  className={`group transition-colors border-b border-slate-50 ${
                    selectedIds.includes(product.id) ? "bg-blue-50/50" : "hover:bg-blue-50/20"
                  }`}
                >
                  {/* Checkbox Row [cite: 2026-01-08] */}
                  <TableCell className="p-4 text-center">
                    <button 
                      onClick={() => handleSelectRow(product.id)}
                      className={`transition-colors ${selectedIds.includes(product.id) ? "text-blue-600" : "text-slate-300"}`}
                    >
                      {selectedIds.includes(product.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
                  
                  className={`group transition-colors border-b border-slate-50 ${selectedIds.includes(product.id) ? 'bg-blue-50/60' : 'hover:bg-blue-50/30'}`}
                >
                  
                  
                  {canAction && (
                    <TableCell className="p-4 text-center">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </TableCell>
                  )}

                  <TableCell className="p-4 pl-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      <img 
                        src={product.image || placeholderImage} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        onError={(e) => { e.target.src = placeholderImage; }}
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 uppercase text-xs tracking-tight">{product.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">REF-ID: {product.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tight">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 font-black text-slate-700 text-xs">
                    Rp {product.price?.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {product.isAvailable ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1 rounded-lg font-black text-[9px] uppercase">
                        <CheckCircle2 size={10} className="mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 px-3 py-1 rounded-lg font-black text-[9px] uppercase">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-lg text-[9px] uppercase">
                        <CheckCircle2 size={10} className="mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 px-3 py-1 rounded-lg text-[9px] uppercase">
                        <XCircle size={10} className="mr-1" /> Sold Out
                      </Badge>
                    )}
                  </TableCell>
                  {canAction && (
                    <TableCell className="p-4 text-right px-8">
                      <div className="flex justify-end items-center gap-3">
                        <EditProductModal product={product} onUpdate={onUpdate} />
                        {isAdmin && (
                          <Button 
                            variant="destructive" 
                            size="icon"

                            className="h-9 w-9 rounded-xl bg-rose-500 hover:bg-rose-600 transition-all active:scale-90 shadow-md"

                            className="h-9 w-9 rounded-xl shadow-lg shadow-rose-100 bg-rose-500 hover:bg-rose-600"

                            onClick={() => onDelete(product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>


                        ) : (
                          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 border border-dashed border-slate-200 cursor-not-allowed">
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