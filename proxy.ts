import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "./utils/token";
import { protectedRoutes, publicRoutes } from "./lib/helpers/constants";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some(
    (r) => path === r || path.startsWith(`${r}/`),
  );
  const isPublic = publicRoutes.some(
    (r) => path === r || path.startsWith(`${r}/`),
  );

  // optimistic: cookie presence only
  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  if (isProtected && !token) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isPublic && token && isPublic) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
