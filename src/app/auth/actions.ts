"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { stores, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  createPasswordReset,
  consumePasswordReset,
  requireUser,
} from "@/lib/auth";

export async function loginAction(email: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()));
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false as const, error: "Email o contraseña incorrectos" };
  }
  await createSession(user.id);
  if (user.mustResetPassword) redirect("/reset-password");
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function resetPasswordAction(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()));
  if (!user) {
    // Don't reveal whether the email exists.
    return { ok: true as const };
  }
  const token = await createPasswordReset(user.id);
  // ponytail: no email provider configured; the token is surfaced here for local
  // testing. Wire an SMTP provider later and send the reset link instead.
  return { ok: true as const, token };
}

export async function confirmResetPasswordAction(
  token: string,
  newPassword: string
) {
  const consumed = await consumePasswordReset(token);
  if (!consumed) {
    return { ok: false as const, error: "Enlace inválido o expirado" };
  }
  await db
    .update(users)
    .set({ passwordHash: hashPassword(newPassword), mustResetPassword: false })
    .where(eq(users.id, consumed.userId));
  await createSession(consumed.userId);
  redirect("/");
}

export async function updatePasswordAction(newPassword: string) {
  const user = await requireUser();
  await db
    .update(users)
    .set({ passwordHash: hashPassword(newPassword), mustResetPassword: false })
    .where(eq(users.id, user.id));
  return { ok: true as const };
}

export async function createUserAction(data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "viewer";
}) {
  const { requireUser } = await import("@/lib/auth");
  const actor = await requireUser();
  if (actor.role !== "admin") {
    throw new Error("Solo un admin puede crear usuarios");
  }
  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.id, actor.storeId));
  if (!store) throw new Error("Store no encontrado");

  const [user] = await db
    .insert(users)
    .values({
      storeId: store.id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: hashPassword(data.password),
      role: data.role,
      mustResetPassword: true,
    })
    .returning();
  return { ok: true as const, id: user.id };
}