"use client";

import { useState, useTransition } from "react";
import { createExpense } from "@/app/actions";
import { Plus, X } from "lucide-react";

const categories = [
  "Insumos",
  "Transporte",
  "Envío",
  "Publicidad",
  "Equipo",
  "Otros",
];

export function ExpenseForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createExpense({
        description: String(formData.get("description")),
        amount: String(formData.get("amount")),
        category: formData.get("category")
          ? String(formData.get("category"))
          : null,
      });
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 active:bg-slate-50"
      >
        <Plus className="h-4 w-4" />
        Registrar gasto
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Nuevo gasto</h3>
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
            Descripción
          </label>
          <input
            name="description"
            required
            placeholder="Ej. Compra de bolsas"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Monto
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Categoría
            </label>
            <select
              name="category"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Seleccionar</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/20 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar gasto"}
      </button>
    </form>
  );
}
