// src/utils/exportUtils.js

export const exportToCSV = (data, fileName, headers) => {
  // 1. Membuat Header (Baris pertama di Excel)
  // headers adalah array: ['Nama Produk', 'Kategori', 'Harga']
  const headerRow = headers.join(',') + '\n';

  // 2. Mengolah Data JSON menjadi Baris CSV
  const csvRows = data.map((item) => {
    // Kita ambil nilai berdasarkan urutan header yang kita mau
    // Kita gunakan .map lagi untuk memastikan tiap kolom diproses
    return Object.values(item)
      .map((value) => {
        // LOGIKA KRITIS: Menangani tanda koma dalam teks
        // Jika ada tanda koma, kita bungkus teksnya dengan tanda kutip ganda ""
        // Agar Excel tidak menganggapnya sebagai kolom baru
        const stringValue = String(value).replace(/"/g, '""'); // Handle tanda kutip di dalam teks
        return `"${stringValue}"`; 
      })
      .join(',');
  }).join('\n');

  // 3. Menggabungkan Header dan Data
  const fullCsv = headerRow + csvRows;

  // 4. Proses Download (Mekanisme "Link Siluman")
  const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};