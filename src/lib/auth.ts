import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, stores, passwordResets, type StoreRole } from "@/db/schema";
import crypto from "crypto";

const SESSION_COOKIE = "tf_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const RESET_TTL_MS = 1000 * 60 * 30;

function secret(): string {
  return (
    process.env.SESSION_SECRET ??
    "dev-only-insecure-secret-change-me" /* ponytail: env var required in prod; add a startup assert when deploying multi-store */
  );
}

// ---------- passwords (scrypt, stdlib) ----------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)
  );
}

// ---------- session (signed httpOnly cookie) ----------

// Payload is base64url(JSON({uid, exp})) + "." + hmac-sha256(secret). The hmac is
// constant-length and compared with timingSafeEqual so a forged cookie is rejected
// without leaking whether the signature matched.
function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export type SessionUser = {
  id: number;
  storeId: number;
  storeName: string;
  name: string;
  email: string;
  role: StoreRole;
  mustResetPassword: boolean;
};

export async function createSession(userId: number): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  let uid: number;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    uid = parsed.uid;
  } catch {
    return null;
  }

  const [row] = await db
    .select({
      id: users.id,
      storeId: users.storeId,
      storeName: stores.name,
      name: users.name,
      email: users.email,
      role: users.role,
      mustResetPassword: users.mustResetPassword,
    })
    .from(users)
    .innerJoin(stores, eq(stores.id, users.storeId))
    .where(eq(users.id, uid));

  if (!row) return null;
  return { ...row, role: row.role as StoreRole };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireWriter(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role === "viewer") {
    throw new Error("Tu rol no permite modificar datos");
  }
  return user;
}

// ---------- password reset tokens ----------

export async function createPasswordReset(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await db.insert(passwordResets).values({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  return token;
}

export async function consumePasswordReset(
  token: string
): Promise<{ userId: number } | null> {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const [row] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.tokenHash, tokenHash));
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  await db
    .update(passwordResets)
    .set({ usedAt: new Date() })
    .where(eq(passwordResets.id, row.id));
  return { userId: row.userId };
}
