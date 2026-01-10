import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  // Kita pastikan fungsi-fungsi ini tersedia jika dibutuhkan di tempat lain
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDvX7lgFRkm_-SKnsSmTrTyryZk_hS3ZI",
  authDomain: "product-store-auth-704c0.firebaseapp.com",
  projectId: "product-store-auth-704c0",
  storageBucket: "product-store-auth-704c0.firebasestorage.app",
  messagingSenderId: "381528678652",
  appId: "1:381528678652:web:543681f159a91ec683b779",
  measurementId: "G-LPDYWL20N0"
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize Auth Service
const auth = getAuth(app);

// 3. Configure Google Provider
const googleProvider = new GoogleAuthProvider();
// Memberikan pengalaman UX yang lebih baik agar user bisa memilih akun Google yang berbeda
googleProvider.setCustomParameters({ prompt: "select_account" });

// 4. Clean Exports
// Pastikan 'auth' diekspor paling pertama karena ini adalah 'jantung' autentikasi kita
export { 
  auth, 
  googleProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};

export default app;