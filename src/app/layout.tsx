import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TiendaFlow - Tu negocio en tu bolsillo",
  description:
    "Sistema operativo ligero y móvil para comerciantes informales, vendedores desde casa, revendedores y pequeños negocios de redes sociales.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets `.dark` on
    // <html> before first paint, so the server-rendered markup differs.
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {/* No-flash theme bootstrap (spec: EXPERIENCE.md — Theme, no-flash rule).
            First visit resolves prefers-color-scheme; an explicit choice in
            localStorage["tiendaflow-theme"] always wins. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("tiendaflow-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
