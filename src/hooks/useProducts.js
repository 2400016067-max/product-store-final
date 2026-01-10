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
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
        avgRating: Number(p.avgRating) || 0,
        originalPrice: Number(p.originalPrice) || Number(p.price) || 0,
        discountPercent: Number(p.discountPercent) || 0,
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
        avgRating: Number(data.avgRating) || 0,
        originalPrice: Number(data.originalPrice) || Number(data.price) || 0,
        discountPercent: Number(data.discountPercent) || 0
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
      
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      return { success: true, data: updatedProduct };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 4. ACTIVATE PROMO
  const activatePromo = async (productId, discount, startTime, endTime) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: "Produk tidak ditemukan" };

    const original = Number(product.originalPrice);
    const disc = Number(discount);
    const newPrice = Math.round(original - (original * (disc / 100)));

    const payload = {
      ...product,
      price: newPrice,
      discountPercent: parseInt(disc),
      promoStart: startTime,
      promoEnd: endTime
    };

    return await updateProduct(productId, payload);
  };

  // 5. RESET PRODUCT PRICE
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

  // 6. SUBMIT REVIEW (ANTI DATA RUSAK)
  const submitReview = async (productId, newReview) => {
    if (!newReview || typeof newReview !== 'object' || Array.isArray(newReview)) {
      return { success: false, message: "Data review hancur atau tidak lengkap." };
    }

    try {
      const response = await fetch(`${API_URL}/${productId}`);
      const currentProduct = await response.json();

      const oldReviews = Array.isArray(currentProduct.reviews) ? currentProduct.reviews : [];
      
      // Memberikan ID unik pada review agar bisa dihapus nantinya
      const validatedReview = {
        id: Date.now().toString(), // ID unik untuk review
        userName: newReview.username || newReview.userName || "Anonymous",
        userId: newReview.userId || null,
        rating: Number(newReview.rating) || 5,
        comment: newReview.comment || "",
        createdAt: new Date().toISOString()
      };

      const updatedReviews = [...oldReviews, validatedReview];

      const totalRating = updatedReviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0);
      const newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

      return await updateProduct(productId, {
        ...currentProduct,
        reviews: updatedReviews,
        avgRating: newAvgRating
      });
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ============================================================
  // 7. FITUR BARU: DELETE SPECIFIC REVIEW
  // ============================================================
  const deleteReview = async (productId, reviewId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`);
      if (!response.ok) throw new Error("Produk tidak ditemukan.");
      const currentProduct = await response.json();

      const oldReviews = Array.isArray(currentProduct.reviews) ? currentProduct.reviews : [];
      
      // Filter untuk membuang ulasan yang ID-nya cocok
      const updatedReviews = oldReviews.filter(rev => rev.id !== reviewId);

      // Kalkulasi ulang rating setelah penghapusan
      let newAvgRating = 0;
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0);
        newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
      }

      return await updateProduct(productId, {
        ...currentProduct,
        reviews: updatedReviews,
        avgRating: newAvgRating
      });
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 8. DELETE PRODUCT (TOTAL)
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

  // 9. POST (Add Product)
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          originalPrice: Number(newProduct.price),
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
    products, loading, error, 
    refetch: fetchProducts, 
    deleteProduct, addProduct, updateProduct, getProductById,
    submitReview, deleteReview, // Ekspos fungsi baru
    activatePromo, resetProductPrice 
  };
};