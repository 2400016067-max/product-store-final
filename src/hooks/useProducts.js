import { useState, useEffect, useCallback } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://694615d7ed253f51719d04d2.mockapi.io/products";

  // 1. GET ALL (SANKURASI & SANITASI DATA PROMO)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      const data = await response.json();
      
      const sanitizedData = data.map(p => ({
        ...p,
        // Sanitasi dasar
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
        avgRating: p.avgRating || 0,
        // Sanitasi Logic Promo: Jika originalPrice belum ada, gunakan price saat ini [cite: 2025-11-02]
        originalPrice: p.originalPrice || p.price,
        discountPercent: p.discountPercent || 0,
        promoStart: p.promoStart || "",
        promoEnd: p.promoEnd || ""
      }));
      
      setProducts(sanitizedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. GET BY ID
  const getProductById = useCallback(async (id) => {
    if (!id) return null;
    try {
      setLoading(true); 
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Produk tidak ditemukan.");
      const data = await response.json();
      
      return {
        ...data,
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        avgRating: data.avgRating || 0,
        originalPrice: data.originalPrice || data.price,
        discountPercent: data.discountPercent || 0
      };
    } catch (err) {
      console.error("Hook Error (Detail):", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 3. PUT (Update Product - Universal)
  const updateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Gagal memperbarui produk.");
      const updatedProduct = await response.json();
      
      // Sinkronisasi state lokal
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      return { success: true, data: updatedProduct };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 4. ACTIVATE PROMO (LOGIKA STRATEGIS MANAGER)
  const activatePromo = async (productId, discount, startTime, endTime) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: "Produk tidak ditemukan" };

    // Kalkulasi Harga: (Harga Asli - Potongan)
    const newPrice = Math.round(product.originalPrice - (product.originalPrice * (discount / 100)));

    const payload = {
      ...product, // Sebarkan data lama agar tidak hilang (reviews, dll)
      price: newPrice,
      discountPercent: parseInt(discount),
      promoStart: startTime,
      promoEnd: endTime
    };

    return await updateProduct(productId, payload);
  };

  // 5. RESET PRODUCT (KEMBALIKAN KE HARGA NORMAL)
  const resetProductPrice = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false };

    const payload = {
      ...product,
      price: product.originalPrice,
      discountPercent: 0,
      promoStart: "",
      promoEnd: ""
    };
    return await updateProduct(productId, payload);
  };

  // 6. SUBMIT REVIEW (SINKRONISASI DENGAN DATA PROMO)
  const submitReview = async (productId, newReview) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`);
      if (!response.ok) throw new Error("Produk tidak ditemukan.");
      const currentProduct = await response.json();

      const oldReviews = Array.isArray(currentProduct.reviews) ? currentProduct.reviews : [];
      const updatedReviews = [...oldReviews, { ...newReview, createdAt: new Date().toISOString() }];

      const totalRating = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0);
      const newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

      // Gunakan updateProduct untuk konsistensi
      return await updateProduct(productId, {
        ...currentProduct,
        reviews: updatedReviews,
        avgRating: newAvgRating
      });
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 7. DELETE
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus produk.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 8. POST (Add Product)
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          originalPrice: newProduct.price, // Harga asli = Harga input awal [cite: 2025-11-02]
          discountPercent: 0,
          promoStart: "",
          promoEnd: "",
          reviews: [],
          avgRating: 0
        }),
      });
      if (!response.ok) throw new Error("Gagal menambah produk.");
      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts, 
    deleteProduct, 
    addProduct, 
    updateProduct, 
    getProductById,
    submitReview,
    activatePromo,   // Ekspos ke ManagerPromo.jsx
    resetProductPrice // Ekspos untuk logika auto-reset
  };
};