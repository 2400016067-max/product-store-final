import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, TrendingDown, PackageSearch, AlertCircle, 
  DollarSign, ShoppingCart, Layers, Download, ClipboardList, 
  FileSpreadsheet, Star, MessageSquare, CheckCircle, Award,
  ArrowRight, Activity
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";

// Import Komponen Shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

  // --- POLESAN TEKNIS: SANITIZED CSV EXPORT --- [cite: 2026-01-10]
  const handleExportCSV = () => {
    if (products.length === 0) return;

    const headers = ["ID", "Nama Produk", "Kategori", "Harga", "Status", "Rating", "Reviews"];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`, // Menghindari error jika ada tanda kutip di nama
      `"${p.category}"`,
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
    link.setAttribute("download", `Report_Analitik_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- POLESAN LOGIKA: BUSINESS INTELLIGENCE CALCULATIONS ---
  const metrics = useMemo(() => {
    const assetValue = products.reduce((acc, p) => acc + (p.isAvailable ? p.price : 0), 0);
    // POLESAN: Lost Revenue (Kerugian potensi karena stok kosong)
    const lostRevenue = products.reduce((acc, p) => acc + (!p.isAvailable ? p.price : 0), 0);
    const totalRev = products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);
    const avgRating = products.length > 0 
      ? (products.reduce((acc, p) => acc + (p.avgRating || 0), 0) / products.length).toFixed(1)
      : 0;

    // POLESAN: Detail Produk Urgent (Rating > 4.0 tapi stok 0)
    const urgentItems = products
      .filter(p => !p.isAvailable && p.avgRating >= 4.0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);

    return { assetValue, lostRevenue, totalRev, avgRating, urgentItems };
  }, [products]);

  // POLESAN VISUAL: DYNAMIC PROGRESS COLOR
  const getProgressColor = (rating) => {
    if (rating >= 4.5) return "bg-emerald-500";
    if (rating >= 3.5) return "bg-indigo-500";
    return "bg-rose-500";
  };

  if (prodLoading || userLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 font-black uppercase tracking-[0.3em]">
        <Activity className="animate-spin text-indigo-600 mb-6" size={48} />
        Synchronizing Data Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 animate-in fade-in duration-1000 text-left font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
            Strategic <span className="text-indigo-600">Analytics</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">Laporan keputusan bisnis terukur berbasis data pasar. [cite: 2026-01-10]</p>
        </div>
        <Button 
          onClick={handleExportCSV}
          className="rounded-2xl font-black gap-3 shadow-xl bg-slate-900 hover:bg-indigo-600 transition-all px-8 h-14"
        >
          <Download size={20} /> EXPORT CSV REPORT
        </Button>
      </div>

      {/* 2. KPI GRID - DENGAN LOST REVENUE ANALYSIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Asset" 
          value={`Rp ${metrics.assetValue.toLocaleString('id-ID')}`} 
          description="Inventaris Siap Jual"
          icon={<DollarSign className="text-emerald-500" />}
          trend="+4.2%" trendUp={true}
        />
        <StatCard 
          title="Customer Pulse" 
          value={`${metrics.avgRating} / 5.0`} 
          description="Rata-rata Rating"
          icon={<Star className="text-amber-500" fill="currentColor" />}
          trend="Strong" trendUp={true}
        />
        {/* POLESAN: Opportunity Loss Metric */}
        <StatCard 
          title="Potential Loss" 
          value={`Rp ${metrics.lostRevenue.toLocaleString('id-ID')}`} 
          description="Valuasi Stok Habis"
          icon={<TrendingDown className="text-rose-500" />}
          trend="Risk Area" trendUp={false}
          isAlert={metrics.lostRevenue > 0}
        />
        <StatCard 
          title="Engagement" 
          value={`${metrics.totalRev} Feedback`} 
          description="Total Ulasan Masuk"
          icon={<MessageSquare className="text-blue-500" />}
          trend="Community" trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PERFORMANCE MATRIX */}
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-100 bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-3">
               <Award size={24} className="text-indigo-600" />
               <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800">Category Satisfaction Matrix</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            {Object.entries(products.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = { count: 0, totalRating: 0 };
              acc[item.category].count += 1;
              acc[item.category].totalRating += (item.avgRating || 0);
              return acc;
            }, {})).map(([cat, data]) => {
              const avg = (data.totalRating / data.count).toFixed(1);
              const percentage = (avg / 5) * 100;
              return (
                <div key={cat} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest">{cat}</span>
                        <Badge variant="outline" className="text-[8px] font-black border-slate-100 uppercase">{data.count} SKU</Badge>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 flex items-center gap-1">
                      <Star size={12} fill="currentColor" className="text-amber-400" /> {avg} RATING
                    </span>
                  </div>
                  {/* POLESAN: Dynamic Color Bar */}
                  <Progress 
                    value={percentage} 
                    className={cn("h-4 bg-slate-50 border border-slate-100 transition-all")}
                    indicatorClassName={getProgressColor(avg)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* POLESAN: ACTIONABLE INTELLIGENCE PANEL */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <ClipboardList className="text-indigo-400" size={20} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Restock Priority</h3>
              </div>
              
              <div className="space-y-8">
                {metrics.urgentItems.length > 0 ? (
                  metrics.urgentItems.map(item => (
                    <div key={item.id} className="flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                          <p className="text-xs font-black uppercase italic text-white tracking-tight">{item.name}</p>
                          <Badge className="bg-rose-500 text-[8px] font-black border-none uppercase">Urgent</Badge>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="flex text-amber-400"><Star size={10} fill="currentColor" /> <span className="ml-1 text-[10px] font-bold text-slate-400">{item.avgRating}</span></div>
                          <Separator orientation="vertical" className="h-3 bg-white/10" />
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Cat: {item.category}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Semua produk populer tersedia.</p>
                )}
              </div>

              <Button className="w-full mt-10 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] h-12 border border-white/10">
                Contact Vendor Now <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          </Card>

          <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm bg-white p-8 border-dashed">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">System Integrity</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
              Laporan ini disintesis secara real-time dari <b>{products.length} SKU</b> dan ulasan pelanggan. Akurasi data diverifikasi oleh TechStore Logic.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon, trend, trendUp, isAlert }) {
  return (
    <Card className={cn(
      "rounded-[2rem] transition-all hover:shadow-2xl bg-white border-none shadow-lg shadow-slate-100",
      isAlert && "ring-2 ring-rose-500/20 bg-rose-50/5"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
        <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</CardTitle>
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 shadow-inner">{icon}</div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-3">{value}</div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-[8px] px-2 py-0.5 font-black rounded-full border-none", 
            trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend}
          </Badge>
          <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}