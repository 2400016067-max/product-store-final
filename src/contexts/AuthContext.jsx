import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. CEK SESI (Mengenali User saat refresh tab)
  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = sessionStorage.getItem("admin_user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        sessionStorage.removeItem("admin_user");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // 2. FUNGSI LOGIN GOOGLE
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const response = await fetch(AUTH_API);
      const users = await response.json();
      let foundUser = users.find(u => u.username === googleUser.email);

      if (!foundUser) {
        const newUser = {
          username: googleUser.email,
          password: "google-auth-user",
          name: googleUser.displayName,
          role: "viewer",
          orderStatus: "Belum Ada Pesanan",
          personalNotes: [], 
          adminMessage: "Selamat datang! Akun Anda diverifikasi via Google.",
          managerBroadcast: "", // Inisialisasi field baru
          orderProduct: "",
          orderDate: new Date().toISOString()
        };
        const createRes = await fetch(AUTH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });
        foundUser = await createRes.json();
      }
      setUser(foundUser);
      sessionStorage.setItem("admin_user", JSON.stringify(foundUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal masuk dengan Google." };
    }
  };

  // 3. FUNGSI LOGIN MANUAL
  const login = async (username, password) => {
    try {
      const response = await fetch(AUTH_API);
      const users = await response.json();
      const foundUser = users.find(u => u.username === username && u.password === password);
      if (foundUser) {
        setUser(foundUser); 
        sessionStorage.setItem("admin_user", JSON.stringify(foundUser));
        return { success: true };
      }
      return { success: false, message: "Username atau Password salah!" };
    } catch (error) {
      return { success: false, message: "Masalah koneksi ke server." };
    }
  };

  // 4. UPDATE DATA PROFIL/USER (Universal)
  const updateProfile = async (updates) => {
    if (!user) return { success: false, message: "Sesi berakhir." };
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...updates }),
      });
      const updatedData = await response.json();
      setUser(updatedData);
      sessionStorage.setItem("admin_user", JSON.stringify(updatedData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 5. UPDATE DATA PESANAN (Admin/Staff)
  const updateUserOrder = async (userId, updateData) => {
    try {
      const res = await fetch(`${AUTH_API}/${userId}`);
      const targetData = await res.json();

      const response = await fetch(`${AUTH_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...targetData, 
          ...updateData, 
          orderDate: new Date().toISOString() 
        }),
      });
      const data = await response.json();
      if (user?.id === userId) {
        setUser(data);
        sessionStorage.setItem("admin_user", JSON.stringify(data));
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 6. REFRESH DATA
  const refreshUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`);
      const latestData = await response.json();
      setUser(latestData);
      sessionStorage.setItem("admin_user", JSON.stringify(latestData));
    } catch (e) { console.error(e); }
  };

  // ==========================================
  // FITUR BARU: BROADCAST & MESSAGING
  // ==========================================

  // A. BROADCAST MASSAL (Manager -> Seluruh User)
  const broadcastMessage = async (message) => {
    try {
      const res = await fetch(AUTH_API);
      const allUsers = await res.json();

      // Transmisi Paralel: Mengirim PUT ke semua user sekaligus
      const updatePromises = allUsers.map(u => 
        fetch(`${AUTH_API}/${u.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...u, managerBroadcast: message })
        })
      );

      await Promise.all(updatePromises);
      
      // Jika Manager juga termasuk dalam list, refresh state lokalnya
      if (user) refreshUserData();
      
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // B. STICKY NOTES (Manager -> Personal Admin/Staff)
  const sendStickyNote = async (targetUserId, content, color = "yellow") => {
    try {
      const res = await fetch(`${AUTH_API}/${targetUserId}`);
      const targetData = await res.json();

      const newNote = {
        id: Date.now().toString(),
        content,
        senderName: user?.name || "Manager",
        color,
        createdAt: new Date().toISOString()
      };

      const oldNotes = Array.isArray(targetData.personalNotes) ? targetData.personalNotes : [];
      const updatedNotes = [...oldNotes, newNote];

      await fetch(`${AUTH_API}/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetData, personalNotes: updatedNotes })
      });
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const clearNote = async (noteId) => {
    if (!user) return;
    try {
      const currentNotes = Array.isArray(user.personalNotes) ? user.personalNotes : [];
      const updatedNotes = currentNotes.filter(n => n.id !== noteId);
      
      const res = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, personalNotes: updatedNotes })
      });

      if (res.ok) {
        const updatedUser = { ...user, personalNotes: updatedNotes };
        setUser(updatedUser);
        sessionStorage.setItem("admin_user", JSON.stringify(updatedUser));
      }
    } catch (e) { console.error(e); }
  };

  // 7. LOGOUT
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
  };

  const value = {
    user, login, loginWithGoogle, logout, loading,
    updateUserOrder, updateProfile, refreshUserData, 
    sendStickyNote, clearNote, broadcastMessage,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === "admin",
    isStaff: user?.role?.toLowerCase() === "staff",
    isManager: user?.role?.toLowerCase() === "manager",
    isViewer: user?.role?.toLowerCase() === "viewer"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};