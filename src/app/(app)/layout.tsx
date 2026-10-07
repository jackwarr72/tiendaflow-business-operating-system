import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { UserProvider } from "@/lib/user-context";
import { parseSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MobileNav from "@/components/mobile-nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("tiendaflow_session")?.value);

  if (!session) {
    redirect("/login");
  }

  return (
    <UserProvider>
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-2xl lg:max-w-4xl">
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </main>
        <MobileNav />
      </div>
    </UserProvider>
  );
}



