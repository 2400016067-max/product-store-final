import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
import { useProducts } from "./hooks/useProducts"; 
import { useAuth } from "./hooks/useAuth"; 

// Halaman Home (Katalog)
import ProductCard from "./components/public/ProductCard";

function App() {
  // 1. Logic Produk (Integrasi API)
  const { 
    products, 
    loading: productsLoading, 
    error, 
    deleteProduct, 
    addProduct, 
    updateProduct 
  } = useProducts();

  // 2. Logic Autentikasi
  const { isAuthenticated, loading: authLoading } = useAuth();

  // 3. Handler Hapus (CRUD: Delete)
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert("Gagal menghapus: " + result.message);
      }
    }
  };

  /**
   * 4. SPLASH SCREEN
   * Menunggu verifikasi sesi dari LocalStorage [cite: 2025-09-29, 12-20].
   */
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Memverifikasi Sesi Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ================= JALUR PUBLIC (Bebas Akses) ================= */}
        <Route element={<PublicLayout />}>
          {/* Katalog List */}
          <Route path="/" element={
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold tracking-tight">Katalog Produk</h2>
                <p className="text-muted-foreground mt-2">
                  Koleksi perangkat audio premium untuk pengalaman digital terbaik.
                </p>
              </div>

              {productsLoading && (
                <div className="flex justify-center py-20 animate-pulse text-lg font-medium">
                  Memuat katalog dari server...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-center">
                  Terjadi Kesalahan: {error}
                </div>
              )}

              {!productsLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          } />

          {/* RUTE DINAMIS DETAIL PRODUK (Kunci Fitur WA) */}
          <Route path="/detail/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= JALUR LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= JALUR ADMIN (DIPROTEKSI) ================= */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Manajemen Inventory</h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total: {products.length} produk tersedia secara Live.
                  </p>
                </div>
                <AddProductModal onAdd={addProduct} />
              </div>
              
              {productsLoading ? (
                <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 animate-pulse">
                  Menyinkronkan database admin...
                </div>
              ) : (
                <ProductTable 
                  products={products} 
                  onDelete={handleDelete} 
                  onUpdate={updateProduct} 
                />
              )}
            </div>
          } />
        </Route>

        {/* Fallback ke Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;