'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'

const links = [
  { href: '/compare',   label: 'Prices'    },
  { href: '/builds',    label: 'Builds'    },
  { href: '/cases',     label: 'Cases'     },
  { href: '/ai-builds', label: 'AI Builds' },
]

export default function Nav() {
  const path = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-[#08080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center text-white text-[10px] font-bold tracking-tight">
            CW
          </div>
          <span className="font-semibold text-ink text-sm tracking-tight group-hover:opacity-75 transition-opacity hidden sm:block">
            ComponentWatch
          </span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                path.startsWith(l.href)
                  ? 'bg-surface text-ink'
                  : 'text-ink-muted hover:text-ink hover:bg-surface',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/submit"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Submit build
          </Link>
          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: 'h-7 w-7' } }} />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg border border-line px-4 py-1.5 text-sm font-medium text-ink-muted hover:text-ink hover:border-line/80 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
