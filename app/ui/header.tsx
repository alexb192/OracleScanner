import Link from 'next/link'
import { auth } from '@/auth'
import { logoutAction } from '@/app/actions/auth'

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* Left: app name + divider */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            OracleScanner
          </span>
          <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700" />
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/scanner"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Scanner
            </Link>
            {session?.user.admin && (
              <Link
                href="/accounts"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Accounts
              </Link>
            )}
          </nav>
        </div>

        {/* Right: user info + logout */}
        {session?.user && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {session.user.name ?? session.user.email}
            </span>
            {session.user.admin && (
              <>
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Admin</span>
              </>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-300 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
