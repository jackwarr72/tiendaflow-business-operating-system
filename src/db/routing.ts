import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stores } from "@/db/schema";

// A store whose `database_url` is set owns its own PostgreSQL instance. This layer
// resolves a per-request db handle from that url, so the same action code serves
// both topologies: one shared schema (url null) or N isolated databases.
// ponytail: connection pools are cached per url; no per-request pool churn.

const poolCache = new Map<string, Pool>();
const dbCache = new Map<string, NodePgDatabase>();

function defaultDb() {
  return db;
}

export async function getStoreDb(storeId: number): Promise<NodePgDatabase> {
  const cached = dbCache.get(String(storeId));
  if (cached) return cached;

  const [store] = await db
    .select({ databaseUrl: stores.databaseUrl })
    .from(stores)
    .where(eq(stores.id, storeId));

  if (!store || !store.databaseUrl) {
    return defaultDb();
  }

  const pool =
    poolCache.get(store.databaseUrl) ??
    new Pool({ connectionString: store.databaseUrl });
  poolCache.set(store.databaseUrl, pool);

  const handle = drizzle(pool);
  dbCache.set(String(storeId), handle);
  return handle;
}