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
