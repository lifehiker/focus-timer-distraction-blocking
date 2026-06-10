import { NextResponse, type NextRequest } from 'next/server'

// This app has no server actions. Reject any Next-Action requests immediately
// so they never reach Next.js's action handler (which logs unhandled errors
// that can crash the process in Next.js 16 / React 19).
export function middleware(request: NextRequest) {
  if (request.headers.has('next-action')) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }
  return NextResponse.next()
}

// Exclude API routes and Next.js internals so the health check (/api/health)
// always reaches the route handler directly without going through the
// Edge Runtime middleware (which can return 500 on first init and cause
// the Docker HEALTHCHECK to fail).
export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon\\.ico).*)'],
}
