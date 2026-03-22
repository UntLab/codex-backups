"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ShoppingCart, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types";

const CATEGORIES = [
  { label: "Hamısı", value: "" },
  { label: "A tipi", value: "A" },
  { label: "B tipi", value: "B" },
  { label: "C tipi", value: "C" },
];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const [addedId, setAddedId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      params.set("page", String(page));
      params.set("limit", "24");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(
          data.products.map((p: Record<string, unknown>) => ({
            id: p.id,
            name: p.name,
            name_az: p.name,
            description: p.description || "",
            price: Number(p.price),
            category: (p.product_type as string) || "",
            image_url: p.image_url || "",
            requires_prescription: Boolean(p.requires_prescription),
            in_stock: Number(p.total_quantity) > 0,
            created_at: "",
          }))
        );
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  function handleAdd(product: Product) {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Dərman Kataloqu
          </h1>
          <p className="text-slate-500">
            {total.toLocaleString()} sertifikatlaşdırılmış məhsul
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dərman adı axtarın..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition ${
                  category === cat.value
                    ? "bg-cyan-500 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">
              Məhsul tapılmadı
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card-tech p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      {product.in_stock ? (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          Stokda var
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                          Stokda yoxdur
                        </span>
                      )}
                      {product.requires_prescription && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                          Reseptlə
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-slate-500 mb-4">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-2xl font-bold text-slate-800">
                      {product.price.toFixed(2)}{" "}
                      <span className="text-base text-slate-400">&#8380;</span>
                    </span>
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={!product.in_stock}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                        addedId === product.id
                          ? "bg-green-500 text-white"
                          : !product.in_stock
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "btn-primary"
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Əlavə edildi
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Səbətə
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:border-cyan-300 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-slate-600 font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:border-cyan-300 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
