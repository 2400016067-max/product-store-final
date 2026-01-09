import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, PackageSearch, AlertCircle, 
  DollarSign, ShoppingCart, Layers, Download, Info, ClipboardList, FileSpreadsheet 
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";

// Import Komponen Shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AnalyticsReport() {
  const { products, loading: prodLoading } = useProducts();
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetch("https://694615d7ed253f51719d04d2.mockapi.io/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setUserLoading(false);
      });
  }, []);

  // --- LOGIKA EKSPOR DATA (CSV) --- [cite: 2025-09-29]
  const handleExportCSV = () => {
    if (products.length === 0) return alert("Data tidak tersedia.");

    // Header CSV
    const headers = ["ID", "Nama Produk", "Kategori", "Harga (IDR)", "Ketersediaan"];
    
    // Baris data
    const rows = products.map(p => [
      p.id,
      `"${p.name}"`, // Menggunakan kutip agar nama dengan koma tidak berantakan
      p.category,
      p.price,
      p.isAvailable ? "Tersedia" : "Stok Habis"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.setAttribute("download", `Laporan_Strategis_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LOGIKA ANALISIS DATA ---
  const totalAssetValue = products.reduce((acc, item) => acc + (item.isAvailable ? item.price : 0), 0);
  const outOfStockCount = products.filter(p => !p.isAvailable).length;
  const activeOrders = users.filter(u => u.orderProduct && u.orderStatus !== "Belum Ada Pesanan" && !u.orderStatus.includes("orderStatus")).length;

  const categoryStats = products.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  // Menentukan kategori paling dominan untuk Insight
  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  if (prodLoading || userLoading) {
    return <div className="p-10 flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">
      <FileSpreadsheet size={48} className="mb-4" />
      Processing Data Intelligence...
    </div>;
  }

  return (
    <div className="space-y-8 p-1 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-900">
            Strategic <span className="text-indigo-600">Analytics</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium italic">Data insight real-time untuk pengambilan keputusan manajerial.</p>
        </div>
        <Button 
          onClick={handleExportCSV}
          className="rounded-xl font-black gap-2 shadow-lg shadow-indigo-100 bg-slate-900 hover:bg-indigo-600 transition-all active:scale-95 px-6 h-12"
        >
          <Download size={18} /> EXPORT CSV
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Nilai Aset Tersedia" 
          value={`Rp ${totalAssetValue.toLocaleString('id-ID')}`} 
          description="Estimasi total harga inventaris aktif"
          icon={<DollarSign className="text-emerald-500" />}
          trend="+3.1%"
          trendUp={true}
        />
        <StatCard 
          title="Katalog Aktif" 
          value={`${products.length} SKU`} 
          description="Total varian produk terdaftar"
          icon={<Layers className="text-blue-500" />}
          trend="Target Met"
          trendUp={true}
        />
        <StatCard 
          title="Pesanan Berjalan" 
          value={activeOrders} 
          description="Antrean transaksi di sistem"
          icon={<ShoppingCart className="text-indigo-500" />}
          trend="High Demand"
          trendUp={true}
        />
        <StatCard 
          title="Varian Kosong" 
          value={outOfStockCount} 
          description="Produk yang butuh restok"
          icon={<AlertCircle className="text-red-500" />}
          trend="Urgent"
          trendUp={false}
          isAlert={outOfStockCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Distribusi Produk per Kategori */}
        <Card className="lg:col-span-2 rounded-[2rem] border-slate-200/60 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <PackageSearch size={18} className="text-indigo-600" /> 
              Inventory Diversity
            </CardTitle>
            <CardDescription>Persentase sebaran produk berdasarkan kategori bisnis utama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(categoryStats).map(([cat, count]) => {
              const percentage = Math.round((count / products.length) * 100);
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter">
                    <span className="text-slate-600">{cat}</span>
                    <span className="text-indigo-600">{percentage}% ({count} Items)</span>
                  </div>
                  <Progress value={percentage} className="h-3 bg-slate-100" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Managerial Insight (Dynamic) */}
        <Card className="rounded-[2.5rem] bg-slate-900 text-slate-50 border-none shadow-2xl relative overflow-hidden">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-indigo-400">
              <ClipboardList size={18} />
              Strategic Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Badge variant="outline" className="text-[9px] mb-2 border-amber-500 text-amber-400 font-black">LOGISTICS</Badge>
              <p className="text-xs leading-relaxed text-slate-300 font-medium">
                Terdapat <b>{outOfStockCount} varian</b> yang kosong. Fokus restok pada kategori <b>{topCategory}</b> untuk menjaga arus kas.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Badge variant="outline" className="text-[9px] mb-2 border-indigo-500 text-indigo-400 font-black">MARKET</Badge>
              <p className="text-xs leading-relaxed text-slate-300 font-medium">
                Sistem mendeteksi <b>{activeOrders} pesanan aktif</b>. Pastikan tim staff memproses status sebelum akhir hari kerja.
              </p>
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon, trend, trendUp, isAlert }) {
  return (
    <Card className={`rounded-[2rem] transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-slate-200/60 shadow-sm bg-white ${isAlert ? 'border-red-200 bg-red-50/10' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-3 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tighter text-slate-900">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`text-[9px] px-1.5 h-4 font-black rounded-lg ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </Badge>
          <p className="text-[10px] text-muted-foreground font-semibold italic">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}