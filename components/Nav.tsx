'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'

const links = [
  { href: '/builds',    label: 'Builds'    },
  { href: '/cases',     label: 'Cases'     },
  { href: '/compare',   label: 'Compare'   },
  { href: '/ai-builds', label: 'AI Builds' },
]

export default function Nav() {
  const path = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="font-semibold text-ink tracking-tight hover:opacity-80 transition-opacity">
          ComponentWatch
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                path.startsWith(l.href)
                  ? 'bg-surface-alt text-ink'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-alt',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Submit a build
          </Link>
          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
