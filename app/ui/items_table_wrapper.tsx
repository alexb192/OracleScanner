import { fetchItems } from '@/app/lib/db'
import ItemsTable from './items_table'

export default async function ItemsTableWrapper() {
  const items = await fetchItems()
  const serialized = items.map(item => ({
    id: item.id,
    model: item.model,
    checkedOut: item.checkedOut,
    checkedOutDate: item.dateCheckedOut?.toLocaleDateString('en-US') ?? null,
    checkedOutById: item.checkedOutById,
  }))
  return <ItemsTable items={serialized} />
}
