"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory } from "@/app/actions";
import { Plus, X, Check } from "lucide-react";
import type { Category } from "@/db/schema";

const presetColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#94a3b8",
  "#1e293b",
];

export function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [color, setColor] = useState(category?.color ?? "#6366f1");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const data = {
        name: String(formData.get("name")),
        color,
      };
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      setOpen(false);
      onDone?.();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 active:bg-slate-50"
      >
        {category ? (
          <>
            <Plus className="h-4 w-4" /> Editar categoría
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Agregar categoría
          </>
        )}
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          {category ? "Editar categoría" : "Nueva categoría"}
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nombre
          </label>
          <input
            name="name"
            required
            defaultValue={category?.name}
            placeholder="Ej. Ropa"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Color
          </label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`relative aspect-square rounded-xl border-2 transition-all ${
                  color === c ? "border-slate-900 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              >
                {color === c && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 rounded border-0 p-0"
            />
            <span className="text-xs text-slate-500">{color}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 disabled:opacity-60"
      >
        {pending
          ? "Guardando..."
          : category
          ? "Actualizar categoría"
          : "Guardar categoría"}
      </button>
    </form>
  );
}
