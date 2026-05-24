import { Suspense } from 'react'
import ItemsTableWrapper from '@/app/ui/items_table_wrapper'
import CreateItem from '@/app/ui/create_item_form'
import CheckOut from '@/app/ui/check_out_form'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4">
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
