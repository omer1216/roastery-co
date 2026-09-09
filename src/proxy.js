import { NextResponse } from "next/server";

const COOKIE = "roastery_admin";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE)?.value;
  const authed = Boolean(token) && token === process.env.ADMIN_SESSION_TOKEN;

  if (pathname === "/admin/login") {
    if (authed) {
      return NextResponse.redirect(new URL("/admin/orders", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authorised." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/orders/:path*", "/api/admin/stream"],
};