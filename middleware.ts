import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Clerk middleware disabled until protected routes are added (submit form, dashboard).
// Re-enable by restoring clerkMiddleware from @clerk/nextjs/server once
// CLERK_SECRET_KEY is set in Cloudflare environment variables.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
