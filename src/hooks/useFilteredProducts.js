import { useMemo } from "react";

// Hook ini akan digunakan oleh KatalogView dan AdminInventoryView
export function useFilteredProducts(products, searchQuery, selectedCategory) {
  return useMemo(() => {
    if (!products) return [];
    
    return products.filter((item) => {
      // Logika 1: Nama Produk (case-insensitive)
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Logika 2: Kategori (cocok atau "Semua")
      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);
}