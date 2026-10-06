import { getActiveProducts, getCustomers } from "@/app/actions";
import { QuickSale } from "@/components/quick-sale";

export const dynamic = "force-dynamic";

export default async function QuickSalePage() {
  const [items, customers] = await Promise.all([
    getActiveProducts(),
    getCustomers(),
  ]);

  const products = items.map(({ product, category }) => ({
    ...product,
    categoryName: category?.name ?? product.category ?? null,
    categoryColor: category?.color ?? null,
  }));

  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nueva venta</h1>
        <p className="text-sm text-slate-500">
          Registra una venta rápida en segundos
        </p>
      </header>

      <QuickSale products={products} customers={customers} />
    </div>
  );
}
