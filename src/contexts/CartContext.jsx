import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. INISIALISASI STATE (Load dari LocalStorage agar data awet)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("techstore_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. PERSISTENCE LOGIC (Simpan otomatis tiap kali ada perubahan)
  useEffect(() => {
    localStorage.setItem("techstore_cart", JSON.stringify(cart));
  }, [cart]);

  // 3. LOGIKA TAMBAH KE KERANJANG (Check & Update)
  const addToCart = (product) => {
    // Validasi stok sebelum proses [cite: 2025-12-22]
    if (!product.isAvailable) {
      alert("Maaf, stok produk ini sedang kosong!");
      return;
    }

    setCart((prevCart) => {
      // Cek apakah barang sudah ada di keranjang [cite: 2025-12-22]
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Jika ada, tambahkan quantity-nya saja [cite: 2025-12-22]
        return prevCart.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      // Jika baru, masukkan sebagai objek baru dengan qty: 1 [cite: 2025-12-22]
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 4. LOGIKA HAPUS & UPDATE QUANTITY
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + amount) } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // 5. LOGIKA PERHITUNGAN TOTAL (Math Logic) [cite: 2025-12-22]
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // 6. WA MESSAGE ORCHESTRATOR (Transformasi Data) [cite: 2025-12-22]
  const generateWAMessage = () => {
    const phoneNumber = "6282220947302"; // Nomor admin [cite: 2025-12-22]
    const header = "Halo Admin TechStore, saya ingin memesan:\n\n";
    
    // Transformasi array menjadi daftar teks [cite: 2025-12-22]
    const itemsList = cart
      .map((item, index) => {
        const subtotal = item.price * item.quantity;
        return `${index + 1}. *${item.name}* (x${item.quantity}) - Rp ${subtotal.toLocaleString("id-ID")}`;
      })
      .join("\n");

    const footer = `\n\n*TOTAL BAYAR: Rp ${totalPrice.toLocaleString("id-ID")}*\n\nMohon segera diproses, terima kasih!`;
    
    const fullText = header + itemsList + footer;
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(fullText)}`;
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalPrice, 
        totalItems,
        generateWAMessage 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);