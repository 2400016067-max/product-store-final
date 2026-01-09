import { HashRouter as Router, Routes, Route, Navigate, useOutletContext } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ManagerLayout from "./components/manager/ManagerLayout"; 
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
import ProductCard from "./components/public/ProductCard";
import UserManagement from "./pages/admin/UserManagement"; 
import OrderManagement from "./pages/admin/OrderManagement"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

// IMPORT HALAMAN BARU UNTUK 404 [cite: 2025-12-30]
import NotFound from "./pages/public/NotFound"; 

// IMPORT HALAMAN MANAGER
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AnalyticsReport from "./pages/manager/AnalyticsReport";

// PROVIDER & HOOKS
import { CartProvider } from "./contexts/CartContext"; 
import { useProducts } from "./hooks/useProducts"; 
import { useAuth } from "./contexts/AuthContext"; 
import { useFilteredProducts } from "./hooks/useFilteredProducts";

// =========================================================
// KOMPONEN VIEW: SISI PUBLIK (CLEAN & MODULAR)
// =========================================================
function KatalogView({ products, loading, error }) {
  const { searchQuery, selectedCategory } = useOutletContext();
  const filteredProducts = useFilteredProducts(products, searchQuery, selectedCategory);

  if (loading) return <div className="flex justify-center py-20 animate-pulse font-medium text-slate-400">Memuat katalog...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md text-center border border-red-100">{error}</div>;

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase">Katalog Produk</h2>
        <p className="text-slate-500 mt-2 italic">Koleksi perangkat audio premium pilihan kami.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredProducts.map((item) => <ProductCard key={item.id} product={item} />)}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 font-medium">
            Produk "{searchQuery}" tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// KOMPONEN VIEW: SISI ADMIN/STAFF
// =========================================================
function AdminInventoryView({ products, loading, user, onAdd, onDelete, onUpdate, onBulkDelete }) {
  const { searchQuery, selectedCategory } = useOutletContext();
  const filteredProducts = useFilteredProducts(products, searchQuery, selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Manajemen Inventory</h2>
          <p className="text-sm text-slate-500 font-medium italic">
            Operator: <span className="text-blue-600 font-black uppercase">{user?.username}</span>
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "staff") && (
          <AddProductModal onAdd={onAdd} />
        )}
      </div>
      
      {loading ? (
        <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center animate-pulse bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">
          Sinkronisasi Inventaris...
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          onDelete={onDelete} 
          onUpdate={onUpdate}
          onBulkDelete={onBulkDelete} 
        />
      )}
    </div>
  );
}

// =========================================================
// KOMPONEN UTAMA: APP (THE BRAIN)
// =========================================================
function App() {
  const { products, loading: productsLoading, error, deleteProduct, addProduct, updateProduct } = useProducts();
  const { user, loading: authLoading } = useAuth();

  const verifyAdminAction = () => {
    if (user?.role !== "admin") {
      alert("Otoritas Ditolak: Hanya Admin Utama yang dapat menghapus data.");
      return false;
    }
    return true;
  };

  const handleDelete = async (id) => {
    if (!verifyAdminAction()) return;
    if (window.confirm("Hapus produk ini dari database?")) {
      const result = await deleteProduct(id);
      if (!result.success) alert("Gagal: " + result.message);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!verifyAdminAction()) return;
    if (selectedIds.length === 0) return;

    if (window.confirm(`Konfirmasi: Hapus ${selectedIds.length} produk sekaligus?`)) {
      const results = await Promise.all(selectedIds.map(id => deleteProduct(id)));
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        alert(`Selesai dengan catatan: ${failed.length} item gagal dihapus.`);
      } else {
        alert(`Sukses! ${selectedIds.length} item telah dihapus.`);
      }
    }
  };

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 1. SISI PUBLIK */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<KatalogView products={products} loading={productsLoading} error={error} />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
          </Route>

          <Route path="/login" element={<Login />} />

          {/* 2. JALUR ADMIN & STAFF */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowRoles={["admin", "staff", "manager"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <AdminInventoryView 
                products={products} 
                loading={productsLoading} 
                user={user}
                onAdd={addProduct} 
                onDelete={handleDelete} 
                onUpdate={updateProduct}
                onBulkDelete={handleBulkDelete} 
              />
            } />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={
              <ProtectedRoute allowRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Route>

          {/* 3. JALUR MANAGER */}
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute allowRoles={["manager"]}>
                <ManagerLayout /> 
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path="reports" element={<AnalyticsReport />} />
          </Route>

          {/* 4. CATCH-ALL ROUTE (404 NOT FOUND) [cite: 2025-12-30] */}
          {/* Letakkan rute ini di paling bawah agar tidak memblokir rute lain */}
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;