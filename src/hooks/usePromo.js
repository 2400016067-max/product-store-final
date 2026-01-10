import { useState, useEffect, useCallback } from "react";

/**
 * Hook kustom untuk memvalidasi status kadaluarsa promo berbasis waktu.
 * Versi Teroptimasi & Tahan Banting
 */
export const usePromo = (promoEnd) => {
  // 1. Fungsi Kalkulasi (Internal): Didefinisikan di luar agar bisa dipanggil berulang
  const calculateIsExpired = useCallback(() => {
    if (!promoEnd || promoEnd === "") return true; // Anggap expired jika tidak ada data
    
    const now = new Date();
    const end = new Date(promoEnd);
    
    // Validasi Tanggal: Jika format promoEnd salah (Invalid Date), return true (safe mode)
    if (isNaN(end.getTime())) return true; 

    return now > end;
  }, [promoEnd]);

  // 2. Lazy Initialization: Menghitung status awal LANGSUNG saat state dibuat.
  // Ini mencegah UI menampilkan "Diskon" selama milidetik pertama sebelum useEffect jalan.
  const [isExpired, setIsExpired] = useState(calculateIsExpired);

  useEffect(() => {
    // 3. Sinkronisasi State: Jalankan pengecekan setiap kali promoEnd berubah (misal: update manager)
    const currentStatus = calculateIsExpired();
    setIsExpired(currentStatus);

    if (currentStatus) return; // Jika sudah expired, tidak perlu pasang interval

    const checkStatus = () => {
      const status = calculateIsExpired();
      
      // Update state HANYA jika nilainya berubah untuk menghemat resource CPU
      setIsExpired((prev) => (prev !== status ? status : prev));
    };

    // Gunakan interval 10 detik agar countdown di ProductCard terasa lebih responsif
    const timer = setInterval(checkStatus, 10000); 

    // 4. Cleanup Memory: Mencegah kebocoran memori saat user pindah halaman
    return () => clearInterval(timer);
  }, [promoEnd, calculateIsExpired]);

  return isExpired;
};