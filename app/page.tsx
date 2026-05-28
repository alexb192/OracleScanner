import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {

  const session = await auth()

  // redirects to the dashboard if the user is authenticated or to the login page if not
  session ? redirect('/dashboard') : redirect('/login')

  return (<></>);
}
