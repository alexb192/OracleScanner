import { Suspense } from 'react'
import ItemsTableWrapper from '@/app/ui/items_table_wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4">
        <Suspense fallback={<p>Loading...</p>}>
          <ItemsTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}
