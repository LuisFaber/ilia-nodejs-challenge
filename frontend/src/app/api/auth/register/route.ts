import { NextResponse } from "next/server";

const USERS_API = process.env.USERS_API_URL ?? process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";
const COOKIE_NAME = "auth_token";
const MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const createRes = await fetch(`${USERS_API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: (err as { message?: string }).message ?? "Registration failed" },
        { status: createRes.status }
      );
    }
    const loginRes = await fetch(`${USERS_API}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
    const loginData = await loginRes.json().catch(() => ({}));
    const token = (loginData as { access_token?: string }).access_token;
    const user = (loginData as { user?: unknown }).user;
    const createdUser = await createRes.json().catch(() => null);
    const response = NextResponse.json({
      user: user ?? createdUser,
    });
    if (token) {
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: MAX_AGE,
        path: "/",
      });
    }
    return response;
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Registration failed" },
      { status: 500 }
    );
  }
}
