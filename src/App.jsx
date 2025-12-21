import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
import ProductCard from "./components/public/ProductCard";

// 1. IMPORT PROTECTED ROUTE (Satpam)
// Buat komponen ini di folder components jika belum ada
import ProtectedRoute from "./components/ProtectedRoute"; 

// HOOKS
import { useProducts } from "./hooks/useProducts"; 
import { useAuth } from "./contexts/AuthContext"; 

function App() {
  const { 
    products, 
    loading: productsLoading, 
    error, 
    deleteProduct, 
    addProduct, 
    updateProduct 
  } = useProducts();

  const { isAuthenticated, loading: authLoading } = useAuth();

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const result = await deleteProduct(id);
      if (!result.success) alert("Gagal menghapus: " + result.message);
    }
  };

  // SPLASH SCREEN: Mencegah "Flash" konten atau redirect liar saat cek session
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
                <h2 className="text-4xl font-extrabold tracking-tight">Katalog Produk</h2>
                <p className="text-muted-foreground mt-2">Koleksi perangkat audio premium.</p>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-20 animate-pulse font-medium">Memuat katalog...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-md text-center">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              )}
            </div>
          } />
          <Route path="/detail/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= JALUR LOGIN ================= */}
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
          {/* Index Route untuk Admin */}
          <Route index element={
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Manajemen Inventory</h2>
                  <p className="text-sm text-muted-foreground">Total: {products.length} produk.</p>
                </div>
                <AddProductModal onAdd={addProduct} />
              </div>
              
              {productsLoading ? (
                <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center animate-pulse">
                  Menyinkronkan database...
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;