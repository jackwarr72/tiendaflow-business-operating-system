import { getCategories } from "@/app/actions";
import { ProductForm } from "@/components/product-form";
import { ProductsList } from "@/components/products-list";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">productos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/categoria"
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

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}