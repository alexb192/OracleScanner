import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import QRScanner from '@/app/ui/qr_scanner'

export default async function ScannerPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-md px-4">
        <QRScanner />
      </div>
    </div>
  )
}
