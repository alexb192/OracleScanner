import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import RegisterForm from '@/app/ui/register_form'

export default async function AccountsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!session.user.admin) redirect('/scanner')

  return <RegisterForm />
}
