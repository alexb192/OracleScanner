'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
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
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Invalid email or password.'
    }
    throw error
  }
}

export async function registerAction(prevState: string | undefined, formData: FormData) {
  // create new user
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) return 'All fields are required.'
  if (password.length < 6) return 'Password must be at least 6 characters.'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return 'An account with that email already exists.'

  const hashed = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({ data: { name, email, password: hashed } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return 'An account with that email already exists.'
    }
    throw error
  }

  redirect('/login')
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}
