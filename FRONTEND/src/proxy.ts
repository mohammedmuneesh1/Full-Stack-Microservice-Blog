import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes
  if (
    pathname.startsWith("/profile") ||
    pathname === "/blogs/new" ||
    pathname === "/blogs/saved" ||
    pathname.match(/^\/blogs\/[^/]+\/edit$/)
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Prevent logged-in users from visiting auth pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/blogs/new",
    "/blogs/:id/edit",
    "/login",
    "/register",
    "/blogs/saved", 
  ],
};