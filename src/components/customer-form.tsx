"use client";

import { useState, useTransition } from "react";
import { createCustomer } from "@/app/actions";
import { Plus, X } from "lucide-react";

const channels = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook_marketplace", label: "Facebook Marketplace" },
  { value: "in_person", label: "Presencial" },
  { value: "other", label: "Otro" },
];

export function CustomerForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createCustomer({
        name: String(formData.get("name")),
        phone: formData.get("phone") ? String(formData.get("phone")) : null,
        email: formData.get("email") ? String(formData.get("email")) : null,
        socialHandle: formData.get("socialHandle")
          ? String(formData.get("socialHandle"))
          : null,
        preferredChannel: String(formData.get("preferredChannel")) as any,
        notes: formData.get("notes") ? String(formData.get("notes")) : null,
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
        Agregar cliente
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Nuevo cliente</h3>
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
            placeholder="Ej. María López"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Canal preferido
          </label>
          <select
            name="preferredChannel"
            defaultValue="whatsapp"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            {channels.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Teléfono
            </label>
            <input
              name="phone"
              placeholder="55 1234 5678"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Usuario red social
            </label>
            <input
              name="socialHandle"
              placeholder="@maria.tienda"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Notas
          </label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Dirección, preferencias, etc."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cliente"}
      </button>
    </form>
  );
}
