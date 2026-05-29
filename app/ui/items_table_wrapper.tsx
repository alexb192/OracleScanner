import { fetchItems } from '@/app/lib/db'
import ItemsTable from './items_table'

export default async function ItemsTableWrapper({ isAdmin }: { isAdmin: boolean }) {
  const items = await fetchItems()
  const serialized = items.map(item => ({
    id: item.id,
    model: item.model,
    checkedOut: item.checkedOut,
    checkedOutDate: item.dateCheckedOut?.toISOString().slice(0, 10) ?? null,
    checkedOutBy: item.checkedOutBy
      ? (item.checkedOutBy.name ?? item.checkedOutBy.email ?? '—')
      : null,
  }))
  return <ItemsTable items={serialized} isAdmin={isAdmin} />
}
