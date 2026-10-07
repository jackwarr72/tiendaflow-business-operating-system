"use client";

import { useState, useTransition, useEffect } from "react";
import { getProducts } from "@/app/actions";
import { Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/db/schema";

export function ProductsList() {
  const [paged, setPaged] = useState<
    Awaited<ReturnType<typeof getProducts>> | null
  >(null);
  const [pending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function loadPage(p: number) {
    const res = await getProducts(p);
    startTransition(() => {
      setPaged(res);
      setPage(p);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!paged) return null;

  const { data, total, totalPages } = paged;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {total} productos en tu inventario
          {totalPages > 1 && ` · Página ${page} de ${totalPages}`}
        </span>
      </div>

      {data.length === 0 ? (
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
        <>
          <div className="grid gap-3">
            {data.map(({ product, category }) => (
              <ProductRow key={product.id} product={product} category={category} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => loadPage(page - 1)}
                disabled={page <= 1 || pending}
                className="rounded-xl bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 disabled:opacity-40 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => loadPage(page + 1)}
                disabled={page >= totalPages || pending}
                className="rounded-xl bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 disabled:opacity-40 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ProductRowProps {
  product: {
    id: number;
    name: string;
    price: string;
    cost: string | null;
    stock: number | null;
    categoryId: number | null;
    category: string | null;
    imageUrl: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    storeId: number;
  };
  category: Category | null;
}

function ProductRow({ product, category }: ProductRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
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
            <span className="text-xs text-slate-400">Sin categoría</span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-sm font-bold text-primary-600">
            ${Number(product.price).toLocaleString("es-MX")}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              (product.stock ?? 0) <= 5 ? "text-rose-600" : "text-slate-500"
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
  );
}