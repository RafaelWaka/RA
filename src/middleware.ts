import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthed = Boolean(expected) && cookie === expected;

  if (!isAuthed) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
