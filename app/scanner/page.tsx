import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import QRScanner from '@/app/ui/qr_scanner'

export default async function ScannerPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-md px-4">
        {/* Top bar — mirrors the dashboard header */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Signed in as {session?.user?.name ?? session?.user?.email}
          </span>
          <div className="flex gap-4 items-center">
            <a
              href="/dashboard"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline"
            >
              Dashboard
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <QRScanner />
      </div>
    </div>
  )
}
