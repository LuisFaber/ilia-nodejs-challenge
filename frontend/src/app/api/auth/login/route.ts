import { NextResponse } from "next/server";

const USERS_API = process.env.USERS_API_URL ?? process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";
const COOKIE_NAME = "auth_token";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${USERS_API}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message ?? "Invalid credentials" },
        { status: res.status }
      );
    }
    const token = (data as { access_token?: string }).access_token;
    if (!token) {
      return NextResponse.json({ message: "No token in response" }, { status: 502 });
    }
    const response = NextResponse.json({ user: (data as { user?: unknown }).user });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return response;
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Login failed" },
      { status: 500 }
    );
  }
}
