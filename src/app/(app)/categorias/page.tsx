import { getCategories } from "@/app/actions";
import { CategoryForm } from "@/components/category-form";
import { Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
        <p className="text-sm text-slate-500">
          Organiza tus productos con colores
        </p>
      </header>

      <CategoryForm />

      {categories.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <Tags className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No hay categorías
          </p>
          <p className="text-xs text-slate-400">
            Agrega las categorías de tu catálogo
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500">{category.color}</p>
              </div>
              <CategoryForm category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
