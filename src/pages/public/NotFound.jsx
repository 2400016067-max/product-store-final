import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-4 font-sans text-left">
      {/* Visual Effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-100 blur-3xl rounded-full opacity-40 animate-pulse"></div>
        <h1 className="relative text-[12rem] font-black text-slate-900 leading-none tracking-tighter italic opacity-10">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle size={80} className="text-indigo-600 animate-bounce" />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-4 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
          Web <span className="text-indigo-600">Eror</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed uppercase text-[10px] tracking-[0.2em]">
          Sistem tidak menemukan koordinat URL yang Anda tuju. Mohon kembali ke jalur yang benar.
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-12 flex gap-4">
        <Link to="/">
          <Button className="rounded-[1.5rem] bg-slate-900 hover:bg-indigo-600 text-white px-8 h-14 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 gap-3">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <p className="mt-20 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
        TechStore Intelligence Systems v1.1
      </p>
    </div>
  );
}