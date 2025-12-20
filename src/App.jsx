import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Menggunakan HashRouter untuk kestabilan GH Pages [cite: 2025-12-20]
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProductCard from "./components/public/ProductCard";
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal"; // Pastikan komponen ini diimport [cite: 2025-09-29]
import { useProducts } from "./hooks/useProducts"; 

function App() {
  // 1. Destruktur LENGKAP semua fungsi logic dari hook [cite: 2025-09-29]
  const { products, loading, error, deleteProduct, addProduct, updateProduct } = useProducts();

  // 2. Handler Hapus dengan konfirmasi
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert("Gagal menghapus: " + result.message);
      }
    }
  };

  return (
    <Router>
      <Routes>
        {/* ================= JALUR PUBLIC (Tugas Anggota A) ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold tracking-tight">Katalog Produk</h2>
                <p className="text-muted-foreground mt-2">
                  Koleksi perangkat audio premium untuk pengalaman digital terbaik.
                </p>
              </div>

              {/* Status Handling */}
              {loading && (
                <div className="flex justify-center py-20 animate-pulse text-lg font-medium">
                  Memuat katalog dari server...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-center">
                  Terjadi Kesalahan: {error}
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          } />
          <Route path="/detail/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= JALUR ADMIN (Tugas Anggota B) ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Manajemen Inventory</h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total: {products.length} produk tersedia secara Live.
                  </p>
                </div>
                
                {/* 3. MENGAKTIFKAN MODAL TAMBAH [cite: 2025-09-29] */}
                <AddProductModal onAdd={addProduct} />
              </div>
              
              {loading ? (
                <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 animate-pulse">
                  Menyinkronkan database admin...
                </div>
              ) : (
                /* 4. MENGAKTIFKAN LOGIKA UPDATE DI TABEL [cite: 2025-09-29] */
                <ProductTable 
                  products={products} 
                  onDelete={handleDelete} 
                  onUpdate={updateProduct} 
                />
              )}
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;