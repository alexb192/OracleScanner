'use client'

import { useActionState } from 'react'
import { registerAction } from '@/app/actions/auth'

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null)

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-6 w-full max-w-sm">
        <h1 className="text-zinc-900 dark:text-white font-medium text-sm mb-4">Create Account</h1>
        <form action={formAction} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
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
            placeholder="Password (min 6 characters)"
            required
            className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name="admin" className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 accent-zinc-900 dark:accent-white" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Administrator</span>
          </label>
          {state && 'error' in state && <p className="text-red-500 text-xs">{state.error}</p>}
          {state && 'success' in state && <p className="text-green-600 text-xs">{state.success}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-md px-4 py-2 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}
