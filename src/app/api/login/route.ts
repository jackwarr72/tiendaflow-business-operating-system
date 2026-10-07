import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, parseSession } from "@/lib/session";

export const runtime = "nodejs";

function getSessionCookie(request: NextRequest) {
  const cookieStore = request.cookies;
  return cookieStore.get("tiendaflow_session")?.value;
}

export async function GET(request: NextRequest) {
  const session = parseSession(getSessionCookie(request));
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
  return NextResponse.json(
    { authenticated: true, user: { id: session.userId, email: session.email } },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await db.select().from(customers).where(eq(customers.email, normalizedEmail));

    if (!existing) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 401 });
    }

    // In a real app, verify a password hash here. For this template, we treat
    // any registered email as logged in (stub authentication).
    const sessionToken = await createSession(existing.id.toString(), normalizedEmail);

    const response = NextResponse.json({
      authenticated: true,
      user: { id: existing.id, name: existing.name, email: existing.email },
    });
    response.cookies.set({
      name: "tiendaflow_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
