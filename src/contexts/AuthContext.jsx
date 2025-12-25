import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. Cek Sesi (Mengenali User saat refresh tab)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = sessionStorage.getItem("admin_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Session Error:", error);
        sessionStorage.removeItem("admin_user");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // 2. Fungsi Login: Sekarang memetakan field pesanan baru [cite: 2025-09-29]
  const login = async (username, password) => {
    try {
      const response = await fetch(AUTH_API);
      if (!response.ok) throw new Error("Gagal fetch data");
      
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        const userData = { 
          id: foundUser.id, 
          username: foundUser.username, 
          name: foundUser.name,
          role: foundUser.role.toLowerCase(), // Normalisasi ke huruf kecil [cite: 2025-09-29]
          // --- DATA TRACKING PESANAN ---
          orderStatus: foundUser.orderStatus || "Pending",
          orderProduct: foundUser.orderProduct || "", // Nama produk yang dibeli
          adminMessage: foundUser.adminMessage || "", // Pesan dari staff
          orderDate: foundUser.orderDate || ""
        };

        setUser(userData); 
        sessionStorage.setItem("admin_user", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: "Username atau Password salah!" };
      }
    } catch (error) {
      return { success: false, message: "Masalah koneksi ke server." };
    }
  };

  // 3. FUNGSI BARU: UPDATE ORDER (ADMIN & STAFF) [cite: 2025-11-02]
  // UpdateData bisa berisi: { orderStatus, orderProduct, adminMessage }
  const updateUserOrder = async (userId, updateData) => {
    try {
      const response = await fetch(`${AUTH_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...updateData,
          orderDate: new Date().toISOString() 
        }),
      });

      if (!response.ok) throw new Error("Gagal update di server");
      
      const updatedData = await response.json();

      // Sinkronisasi State jika yang diedit adalah akun yang sedang login
      if (user?.id === userId) {
        const newLocalData = { ...user, ...updatedData };
        setUser(newLocalData);
        sessionStorage.setItem("admin_user", JSON.stringify(newLocalData));
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 4. FUNGSI BARU: REFRESH DATA USER (VIEWER) [cite: 2025-09-29]
  const refreshUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`);
      if (response.ok) {
        const latestData = await response.json();
        // Memastikan semua field terbaru ikut masuk ke state
        const updatedUser = { 
          ...user, 
          orderStatus: latestData.orderStatus, 
          orderProduct: latestData.orderProduct,
          adminMessage: latestData.adminMessage,
          orderDate: latestData.orderDate 
        };
        setUser(updatedUser);
        sessionStorage.setItem("admin_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Gagal refresh data:", error);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateUserOrder, // Fungsi tunggal untuk semua update pesanan
    refreshUserData, 
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    isViewer: user?.role === "viewer"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
};