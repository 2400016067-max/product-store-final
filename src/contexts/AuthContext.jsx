import { createContext, useContext, useState, useEffect, useCallback } from "react";
// Import tambahan untuk manual auth dari firebase/auth
import { 
  auth, 
  googleProvider, 
  signInWithPopup 
} from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // HELPER INTERNAL: Sinkronisasi State & Storage
  const syncUser = (userData) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("admin_user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("admin_user");
    }
  };

  // 1. CEK SESI AWAL (Auto-load saat refresh tab)
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

  // 2. MONITORING OTORITAS OTOMATIS (Background Sync)
  useEffect(() => {
    const verifyAuthority = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${AUTH_API}/${user.id}`);
        if (response.ok) {
          const latestData = await response.json();
          if (latestData.role !== user.role) {
            console.warn("Authority change detected!");
            syncUser(latestData);
          }
        } else if (response.status === 404) {
          logout();
        }
      } catch (e) {
        console.error("Authority Check Error:", e);
      }
    };

    let authInterval;
    if (user) {
      authInterval = setInterval(verifyAuthority, 40000);
    }
    return () => clearInterval(authInterval);
  }, [user?.id, user?.role]); 

  // 3. REFRESH DATA MANUAL
  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`);
      if (response.ok) {
        const latestData = await response.json();
        syncUser(latestData); 
        return { success: true, data: latestData };
      }
    } catch (e) {
      return { success: false };
    }
  }, [user?.id]);

  // 4. FUNGSI REGISTER MANUAL (Firebase + MockAPI) [cite: 2026-01-10]
  const registerManual = async (name, email, password) => {
    try {
      // Step A: Buat akun di Firebase Auth
      const firebaseResult = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = firebaseResult.user;

      // Step B: Simpan profil lengkap di MockAPI
      const newUser = {
        username: email, // Email digunakan sebagai username/ID unik
        password: "secured-by-firebase", // Password asli aman di Firebase
        name: name,
        role: "viewer", // Default role
        orderStatus: "Belum Ada Pesanan",
        personalNotes: [], 
        adminMessage: "Akun berhasil dibuat secara manual.",
        managerBroadcast: "",
        orderProduct: "",
        orderDate: new Date().toISOString()
      };

      const response = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const foundUser = await response.json();
      syncUser(foundUser);
      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      let msg = "Gagal membuat akun.";
      if (error.code === "auth/email-already-in-use") msg = "Email sudah terdaftar!";
      return { success: false, message: msg };
    }
  };

  // 5. FUNGSI LOGIN MANUAL (Firebase + MockAPI) [cite: 2026-01-10]
  const login = async (email, password) => {
    try {
      // Step A: Verifikasi kredensial ke Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Step B: Jika Firebase OK, ambil data profil dari MockAPI
      const response = await fetch(AUTH_API);
      const users = await response.json();
      const foundUser = users.find(u => u.username === email);

      if (foundUser) {
        syncUser(foundUser);
        return { success: true };
      } else {
        return { success: false, message: "Data profil tidak ditemukan di database." };
      }
    } catch (error) {
      console.error("Login Error:", error);
      let msg = "Email atau Password salah!";
      if (error.code === "auth/user-not-found") msg = "Akun tidak ditemukan!";
      return { success: false, message: msg };
    }
  };

  // 6. FUNGSI LOGIN GOOGLE
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
          managerBroadcast: "",
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
      syncUser(foundUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal masuk dengan Google." };
    }
  };

  // 7. UPDATE DATA PROFIL/USER
  const updateProfile = async (updates) => {
    if (!user) return { success: false, message: "Sesi berakhir." };
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...updates }),
      });
      const updatedData = await response.json();
      syncUser(updatedData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 8. UPDATE DATA PESANAN (Admin)
  const updateUserOrder = async (userId, updateData) => {
    try {
      const res = await fetch(`${AUTH_API}/${userId}`);
      const targetData = await res.json();
      const response = await fetch(`${AUTH_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetData, ...updateData, orderDate: new Date().toISOString() }),
      });
      const data = await response.json();
      if (user?.id === userId) syncUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 9. BROADCAST MASSAL
  const broadcastMessage = async (message) => {
    try {
      const res = await fetch(AUTH_API);
      const allUsers = await res.json();
      const updatePromises = allUsers.map(u => 
        fetch(`${AUTH_API}/${u.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...u, managerBroadcast: message })
        })
      );
      await Promise.all(updatePromises);
      await refreshUserData(); 
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // 10. STICKY NOTES
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
      await fetch(`${AUTH_API}/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetData, personalNotes: [...oldNotes, newNote] })
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
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, personalNotes: updatedNotes })
      });
      if (response.ok) syncUser({ ...user, personalNotes: updatedNotes });
    } catch (e) { console.error(e); }
  };

  // 11. LOGOUT
  const logout = () => {
    syncUser(null);
  };

  const value = {
    user, login, registerManual, loginWithGoogle, logout, loading,
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