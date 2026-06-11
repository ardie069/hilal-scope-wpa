"use client";

import { useState } from "react";
import { fetchHijriSearch } from "@/lib/api/hijri";
import { useMounted } from "@/hooks/use-mounted";

export default function SearchClient() {
  const mounted = useMounted();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHijriSearch(date);
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal melakukan pencarian.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background-light" />;
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-12 animate-in fade-in duration-1000 max-w-4xl mx-auto">
      <header className="space-y-4 text-center">
        <div className="flex justify-center items-center gap-4">
          <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md">
            🔍
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">
            Pencarian Tanggal
          </h1>
        </div>
        <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          Cari konversi tanggal Masehi ke Hijriyah secara cepat menggunakan kalender tabular.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered input-lg w-full sm:w-80 rounded-2xl bg-white/50 dark:bg-card-dark focus:border-primary transition-all shadow-sm"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary btn-lg w-full sm:w-auto rounded-2xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
        >
          {loading ? "Mencari..." : "Cari Tanggal"}
        </button>
      </form>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in zoom-in duration-500 mx-auto w-full">
          <div className="bg-error text-error-content rounded-xl p-2 shrink-0 shadow-lg shadow-error/20">
            <span className="text-xl font-bold">⚠️</span>
          </div>
          <div>
            <h3 className="font-black text-error">Gagal Mencari</h3>
            <p className="text-error/80 text-sm mt-1 leading-relaxed font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white/40 dark:bg-card-dark/40 backdrop-blur-3xl p-8 sm:p-10 rounded-[2rem] border border-white/40 dark:border-white/5 shadow-soft animate-in slide-in-from-bottom-8 duration-700 w-full relative overflow-hidden group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-emerald-500/5 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative flex flex-col items-center justify-center text-center gap-6">
            <div className="px-4 py-1.5 rounded-full border bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">
              Hasil Konversi Tabular
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-gray-400">
                Tanggal Hijriyah
              </p>
              <h2 className="text-4xl sm:text-6xl font-black text-primary tracking-tighter drop-shadow-sm">
                {result.hijri_date?.day} {result.hijri_date?.month_name} {result.hijri_date?.year} H
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
