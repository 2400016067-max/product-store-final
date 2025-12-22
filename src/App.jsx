import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
import ProductCard from "./components/public/ProductCard";

// IMPORT BARU: Halaman Manajemen User
import UserManagement from "./pages/admin/UserManagement"; 

// 1. IMPORT PROTECTED ROUTE (Satpam)
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

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const handleDelete = async (id) => {
    if (user?.role !== "admin") {
      alert("Maaf, hanya Admin (Imam) yang punya otoritas menghapus data.");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const result = await deleteProduct(id);
      if (!result.success) alert("Gagal menghapus: " + result.message);
    }
  };

  // SPLASH SCREEN
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Memverifikasi Otoritas Sesi...</p>
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

        {/* ================= JALUR LOGIN ================= */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} 
        />

        {/* ================= JALUR ADMIN (STRATEGI RBAC) ================= */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowRoles={["admin", "staff"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* 1. Halaman Inventory (Bisa diakses Admin & Staff) */}
          <Route index element={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800">Manajemen Inventory</h2>
                  <p className="text-sm text-slate-500 font-medium italic">
                    Operator: <span className="text-blue-600 font-black uppercase">{user?.username}</span>
                  </p>
                </div>
                {(user?.role === "admin" || user?.role === "staff") && (
                  <AddProductModal onAdd={addProduct} />
                )}
              </div>
              
              {productsLoading ? (
                <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center animate-pulse bg-slate-50 text-slate-400">
                  Menyinkronkan data...
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

          {/* 2. HALAMAN MANAJEMEN USER (KHUSUS ADMIN) */}
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;