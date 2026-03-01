import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const USERS_API =
  process.env.USERS_API_URL ?? process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";
const COOKIE_NAME = "auth_token";

function getAuthHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await _request.json();
    const res = await fetch(`${USERS_API}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(token),
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
    return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const res = await fetch(`${USERS_API}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        (data as { message?: string }).message ?? "Request failed",
        { status: res.status }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
  }
}
