"use client";

import { useState, useTransition, useRef } from "react";
import { createProduct } from "@/app/actions";
import { Plus, X, Camera, Upload, Trash2 } from "lucide-react";
import type { Category } from "@/db/schema";
import Link from "next/link";

export function ProductForm({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createProduct(
        {
          name: String(formData.get("name")),
          description: formData.get("description")
            ? String(formData.get("description"))
            : null,
          price: String(formData.get("price")),
          cost: formData.get("cost") ? String(formData.get("cost")) : "0",
          stock: Number(formData.get("stock") || 0),
          categoryId: formData.get("categoryId")
            ? Number(formData.get("categoryId"))
            : null,
        },
        imageFile
      );
      setOpen(false);
      setPreview(null);
      setImageFile(null);
    });
  }

  function reset() {
    setOpen(false);
    setPreview(null);
    setImageFile(null);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 active:bg-slate-50"
      >
        <Plus className="h-4 w-4" />
        Agregar producto
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Nuevo producto</h3>
        <button
          type="button"
          onClick={reset}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Image capture */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Foto del producto
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {preview ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={preview}
                alt="Vista previa"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute right-2 top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 py-6 text-sm font-semibold text-slate-600 active:bg-slate-100"
              >
                <Camera className="h-6 w-6" />
                Tomar foto
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 py-6 text-sm font-semibold text-slate-600 active:bg-slate-100"
              >
                <Upload className="h-6 w-6" />
                Subir foto
              </button>
            </div>
          )}
          <p className="mt-1 text-center text-[10px] text-slate-400">
            En celular usa &quot;Tomar foto&quot; para abrir la cámara
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Ej. Tote bag negra"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Precio de venta
            </label>
            <input
              name="price"
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
              Costo
            </label>
            <input
              name="cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={0}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Categoría
            </label>
            <select
              name="categoryId"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Link
              href="/categorias"
              className="mt-1 inline-block text-[10px] font-medium text-primary-600"
            >
              Gestionar categorías
            </Link>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Descripción
          </label>
          <textarea
            name="description"
            rows={2}
            placeholder="Opcional"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
