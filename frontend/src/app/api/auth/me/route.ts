import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const USERS_API = process.env.USERS_API_URL ?? process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";
const COOKIE_NAME = "auth_token";

function decodeJwtPayload(token: string): { sub?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const raw = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(raw) as { sub?: string };
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const payload = decodeJwtPayload(token);
  const userId = payload?.sub;
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  try {
    const res = await fetch(`${USERS_API}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await res.json();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
  }
}
