'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-6 w-full max-w-sm">
        <h1 className="text-zinc-900 dark:text-white font-medium text-sm mb-4">Sign In</h1>
        <form action={formAction} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-md px-4 py-2 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Sign In
          </button>
        </form>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
          No account?{' '}
          <Link href="/register" className="underline hover:text-zinc-900 dark:hover:text-white">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
