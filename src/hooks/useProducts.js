import { useState, useEffect, useCallback } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://694615d7ed253f51719d04d2.mockapi.io/products";

  // 1. GET ALL
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      const data = await response.json();
      
      // Sanitasi Data: Pastikan reviews selalu berupa array saat diload [cite: 2026-01-08]
      const sanitizedData = data.map(p => ({
        ...p,
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
        avgRating: p.avgRating || 0
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
        avgRating: data.avgRating || 0
      };
    } catch (err) {
      console.error("Hook Error (Detail):", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 3. SUBMIT REVIEW (FITUR BARU) [cite: 2026-01-08, 2025-09-29]
  const submitReview = async (productId, newReview) => {
    try {
      // Step A: Ambil data produk terbaru agar array reviews tidak tertimpa data lama
      const response = await fetch(`${API_URL}/${productId}`);
      if (!response.ok) throw new Error("Produk tidak ditemukan untuk diulas.");
      const currentProduct = await response.json();

      // Step B: Olah array reviews lama + baru
      const oldReviews = Array.isArray(currentProduct.reviews) ? currentProduct.reviews : [];
      const updatedReviews = [...oldReviews, { 
        ...newReview, 
        createdAt: new Date().toISOString() 
      }];

      // Step C: Hitung Average Rating Baru (Business Logic)
      const totalRating = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0);
      const newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

      // Step D: Kirim balik satu objek produk utuh (PUT) karena ini MockAPI gratisan
      const updateResponse = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProduct,
          reviews: updatedReviews,
          avgRating: newAvgRating
        }),
      });

      if (!updateResponse.ok) throw new Error("Gagal mengirim ulasan.");
      const finalProduct = await updateResponse.json();

      // Step E: Sinkronisasi State Lokal agar UI berubah seketika
      setProducts((prev) => 
        prev.map((p) => (p.id === productId ? finalProduct : p))
      );

      return { success: true, data: finalProduct };
    } catch (err) {
      console.error("Review Error:", err.message);
      return { success: false, message: err.message };
    }
  };

  // 4. DELETE
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

  // 5. POST (Add Product)
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          reviews: [], // Inisialisasi array kosong agar tidak error [cite: 2026-01-08]
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

  // 6. PUT (Update Product)
  const updateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Gagal memperbarui produk.");
      const updatedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
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
    submitReview // Ekspos fungsi baru ke komponen
  };
};