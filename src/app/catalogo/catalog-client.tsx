"use client";

import { useState } from "react";
import { ShareButton } from "@/components/share-button";
import { ShoppingBag, MessageCircle } from "lucide-react";
import type { Product, Category } from "@/db/schema";

function whatsappLink(
  product: { name: string; price: string | number },
  businessPhone: string
) {
  const text = encodeURIComponent(
    `¡Hola! Me interesa el producto *${product.name}* por $${Number(
      product.price
    ).toLocaleString("es-MX")}. ¿Sigue disponible?`
  );
  if (!businessPhone) return `#`;
  return `https://wa.me/${businessPhone.replace(/\D/g, "")}?text=${text}`;
}

export default function CatalogClient({
  products,
  categories,
  businessPhone,
}: {
  products: Array<{ product: Product; category: Category | null }>;
  categories: Category[];
  businessPhone: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter(
        (item) =>
          item.category?.name === activeCategory ||
          (!item.category && item.product.category === activeCategory)
      )
    : products;

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Catálogo</h1>
            <p className="text-xs text-slate-500">
              {products.length} productos disponibles
            </p>
          </div>
          <ShareButton />
        </div>
      </header>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="sticky top-[72px] z-10 border-b border-slate-200 bg-white/95 px-2 py-3 backdrop-blur-sm">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeCategory === null
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeCategory === category.name
                    ? "text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
                style={
                  activeCategory === category.name
                    ? { backgroundColor: category.color }
                    : undefined
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="p-8 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Aún no hay productos en el catálogo
          </p>
          <p className="text-xs text-slate-400">
            Agrega productos con foto desde la sección Productos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-3 lg:grid-cols-3">
          {filtered.map(({ product, category }) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
            >
              <div className="relative aspect-square bg-slate-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">
                    📦
                  </div>
                )}
                {category && (
                  <span
                    className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-lg font-bold text-primary-600">
                  ${Number(product.price).toLocaleString("es-MX")}
                </p>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {product.description}
                  </p>
                )}
                <a
                  href={whatsappLink(product, businessPhone)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white active:bg-green-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  Pedir por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="px-4 pt-4 text-center">
        <p className="text-xs text-slate-400">Hecho con ❤️ en TiendaFlow</p>
      </footer>
    </div>
  );
}
