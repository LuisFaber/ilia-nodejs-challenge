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

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await fetch(`${WALLET_API}/wallet/transactions`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        (data as { message?: string }).message ?? "Request failed",
        { status: res.status }
      );
    }
    return NextResponse.json(Array.isArray(data) ? data : []);
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
      return NextResponse.json(
        (data as { message?: string }).message ?? "Request failed",
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Service unavailable" },
      { status: 503 }
    );
  }
}
