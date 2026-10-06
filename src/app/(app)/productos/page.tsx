import { getProducts, getCategories } from "@/app/actions";
import { ProductForm } from "@/components/product-form";
import { Package, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [items, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500">
            {items.length} productos en tu inventario
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/categorias"
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Categorías
          </Link>
          <Link
            href="/catalogo"
            className="rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700"
          >
            Ver catálogo
          </Link>
        </div>
      </header>

      <ProductForm categories={categories} />

      {items.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No tienes productos aún
          </p>
          <p className="text-xs text-slate-400">
            Agrega tu primer producto arriba
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(({ product, category }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-2xl">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {product.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {category ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  ) : product.category ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {product.category}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Sin categoría
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm font-bold text-primary-600">
                    ${Number(product.price).toLocaleString("es-MX")}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      (product.stock ?? 0) <= 5
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    {(product.stock ?? 0) <= 5 && (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {product.stock} disponibles
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
