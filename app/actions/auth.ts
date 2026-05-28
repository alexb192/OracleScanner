'use server'

import { signIn, signOut, auth } from '@/auth'
import { findUserByEmail, createUser } from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { Prisma } from '@/prisma/generated/prisma/edge'

// actions for login, register, logout - these are called from the login and register page forms
// and handle the server side logic for those forms. They return error messages if there are any issues, 
// which are then displayed on the frontend. If successful, they redirect to the appropriate page.

export async function loginAction(prevState: string | undefined, formData: FormData) {
  // try logging in
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Invalid email or password.'
    }
    throw error
  }
}

type RegisterState = { error: string } | { success: string } | null

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const session = await auth()
  if (!session?.user.admin) return { error: 'Unauthorized.' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const admin = formData.get('admin') === 'on'

  if (!name || !email || !password) return { error: 'All fields are required.' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' }

  const existing = await findUserByEmail(email)
  if (existing) return { error: 'An account with that email already exists.' }

  const hashed = await bcrypt.hash(password, 10)

  try {
    await createUser(name, email, hashed, admin)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'An account with that email already exists.' }
    }
    throw error
  }

  return { success: 'Account created successfully.' }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}
