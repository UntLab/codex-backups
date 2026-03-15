"use client";

import Link from "next/link";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <ShoppingCart className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Səbətiniz boşdur
          </h1>
          <p className="text-slate-500 mb-8">
            Kataloqdan dərman əlavə edin
          </p>
          <Link
            href="/catalog"
            className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2"
          >
            Kataloqa keçin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Səbət</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Təmizlə
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="glass-tech rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">
                  {item.product.name_az}
                </h3>
                <p className="text-sm text-slate-400 truncate">
                  {item.product.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    updateQuantity(item.product_id, item.quantity - 1)
                  }
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-slate-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.product_id, item.quantity + 1)
                  }
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="font-bold text-slate-800 w-20 text-right shrink-0">
                {(item.product.price * item.quantity).toFixed(2)} &#8380;
              </span>

              <button
                onClick={() => removeItem(item.product_id)}
                className="text-slate-300 hover:text-red-500 transition shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="glass-tech rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500">Cəmi:</span>
            <span className="text-3xl font-bold text-slate-800">
              {totalPrice().toFixed(2)} &#8380;
            </span>
          </div>
          <Link
            href="/checkout"
            className="btn-primary w-full py-4 text-center block text-sm"
          >
            Sifarişi rəsmiləşdir
          </Link>
          <Link
            href="/catalog"
            className="text-sm text-cyan-600 font-medium text-center block mt-3 hover:underline"
          >
            Alış-verişə davam et
          </Link>
        </div>
      </div>
    </div>
  );
}
