"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  PlusCircle,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/venta", label: "Venta", icon: PlusCircle },
  { href: "/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/gastos", label: "Gastos", icon: DollarSign },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm lg:static lg:border-t-0 lg:bg-transparent lg:p-4">
      <div className="mx-auto flex max-w-md justify-around py-2 lg:max-w-4xl lg:rounded-2xl lg:bg-white lg:shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors lg:flex-row lg:gap-2 lg:text-sm ${
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
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">
                {item.label.length > 8
                  ? item.label.slice(0, 8) + "."
                  : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
