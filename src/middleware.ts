import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.headers.has("next-action")) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon\\.ico).*)"],
};
