"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

const storage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    try {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product_id: product.id, product, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: "pharmatech-cart",
      storage,
    }
  )
);
