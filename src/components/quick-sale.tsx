"use client";

import { useState, useTransition } from "react";
import { createOrder } from "@/app/actions";
import type { Customer } from "@/db/schema";
import { Minus, Plus, Trash2, ShoppingBag, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const channels = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook_marketplace", label: "Facebook Marketplace" },
  { value: "in_person", label: "Presencial" },
  { value: "other", label: "Otro" },
];

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface SaleProduct {
  id: number;
  name: string;
  price: string;
  stock: number | null;
  imageUrl: string | null;
  categoryName: string | null;
  categoryColor: string | null;
}

export function QuickSale({
  products,
  customers,
}: {
  products: SaleProduct[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [customerId, setCustomerId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function addToCart(product: SaleProduct) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id!,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleSubmit() {
    if (cart.length === 0) return;

    startTransition(async () => {
      await createOrder(
        {
          customerId: customerId ? Number(customerId) : null,
          channel: channel as any,
          status: "completed",
          paymentStatus: "paid",
          notes: notes || null,
        },
        cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      );
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-green-50 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-green-800">
          ¡Venta registrada!
        </h2>
        <p className="text-sm text-green-700">
          Total: ${total.toLocaleString("es-MX")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Channel & customer */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Canal de venta
            </label>
            <div className="grid grid-cols-3 gap-2">
              {channels.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setChannel(c.value)}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold transition-colors ${
                    channel === c.value
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cliente (opcional)
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Cliente ocasional</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Dirección de entrega, horario, etc."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Productos seleccionados
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    ${item.price.toLocaleString("es-MX")} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="rounded-full bg-slate-100 p-1 text-slate-600"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="rounded-full bg-slate-100 p-1 text-slate-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-2 rounded-full p-1 text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toLocaleString("es-MX")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Product selector */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Agregar productos
        </h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />

        {products.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            Primero agrega productos desde el menú Productos.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No se encontraron productos.
          </p>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-y-auto no-scrollbar">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                disabled={(product.stock ?? 0) <= 0}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-left active:bg-slate-100 disabled:opacity-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0
                      ? `Quedan ${product.stock}`
                      : (product.stock ?? 0) === 0
                      ? "Agotado"
                      : `${product.stock} disponibles`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-600">
                    ${Number(product.price).toLocaleString("es-MX")}
                  </span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={cart.length === 0 || pending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 text-base font-bold text-white shadow-xl shadow-primary-600/25 disabled:opacity-60 active:scale-[0.98] transition-transform"
      >
        <ShoppingBag className="h-5 w-5" />
        {pending ? "Guardando..." : `Cobrar $${total.toLocaleString("es-MX")}`}
      </button>
    </div>
  );
}
