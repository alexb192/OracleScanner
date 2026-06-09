'use client'

import { useState, useActionState, useEffect } from 'react'
import { registerAction } from '../actions/auth'

type User = {
    id: string,
    name: string | null,
    email: string | null,
    admin: boolean
}

const checkboxClass = "appearance-none w-4 h-4 rounded-sm border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 checked:bg-zinc-700 dark:checked:bg-zinc-300 checked:border-zinc-700 dark:checked:border-zinc-300 cursor-pointer transition-colors [background-image:none] checked:[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><polyline points=%222,8 6,12 14,4%22 stroke=%22white%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')]"
const actionBtnClass = "px-3 py-1 text-sm font-medium rounded-sm border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

type SortKey = keyof User

export default function UsersTable({ users }: { users: User[] }) {
    const [registerState, registerFormAction] = useActionState(registerAction, null)
    const [formKey, setFormKey] = useState(0)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    useEffect(() => {
        // increments form key to reset form state and clear inputs after successful registration
        if (registerState && 'success' in registerState) setFormKey(k => k + 1)
    }, [registerState])
    const [sortKey, setSortKey] = useState<SortKey>('id')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    function handleSort(key: SortKey) {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
    }

    const sortedUsers = [...users].sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = typeof av === 'string' && typeof bv === 'string'
            ? av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
            : Number(av) - Number(bv)
        return cmp * (sortDir === 'asc' ? 1 : -1)
    })

    return (
    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-md border border-zinc-200 dark:border-zinc-700">
    {/* Toolbar */}
    <div className="flex flex-col px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <form key={formKey} action={registerFormAction} className="flex items-center gap-1.5">
            <input type="text" name="fname" placeholder="First Name" className="w-24 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600" required />
            <input type="text" name="lname" placeholder="Last Name" className="w-24 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600" required />
            <input type="email" name="email" placeholder="Email" className="w-40 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600" required />
            <input type="password" name="password" placeholder="Password" className="w-40 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600" required />
            <label className="flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                Admin
                <input type="checkbox" name="admin" className={checkboxClass} />
            </label>
            <button type="submit" className={actionBtnClass}>+ Create</button>
        </form>
        {registerState && 'error' in registerState && (
            <p aria-live="polite" className="text-sm text-red-500 mt-1.5">{registerState.error}</p>
        )}
        {registerState && 'success' in registerState && (
            <p aria-live="polite" className="text-sm text-green-600 mt-1.5">{registerState.success}</p>
        )}
    </div>

    {/* Table */}
    <table className="w-full text-sm text-left rtl:text-right text-zinc-700 dark:text-zinc-300">
        <thead className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
                {(
                    [
                        ['id', 'ID'],
                        ['name', 'Name'],
                        ['email', 'Email'],
                        ['admin', 'Admin']
                    ] as [SortKey, string][]
                ).map(([key, label]) => (
                    <th
                        key={key}
                        scope="col"
                        onClick={() => handleSort(key)}
                        className="px-6 py-3 font-medium cursor-pointer select-none hover:text-zinc-900 dark:hover:text-white"
                    >
                        {label}
                        <span className="ml-1 text-xs">
                            {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {sortedUsers.map((user) => (
                <tr
                    key={user.id}
                    onClick={() => setSelectedId(selectedId === user.id ? null : user.id)}
                    className={`border-b border-zinc-200 dark:border-zinc-700 last:border-0 cursor-pointer transition-colors ${
                        selectedId === user.id
                            ? 'bg-zinc-100 dark:bg-zinc-800'
                            : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                >
                    <td className="px-6 py-4">
                        {user.id}
                    </td>
                    <td className="px-6 py-4">
                        {user.name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                        {user.email ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                        {user.admin ? 'Yes' : 'No'}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
    )
}
