export const dynamic = 'force-dynamic';

import ItemsTable from '@/app/ui/items_table'
import { fetchItems } from '@/app/lib/db'
import CreateItem from '@/app/ui/create_item_form'

export default async function Home() {
  const items = await fetchItems();
  const serialized = items.map(item => ({
    id: item.id,
    model: item.model,
    checkedOut: item.checkedOut,
    checkedOutDate: item.dateCheckedOut?.toLocaleDateString('en-US') ?? null,
    checkedOutById: item.checkedOutById,
  }));

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4">
        <div className="flex flex-row gap-4">
          <CreateItem />
        </div>
        <ItemsTable items={serialized}/>
      </div>
    </div>
  );
}
