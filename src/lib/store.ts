import "server-only";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { getStoreDb } from "@/db/routing";
import { stores, type Store } from "@/db/schema";

export type { Store };

// Every table that carries store_id is filtered by this id. Callers never pass a
// store id themselves; they get it from the request context.
export async function getStoreId(): Promise<number> {
  // No auth: fall back to cookie or default store (id 1).
  const cookieStore = await cookies();
  const raw = cookieStore.get("tf_store")?.value;
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 1;
}

export async function getStore(): Promise<Store> {
  const id = await getStoreId();
  const [store] = await db.select().from(stores).where(eq(stores.id, id));
  if (!store) throw new Error(`Store ${id} not found`);
  return store;
}

export async function listStores(): Promise<Store[]> {
  return db.select().from(stores).orderBy(stores.name);
}

// Resolves the per-request database handle for the active store. The default
// shared schema is returned when the store has no database_url.
export async function getDb() {
  const id = await getStoreId();
  return getStoreDb(id);
}