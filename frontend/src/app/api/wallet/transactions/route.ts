import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WALLET_API =
  process.env.WALLET_API_URL ??
  process.env.NEXT_PUBLIC_WALLET_API_URL ??
  "http://localhost:3001";
const COOKIE_NAME = "auth_token";

function getAuthHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "8";
  try {
    const res = await fetch(
      `${WALLET_API}/wallet/transactions?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      { headers: getAuthHeaders(token) }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data as { message?: string })?.message ?? "Request failed";
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    if (data && typeof data === "object" && Array.isArray(data.items)) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ items: [], total: 0, page: 1, limit: 8 });
  } catch {
    return NextResponse.json(
      { message: "Service unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const res = await fetch(`${WALLET_API}/wallet/transactions`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data as { message?: string })?.message ?? "Request failed";
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Service unavailable" },
      { status: 503 }
    );
  }
}
