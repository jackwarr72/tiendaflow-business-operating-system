"use client";

import { useState, useTransition, useLayoutEffect, Suspense } from "react";
import { confirmResetPasswordAction, updatePasswordAction } from "@/app/auth/actions";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const [token] = useState(() => searchParams.get("token") || "");
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // Mounted check for SSR hydration safety - use setTimeout to avoid sync setState
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("Mínimo 8 caracteres");
      return;
    }
    startTransition(async () => {
      const res = await confirmResetPasswordAction(token, password);
      if (!res.ok) setError(res.error);
      else setSuccess(true);
    });
  }

  async function handleFirstLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("Mínimo 8 caracteres");
      return;
    }
    startTransition(async () => {
      const res = await updatePasswordAction(password);
      if (!res.ok) setError("No se pudo actualizar");
      else setSuccess(true);
    });
  }

  const isFirstLogin = !token;

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="text-center mb-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
          <Lock className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isFirstLogin ? "Define tu contraseña" : "Restablecer contraseña"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isFirstLogin
            ? "Es tu primer ingreso. Elige una contraseña segura."
            : "Elige una nueva contraseña para tu cuenta."}
        </p>
      </div>

      <form
        onSubmit={isFirstLogin ? handleFirstLogin : handleSubmit}
        className="space-y-4"
      >
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 pr-10"
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Confirmar contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            disabled={pending}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>

      {success && (
        <div className="mt-6 text-center text-sm text-green-700">
          Contraseña guardada.{" "}
          <Link href="/" className="font-semibold">
            Ir al inicio
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}