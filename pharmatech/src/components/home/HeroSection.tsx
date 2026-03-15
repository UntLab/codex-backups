"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, ScanLine, Camera, Search, Sparkles, TrendingUp, ShoppingCart, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  total_quantity: number;
  barcode: string;
  description: string | null;
  requires_prescription: boolean;
}

export function HeroSection() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [scanning, setScanning] = useState(false);
  const [searching, setSearching] = useState(false);
  const [prescriptionResult, setPrescriptionResult] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  async function handleSearch() {
    const query = searchValue.trim();
    if (!query) return;

    setSearching(true);
    setPrescriptionResult(null);
    setSearchResults([]);

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
      const data = await res.json();

      if (res.ok && data.products.length > 0) {
        setSearchResults(data.products);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleAddToCart(item: SearchResult) {
    const product: Product = {
      id: item.id,
      name: item.name,
      name_az: item.name,
      description: item.description || "",
      price: item.price,
      category: "",
      requires_prescription: item.requires_prescription,
      in_stock: item.total_quantity > 0,
      created_at: "",
    };
    addItem(product);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  function handlePopularClick(term: string) {
    setSearchValue(term);
    setPrescriptionResult(null);
    setSearchResults([]);
    setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=6`);
        const data = await res.json();
        if (res.ok) setSearchResults(data.products);
      } catch { /* ignore */ }
      finally { setSearching(false); }
    }, 0);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setSearchValue("Resept analiz edilir... Gözləyin...");
    setSearchResults([]);
    setPrescriptionResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setPrescriptionResult(data.error || "Xəta baş verdi.");
      } else {
        setPrescriptionResult(data.analysis);
      }
      setSearchValue("Analiz bitdi");
    } catch {
      setPrescriptionResult("Şəkil göndərilmədi. İnterneti yoxlayın.");
    } finally {
      setScanning(false);
    }
  }

  const showResults = searchResults.length > 0;
  const showPrescription = prescriptionResult !== null;

  return (
    <main className="pt-40 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-8 border border-cyan-100 shadow-sm">
          <Cpu className="w-4 h-4" />
          AI System Online v2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-8 leading-[1.1] tracking-tight">
          Sağlamlıq — bu,
          <br />
          <span className="gradient-text">Yüksək Texnologiyadır.</span>
        </h1>

        <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-normal">
          Süni intellekt və peşəkar tibbin birləşdiyi nöqtə.
          <br />
          Sizin şəxsi rəqəmsal aptekiniz.
        </p>

        <div className="max-w-2xl mx-auto relative group z-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

          <div
            className={`relative bg-white rounded-2xl p-2 pl-6 flex items-center shadow-2xl shadow-blue-900/5 ring-1 ring-slate-100 overflow-hidden ${
              scanning ? "scanning" : ""
            }`}
          >
            <div className="scanner-line" />

            <ScanLine className="text-cyan-500 w-6 h-6 mr-3 shrink-0" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Yazın və ya resept şəklini yükləyin..."
              className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 h-14 px-2 text-lg outline-none"
              disabled={scanning}
            />

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="mr-2 text-slate-400 hover:text-cyan-600 transition p-2 rounded-lg hover:bg-cyan-50"
              title="Resepti yüklə"
              disabled={scanning}
            >
              <Camera className="w-6 h-6" />
            </button>

            <button
              onClick={handleSearch}
              className="btn-primary w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              disabled={scanning || searching}
            >
              {searching ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </button>
          </div>

          {searching && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
            </div>
          )}

          {showResults && (
            <div className="mt-4 bg-white/95 backdrop-blur-xl border border-cyan-100 rounded-2xl p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Tapıldı: {searchResults.length} məhsul
                </div>
                <button
                  onClick={() => router.push(`/catalog?search=${encodeURIComponent(searchValue)}`)}
                  className="text-xs text-cyan-600 font-semibold hover:underline"
                >
                  Hamısına bax →
                </button>
              </div>

              <div className="space-y-3">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-50 rounded-xl p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.total_quantity > 0 ? "Stokda var" : "Stokda yoxdur"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="font-bold text-slate-800 text-sm">
                        {Number(item.price).toFixed(2)} &#8380;
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.total_quantity <= 0}
                        className={`p-2 rounded-lg transition ${
                          addedId === item.id
                            ? "bg-green-500 text-white"
                            : item.total_quantity <= 0
                            ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                            : "bg-cyan-500 text-white hover:bg-cyan-600"
                        }`}
                      >
                        {addedId === item.id ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showResults && !searching && searchValue.trim() && !scanning && !showPrescription && searchResults.length === 0 && addedId === null && (
            <div className="mt-4 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-lg text-center">
              <p className="text-slate-400 text-sm">Axtarış üçün Enter basın və ya 🔍 düyməsini klikləyin</p>
            </div>
          )}

          {showPrescription && (
            <div className="mt-4 bg-white/95 backdrop-blur-xl border border-cyan-100 rounded-2xl p-6 shadow-2xl text-left">
              <div className="flex items-center gap-2 mb-3 text-cyan-700 font-bold">
                <Sparkles className="w-4 h-4" />
                AI Analizi:
              </div>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {prescriptionResult}
              </div>
            </div>
          )}

          <div className="text-sm text-slate-400 mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-500" />
              Populyar:
            </span>
            {["Nurofen", "Omega-3", "Vitamin"].map((term) => (
              <span
                key={term}
                onClick={() => handlePopularClick(term)}
                className="hover:text-cyan-600 cursor-pointer transition border-b border-transparent hover:border-cyan-200"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
