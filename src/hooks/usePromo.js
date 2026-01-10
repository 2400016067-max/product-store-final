import { useState, useEffect } from "react";

/**
 * Hook kustom untuk memvalidasi status kadaluarsa promo berbasis waktu.
 * @param {string} promoEnd - String tanggal format ISO dari database MockAPI.
 * @returns {boolean} isExpired - Status true jika waktu saat ini sudah melewati promoEnd.
 */
export const usePromo = (promoEnd) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Jika tidak ada data promoEnd (string kosong), maka tidak dianggap expired
    if (!promoEnd || promoEnd === "") {
      setIsExpired(false);
      return;
    }

    const checkStatus = () => {
      const now = new Date();
      const end = new Date(promoEnd);

      // Logika SI: Bandingkan waktu sekarang dengan waktu akhir promo
      // Jika 'now' lebih besar dari 'end', maka promo sudah berakhir.
      const status = now > end;
      
      // Update state hanya jika ada perubahan untuk efisiensi render
      setIsExpired(status);
    };

    // Jalankan pengecekan pertama kali saat komponen dimuat
    checkStatus();

    // Gunakan interval untuk pengecekan real-time (setiap 60 detik)
    // Hal ini memastikan UI berubah otomatis meskipun user tidak me-refresh halaman.
    const timer = setInterval(checkStatus, 1000 * 60);

    // Bersihkan interval saat komponen dilepas (unmount) untuk mencegah memory leak
    return () => clearInterval(timer);
  }, [promoEnd]);

  return isExpired;
};