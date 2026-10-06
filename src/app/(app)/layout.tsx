import type { ReactNode } from "react";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-2xl lg:max-w-4xl">
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
