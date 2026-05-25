import { Suspense } from 'react'
import ItemsTableWrapper from '@/app/ui/items_table_wrapper'
import CreateItem from '@/app/ui/create_item_form'
import CheckOut from '@/app/ui/check_out_form'
import { auth } from '@/auth'
import { logoutAction } from '@/app/actions/auth'

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Signed in as {session?.user?.name ?? session?.user?.email}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline"
            >
              Sign Out
            </button>
          </form>
        </div>
        <div className="flex flex-row gap-4">
          <CreateItem />
          <CheckOut />
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <ItemsTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}
