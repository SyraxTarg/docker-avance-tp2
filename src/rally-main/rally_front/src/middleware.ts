import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/context/server_fetcher/verify_token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("user_access_token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const res = await verifyToken();

  if (!res?.ok) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const user = await res.json();

  if (pathname.startsWith("/admin/super-admin")) {
    if (user?.role?.role !== "ROLE_SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    const isAdmin = user?.role?.role === "ROLE_ADMIN" || user?.role?.role === "ROLE_SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin/super-admin/:path*",
    "/events/new",
    "/profiles/me",
  ],
};
