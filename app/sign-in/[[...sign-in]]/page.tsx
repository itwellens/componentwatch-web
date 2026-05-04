import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Sign in to submit builds, set price alerts, and track your watchlist.
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-sm border border-line rounded-2xl',
            },
          }}
        />
      </div>
    </div>
  )
}
