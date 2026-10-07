"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  PlusCircle,
  Moon,
  Sun,
  Store,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/auth/actions";

interface StoreInfo {
  id: number;
  name: string;
}

interface MobileNavClientProps {
  stores: StoreInfo[];
  currentStoreId: number;
  pathname: string;
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  window.dispatchEvent(new Event("tiendaflow-theme-change"));
}

function useTheme() {
  function subscribe(onStoreChange: () => void) {
    window.addEventListener("tiendaflow-theme-change", onStoreChange);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => {
      if (!localStorage.getItem("tiendaflow-theme")) {
        applyTheme(mq.matches);
      }
    };
    mq.addEventListener("change", onSchemeChange);
    return () => {
      window.removeEventListener("tiendaflow-theme-change", onStoreChange);
      mq.removeEventListener("change", onSchemeChange);
    };
  }
  function getSnapshot() {
    return document.documentElement.classList.contains("dark");
  }
  function getServerSnapshot() {
    return false;
  }
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function MobileNavClient({ stores, currentStoreId, pathname }: MobileNavClientProps) {
  const dark = useTheme();
  const [open, setOpen] = useState(false);

  function toggleTheme() {
    const next = !dark;
    applyTheme(next);
    localStorage.setItem("tiendaflow-theme", next ? "dark" : "light");
  }

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/productos", label: "Productos", icon: Package },
    { href: "/venta", label: "Venta", icon: PlusCircle },
    { href: "/ventas", label: "Ventas", icon: ShoppingCart },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/gastos", label: "Gastos", icon: DollarSign },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm lg:static lg:border-t-0 lg:bg-transparent lg:p-4">
      <div className="mx-auto flex max-w-md py-2 lg:max-w-4xl lg:rounded-2xl lg:bg-white lg:shadow-lg">
        <div className="flex min-w-0 flex-1 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors sm:px-3 lg:flex-row lg:gap-2 lg:px-3 lg:text-sm ${
                  isActive
                    ? "text-primary-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon
                  className={`h-5 w-5 lg:h-5 lg:w-5 ${
                    isActive ? "fill-current" : ""
                  }`}
                />
                <span className="hidden max-w-full truncate sm:inline">
                  {item.label}
                </span>
                <span className="max-w-full truncate sm:hidden">
                  {item.label.length > 8
                    ? item.label.slice(0, 8) + "."
                    : item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 7th slot — theme switch */}
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Cambiar modo oscuro"
          onClick={toggleTheme}
          className={`flex flex-none items-center justify-center rounded-xl transition-colors lg:flex-none ${
            dark
              ? "bg-primary-100 text-primary-700 hover:bg-primary-100"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          }`}
        >
          {dark ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* 8th slot — store switcher + logout (lg only) */}
        <div className="relative lg:flex-none">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Store className="h-4 w-4" />
            <span>
              {stores.find((s) => s.id === currentStoreId)?.name ?? "Tienda"}
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {open && (
            <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-slate-100 overflow-hidden">
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    document.cookie = `tf_store=${s.id}; path=/; SameSite=Lax`;
                    window.location.reload();
                  }}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    s.id === currentStoreId
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {s.name}
                </button>
              ))}
              <hr className="my-1 border-slate-100" />
              <form
                action={async () => {
                  await logoutAction();
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}