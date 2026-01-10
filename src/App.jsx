import { HashRouter as Router, Routes, Route, Navigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react"; 
import { toast } from "sonner"; 

import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ManagerLayout from "./components/manager/ManagerLayout"; 
import ProductTable from "./components/admin/ProductTable"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import AddProductModal from "./components/admin/AddProductModal";
import Login from "./pages/admin/Login"; 
// --- PENAMBAHAN REGISTER ---
import Register from "./pages/admin/Register"; 
// ---------------------------
import ProductCard from "./components/public/ProductCard";
import UserManagement from "./pages/admin/UserManagement"; 
import OrderManagement from "./pages/admin/OrderManagement"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

import { Toaster } from "@/components/ui/sonner";
import NotFound from "./pages/public/NotFound"; 

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AnalyticsReport from "./pages/manager/AnalyticsReport";
import ManageNotes from "./pages/manager/ManageNotes";
import ManagerUserManagement from "./pages/manager/ManagerUserManagement";

// LANGKAH 1: IMPORT HALAMAN PROMO STRATEGIS
import ManagerPromo from "./pages/manager/ManagerPromo";

import { CartProvider } from "./contexts/CartContext"; 
import { useProducts } from "./hooks/useProducts"; 
import { useAuth } from "./contexts/AuthContext"; 
import { useFilteredProducts } from "./hooks/useFilteredProducts";

// =========================================================
// KOMPONEN VIEW: SISI PUBLIK
// =========================================================
function KatalogView({ products, loading, error }) {
  const { searchQuery, selectedCategory } = useOutletContext();
  const filteredProducts = useFilteredProducts(products, searchQuery, selectedCategory);

  if (loading) return <div className="flex justify-center py-20 animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">Synchronizing Catalog...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md text-center border border-red-100 font-bold uppercase text-[10px]">{error}</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Katalog Produk</h2>
        <p className="text-slate-400 mt-2 font-medium">Koleksi perangkat audio premium pilihan kami.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredProducts.map((item) => <ProductCard key={item.id} product={item} />)}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-32 text-slate-300 font-black uppercase tracking-[0.3em] italic">
            Produk "{searchQuery}" Tidak Terdeteksi.
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
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Manajemen Inventory</h2>
          <p className="text-sm text-slate-500 font-medium italic">
            Operator: <span className="text-indigo-600 font-black uppercase tracking-widest">{user?.username}</span>
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "staff") && (
          <AddProductModal onAdd={onAdd} />
        )}
      </div>
      
      {loading ? (
        <div className="h-64 border-2 border-dashed rounded-[2.5rem] flex items-center justify-center animate-pulse bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px]">
          Retrieving Asset Registry...
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
  const { products, loading: productsLoading, resetProductPrice, deleteProduct, addProduct, updateProduct } = useProducts();
  const { user, loading: authLoading } = useAuth();

  // LOGIC GUARDIAN: Pengecekan Durasi Promo Otomatis
  useEffect(() => {
    if (products.length > 0 && !productsLoading) {
      products.forEach(async (p) => {
        const now = new Date();
        const end = p.promoEnd ? new Date(p.promoEnd) : null;
        
        if (end && now > end && p.discountPercent > 0) {
          await resetProductPrice(p.id);
          console.log(`System: Promo for ${p.name} has expired.`);
          toast.info(`Info Sistem: Promo ${p.name} telah berakhir.`);
        }
      });
    }
  }, [products, productsLoading, resetProductPrice]);

  const verifyAdminAction = () => {
    if (user?.role !== "admin") {
      toast.error("Otoritas Ditolak", { description: "Hanya Admin Utama yang memiliki akses hapus." });
      return false;
    }
    return true;
  };

  const handleDelete = async (id) => {
    if (!verifyAdminAction()) return;
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Data Terhapus", { description: "Item berhasil dikeluarkan dari registry." });
    } else {
      toast.error("Gagal Menghapus", { description: result.message });
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!verifyAdminAction()) return;
    if (selectedIds.length === 0) return;

    const results = await Promise.all(selectedIds.map(id => deleteProduct(id)));
    const failed = results.filter(r => !r.success);
    
    if (failed.length > 0) {
      toast.warning("Penghapusan Parsial", { description: `${failed.length} item gagal diproses.` });
    } else {
      toast.success("Operasi Massal Sukses", { description: `${selectedIds.length} item telah dimusnahkan.` });
    }
  };

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="h-12 w-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <CartProvider>
      <Router>
        <Toaster position="top-right" richColors closeButton />

        <Routes>
          {/* 1. SISI PUBLIK */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<KatalogView products={products} loading={productsLoading} />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 

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
            <Route path="notes" element={<ManageNotes />} />
            <Route path="authority" element={<ManagerUserManagement />} />
            
            {/* RUTE BARU: MANAJEMEN PROMO STRATEGIS */}
            <Route path="promo" element={<ManagerPromo />} />
          </Route>

          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;