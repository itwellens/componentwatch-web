import { clerkMiddleware } from '@clerk/nextjs/server'

// Re-export required for Next.js middleware compatibility with Clerk v6

// All routes are public by default — Clerk is used for sign-in/profile only.
// Individual server actions / API routes can call auth() to require sign-in.
export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
