import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
import ProductCard from "./components/public/ProductCard";

// 1. IMPORT PROTECTED ROUTE (Satpam)
import ProtectedRoute from "./components/ProtectedRoute"; 

// HOOKS
import { useProducts } from "./hooks/useProducts"; 
import { useAuth } from "./contexts/AuthContext"; 

function App() {
  // Ambil data produk
  const { 
    products, 
    loading: productsLoading, 
    error, 
    deleteProduct, 
    addProduct, 
    updateProduct 
  } = useProducts();

  // Ambil data autentikasi dari Global Context
  const { isAuthenticated, loading: authLoading } = useAuth();

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const result = await deleteProduct(id);
      if (!result.success) alert("Gagal menghapus: " + result.message);
    }
  };

  /**
   * 2. SPLASH SCREEN (PENYELAMAT BUG)
   * Efek ini HANYA muncul saat pertama kali website dibuka atau di-refresh total.
   * Saat proses login berlangsung, authLoading TIDAK berubah jadi true (berkat perbaikan AuthContext tadi),
   * sehingga komponen Login tidak akan dicopot dari layar.
   */
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Memverifikasi Sesi Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ================= JALUR PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Katalog Produk</h2>
                <p className="text-slate-500 mt-2">Koleksi perangkat audio premium pilihan kami.</p>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-20 animate-pulse font-medium text-slate-400">Memuat katalog...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-md text-center border border-red-100">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                  {products.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              )}
            </div>
          } />
          <Route path="/detail/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= JALUR LOGIN ================= 
            Logika Navigate di sini membantu jika user mencoba mengakses /login secara manual saat sudah login.
        */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} 
        />

        {/* ================= JALUR ADMIN (DIPROTEKSI) ================= */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard utama admin */}
          <Route index element={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800">Manajemen Inventory</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Total: <span className="text-blue-600">{products.length}</span> produk aktif.
                  </p>
                </div>
                <AddProductModal onAdd={addProduct} />
              </div>
              
              {productsLoading ? (
                <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center animate-pulse bg-slate-50 text-slate-400">
                  Sinkronisasi database admin...
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

        {/* FALLBACK: Jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;