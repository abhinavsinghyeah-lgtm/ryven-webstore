import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.COMING_SOON_PASSWORD || "RYVEN8411";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password.trim() : "";

  if (!password || password !== PASSWORD) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("ryven_access", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ status: "ok" });
}
