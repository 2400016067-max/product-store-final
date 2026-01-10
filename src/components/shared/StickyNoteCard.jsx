import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Trash2,
  Loader2,
  Pin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StickyNoteCard({ note }) {
  const { clearNote } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  // LOGIKA AUDIT: Menentukan warna berdasarkan data dari Manager [cite: 2025-09-29]
  const colorMap = {
    yellow: "bg-amber-50 border-amber-200 text-amber-900 shadow-amber-100/50",
    blue: "bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100/50",
    pink: "bg-rose-50 border-rose-200 text-rose-900 shadow-rose-100/50",
    green: "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100/50",
  };

  const handleClear = async () => {
    setIsClearing(true);
    // Memanggil fungsi dari AuthContext untuk menghapus note di MockAPI [cite: 2025-11-02]
    await clearNote(note.id);
    setIsClearing(false);
  };

  return (
    <Card className={cn(
      "relative group transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 rounded-[1.5rem] shadow-xl overflow-hidden text-left",
      "rotate-[-1deg] hover:rotate-0", // Efek miring organik
      colorMap[note.color] || colorMap.yellow
    )}>
      {/* Dekorasi Pin (Kesan Sticky Note) [cite: 2025-09-29] */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
        <Pin size={16} className="fill-current" />
      </div>

      <CardContent className="p-6 pt-10">
        <div className="flex flex-col h-full gap-4">
          
          {/* SENDER INFO */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/50 rounded-lg backdrop-blur-sm">
                <User size={12} className="opacity-70" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                Instruksi: {note.senderName}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-40">
              <Clock size={10} />
              <span className="text-[8px] font-bold">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* MESSAGE CONTENT */}
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed italic">
              "{note.content}"
            </p>
          </div>

          {/* ACTION: TANDAI SELESAI [cite: 2025-09-29] */}
          <div className="mt-2 border-t border-current/10 pt-4 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              disabled={isClearing}
              className="h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest gap-2 bg-white/40 hover:bg-white/80 transition-all active:scale-90"
            >
              {isClearing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Arsipkan Tugas
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}