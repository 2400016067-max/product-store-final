import { useState, useEffect, useCallback } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL dari MockAPI kamu
  const API_URL = "https://694615d7ed253f51719d04d2.mockapi.io/products";

  // 1. GET ALL: Mengambil semua data untuk Katalog & Tabel Admin
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. GET BY ID: Dioptimalkan dengan useCallback agar referensi fungsi stabil [cite: 2025-12-21]
  const getProductById = useCallback(async (id) => {
    if (!id) return null;
    try {
      // Kita tetap gunakan loading lokal jika dibutuhkan di komponen
      setLoading(true); 
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Produk tidak ditemukan.");
      return await response.json();
    } catch (err) {
      console.error("Hook Error (Detail):", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 3. DELETE: Menghapus produk dari database
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus produk.");
      
      // Optimistic Update: Langsung hapus di UI [cite: 2025-09-29]
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 4. POST: Menambah produk baru melalui Modal Tambah [cite: 2025-09-29]
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Gagal menambah produk.");
      
      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 5. PUT: Memperbarui data produk (Fitur Edit)
  const updateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Gagal memperbarui produk.");
      
      const updatedProduct = await response.json();
      setProducts((prev) => 
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
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
    getProductById 
  };
};