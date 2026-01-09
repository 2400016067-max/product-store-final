import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, PackageSearch, AlertCircle, 
  DollarSign, ShoppingCart, Layers, Download, ClipboardList, 
  FileSpreadsheet, Star, MessageSquare, CheckCircle, Award
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

  // --- LOGIKA EKSPOR DATA KAYA (RICH DATA CSV) --- [cite: 2025-09-29]
  const handleExportCSV = () => {
    if (products.length === 0) return alert("Data tidak tersedia.");

    const headers = ["ID", "Nama Produk", "Kategori", "Harga", "Status Stok", "Rating", "Jumlah Ulasan"];
    const rows = products.map(p => [
      p.id,
      `"${p.name}"`,
      p.category,
      p.price,
      p.isAvailable ? "Tersedia" : "Habis",
      p.avgRating || 0,
      p.reviews?.length || 0
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Analisis_Sentimen_TechStore_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LOGIKA ANALISIS DATA INTELLIGENCE --- [cite: 2025-11-02]
  const totalAssetValue = products.reduce((acc, item) => acc + (item.isAvailable ? item.price : 0), 0);
  const outOfStockCount = products.filter(p => !p.isAvailable).length;
  const activeOrders = users.filter(u => u.orderProduct && u.orderStatus !== "Belum Ada Pesanan").length;

  // Analisis Kepuasan & Ulasan [cite: 2025-09-29]
  const totalReviews = products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);
  const globalAvgRating = products.length > 0 
    ? (products.reduce((acc, p) => acc + (p.avgRating || 0), 0) / products.length).toFixed(1)
    : 0;

  // Temuan Strategis: Produk Rating Tinggi tapi Stok Habis (Urgent Restock) [cite: 2025-09-29]
  const highDemandRestock = products.filter(p => !p.isAvailable && p.avgRating >= 4.5);

  // Performa Per Kategori
  const categoryData = products.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, totalRating: 0 };
    }
    acc[item.category].count += 1;
    acc[item.category].totalRating += (item.avgRating || 0);
    return acc;
  }, {});

  if (prodLoading || userLoading) {
    return <div className="p-10 flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">
      <FileSpreadsheet size={48} className="mb-4 text-indigo-600" />
      Synthesizing System Intelligence...
    </div>;
  }

  return (
    <div className="space-y-8 p-1 animate-in fade-in duration-1000 text-left font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
            Strategic <span className="text-indigo-600">Analytics</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Transformasi data ulasan menjadi keputusan bisnis terukur. [cite: 2025-11-02]</p>
        </div>
        <Button 
          onClick={handleExportCSV}
          className="rounded-2xl font-black gap-3 shadow-xl shadow-indigo-100 bg-slate-900 hover:bg-indigo-600 transition-all active:scale-95 px-8 h-14"
        >
          <Download size={20} /> DOWNLOAD DATA ANALYTICS
        </Button>
      </div>

      {/* 2. KPI GRID - TERINTEGRASI RATING */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Kapitalisasi Aset" 
          value={`Rp ${totalAssetValue.toLocaleString('id-ID')}`} 
          description="Nilai inventaris siap jual"
          icon={<DollarSign className="text-emerald-500" />}
          trend="+4.2%" trendUp={true}
        />
        <StatCard 
          title="Customer Satisfaction" 
          value={`${globalAvgRating} / 5.0`} 
          description="Rata-rata rating katalog"
          icon={<Star className="text-amber-500" fill="currentColor" />}
          trend="Strong" trendUp={true}
        />
        <StatCard 
          title="Feedback Volume" 
          value={`${totalReviews} Ulasan`} 
          description="Total partisipasi pelanggan"
          icon={<MessageSquare className="text-blue-500" />}
          trend="Engagement" trendUp={true}
        />
        <StatCard 
          title="Stok Kritis" 
          value={outOfStockCount} 
          description="Varian butuh restok segera"
          icon={<AlertCircle className="text-red-500" />}
          trend="Inventory" trendUp={false}
          isAlert={outOfStockCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performa Rating per Kategori */}
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-100 bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3 text-slate-800">
              <Award size={22} className="text-indigo-600" /> 
              Category Performance Matrix
            </CardTitle>
            <CardDescription>Analisis korelasi jumlah produk dan kepuasan pelanggan per kategori. [cite: 2025-11-02]</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {Object.entries(categoryData).map(([cat, data]) => {
              const avg = (data.totalRating / data.count).toFixed(1);
              const percentage = (avg / 5) * 100;
              return (
                <div key={cat} className="group">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                    <div className="flex gap-4 items-center">
                        <span className="text-slate-400">{cat}</span>
                        <Badge variant="outline" className="text-[9px] font-bold">{data.count} SKU</Badge>
                    </div>
                    <span className="text-indigo-600 flex items-center gap-1"><Star size={10} fill="currentColor" /> {avg} Avg Rating</span>
                  </div>
                  <Progress value={percentage} className="h-4 bg-slate-50 transition-all group-hover:scale-[1.01]" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Intelligence Insight Panel (Logic Based) [cite: 2025-09-29] */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardList className="text-indigo-400" size={20} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Strategic Intelligence</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Badge className="bg-rose-500 text-white text-[9px] font-black uppercase border-none">Urgent Restock</Badge>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">
                    Terdeteksi <b>{highDemandRestock.length} produk populer</b> (Rating &gt; 4.5) yang sedang <b>Stok Habis</b>. Segera hubungi vendor untuk menghindari hilangnya potensi penjualan.
                  </p>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-3">
                  <Badge className="bg-indigo-600 text-white text-[9px] font-black uppercase border-none">Quality Alert</Badge>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">
                    Store-wide rating berada di angka <b>{globalAvgRating}</b>. Pastikan tim customer service memantau ulasan negatif untuk perbaikan layanan.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          </Card>

          {/* Customer Trust Indicator */}
          <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm bg-white p-8 border-dashed">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Feedback Density</h3>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 font-medium italic">
                Sistem telah mengumpulkan <b>{totalReviews} ulasan</b> dari pelanggan setia TechStore. Data ini mencukupi untuk analisis tren belanja 2026.
              </p>
              <div className="flex -space-x-2 overflow-hidden">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-komponen Reusable dengan tema modern [cite: 2025-12-24]
function StatCard({ title, value, description, icon, trend, trendUp, isAlert }) {
  return (
    <Card className={`rounded-[2rem] transition-all hover:-translate-y-1 duration-300 border-none shadow-xl shadow-slate-100 bg-white ${isAlert ? 'ring-2 ring-rose-500/20' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
        <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          {title}
        </CardTitle>
        <div className="p-3 bg-slate-50 rounded-2xl shadow-inner text-slate-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="text-2xl font-black tracking-tighter text-slate-900">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`text-[9px] px-2 py-0.5 font-black rounded-full border-none ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </Badge>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}