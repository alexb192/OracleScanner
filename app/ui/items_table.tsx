'use client'

import { useState } from 'react'
import { handleDelete } from '@/app/actions'

type Item = {
    id: number
    model: string
    checkedOut: boolean
    date: string | null
}

export default function ItemsTable({ items }: { items: Item[] }) {
    const [deletionEnabled, setDeletionEnabled] = useState(false)

    return (
        <div className="relative overflow-x-auto bg-white dark:bg-zinc-900 shadow-sm rounded-md border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm text-left rtl:text-right text-zinc-700 dark:text-zinc-300">
                <thead className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-medium">ID</th>
                        <th scope="col" className="px-6 py-3 font-medium">Model</th>
                        <th scope="col" className="px-6 py-3 font-medium">Checked Out</th>
                        <th scope="col" className="px-6 py-3 font-medium">Date</th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Enable Deletion:&nbsp;
                            <input
                                type="checkbox"
                                checked={deletionEnabled}
                                onChange={(e) => setDeletionEnabled(e.target.checked)}
                                className="appearance-none w-4 h-4 align-middle rounded-sm border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 checked:bg-zinc-700 dark:checked:bg-zinc-300 checked:border-zinc-700 dark:checked:border-zinc-300 cursor-pointer transition-colors [background-image:none] checked:[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><polyline points=%222,8 6,12 14,4%22 stroke=%22white%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')]"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
                            <th scope="row" className="px-6 py-4 font-medium text-zinc-900 dark:text-white whitespace-nowrap">{item.id}</th>
                            <td className="px-6 py-4">{item.model}</td>
                            <td className="px-6 py-4">{item.checkedOut ? 'Yes' : 'No'}</td>
                            <td className="px-6 py-4">{item.date ?? '—'}</td>
                            <td className="px-6 py-4">
                                <form action={handleDelete}>
                                    <input type="hidden" name="id" value={item.id} />
                                    <button type="submit" disabled={!deletionEnabled} className={`px-3 py-1 text-sm font-medium rounded-sm border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${deletionEnabled ? '' : 'invisible'}`}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
