import { fetchUsers } from '@/app/lib/db'
import UsersTable from './users_table'

export default async function UsersTableWrapper() {
  const users = await fetchUsers()
  return <UsersTable users={users} />
}
