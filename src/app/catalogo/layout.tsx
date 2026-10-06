import type { ReactNode } from "react";
import "../globals.css";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-white shadow-2xl lg:max-w-4xl">
      {children}
    </div>
  );
}
