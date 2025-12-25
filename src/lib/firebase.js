import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDvX7lgFRkm_-SKnsSmTrTyryZk_hS3ZI",
  authDomain: "product-store-auth-704c0.firebaseapp.com",
  projectId: "product-store-auth-704c0",
  storageBucket: "product-store-auth-704c0.firebasestorage.app",
  messagingSenderId: "381528678652",
  appId: "1:381528678652:web:543681f159a91ec683b779",
  measurementId: "G-LPDYWL20N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Tambahkan prompt agar user selalu bisa memilih akun Google mereka
googleProvider.setCustomParameters({ prompt: "select_account" });

export { signInWithPopup };