"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Truck, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [useGeo, setUseGeo] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/cart");
  }, [mounted, items.length, router]);

  function handleGeolocation() {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setUseGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUseGeo(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.product.name_az,
            quantity: i.quantity,
            price: i.product.price,
          })),
          total: totalPrice(),
          delivery_address: address,
          phone,
          latitude: coords?.lat,
          longitude: coords?.lng,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      router.push("/account/orders");
    } catch {
      alert("Sifariş zamanı xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <p className="text-slate-500">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Sifarişi Rəsmiləşdir
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-tech rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-600" />
              Çatdırılma Məlumatları
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Telefon *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Ünvan *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Çatdırılma ünvanı"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeolocation}
              className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                coords
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600"
              }`}
            >
              <MapPin className="w-4 h-4" />
              {coords ? "Lokasiya təyin edildi" : "Cari lokasiyamı istifadə et"}
            </button>
          </div>

          <div className="glass-tech rounded-2xl p-6">
            <h2 className="font-bold text-slate-800 mb-4">Sifariş Xülasəsi</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-slate-600">
                    {item.product.name_az} x{item.quantity}
                  </span>
                  <span className="font-medium text-slate-800">
                    {(item.product.price * item.quantity).toFixed(2)} &#8380;
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between">
              <span className="font-bold text-slate-800">Cəmi:</span>
              <span className="text-2xl font-bold text-slate-800">
                {totalPrice().toFixed(2)} &#8380;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
            Məlumatlarınız şifrələnmiş formada ötürülür və saxlanılır.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-sm disabled:opacity-50"
          >
            {loading ? "Gözləyin..." : "Sifarişi Təsdiqlə"}
          </button>
        </form>
      </div>
    </div>
  );
}
