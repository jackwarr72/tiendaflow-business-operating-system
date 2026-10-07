import { cookies } from "next/headers";

const SESSION_COOKIE = "tiendaflow_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const SECRET = process.env.SESSION_SECRET || "tiendaflow-dev-secret-change-me";

async function signPayload(payload: string): Promise<string> {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const signingInput = `${Buffer.from(header).toString("base64url")}.${payload}`;
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    hmacKey,
    new TextEncoder().encode(signingInput)
  );
  const sigBase64 = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${signingInput}.${sigBase64}`;
}

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const expected = await signPayload(payload);
  if (signature.length !== expected.length) return false;
  const a = new TextEncoder().encode(signature);
  const b = new TextEncoder().encode(expected);
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const result = await crypto.subtle.verify("HMAC", hmacKey, a, b);
  return result;
}

export async function createSession(userId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    email,
    iat: now,
    exp: now + SESSION_TTL,
    v: 1,
  };
  return signPayload(Buffer.from(JSON.stringify(payload)).toString("base64url"));
}

export function parseSession(cookieValue: string | undefined): { userId: string; email: string } | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  try {
    const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf-8"));
    if (header.alg !== "HS256") return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    // Verify signature asynchronously
    if (!verifySignature(payloadB64, sig)) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}





