import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UsersTableWrapper from '@/app/ui/users_table_wrapper'
import UsersTableSkeleton from '@/app/ui/skeletons/users_table_skeleton'
import { Suspense } from 'react'


export default async function AccountsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!session.user.admin) redirect('/scanner')

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4 py-4">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}
