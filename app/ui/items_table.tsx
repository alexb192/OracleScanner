'use client'

import { useState, useActionState, useEffect } from 'react'
import { handleDelete, handleCheckOutById, handleCheckInById, handleSubmitItem } from '@/app/actions/forms'

type Item = {
    id: number
    model: string
    checkedOut: boolean
    checkedOutDate: string | null
    checkedOutBy: string | null
}

const checkboxClass = "appearance-none w-4 h-4 rounded-sm border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 checked:bg-zinc-700 dark:checked:bg-zinc-300 checked:border-zinc-700 dark:checked:border-zinc-300 cursor-pointer transition-colors [background-image:none] checked:[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><polyline points=%222,8 6,12 14,4%22 stroke=%22white%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')]"

const actionBtnClass = "px-3 py-1 text-sm font-medium rounded-sm border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

export default function ItemsTable({ items, isAdmin }: { items: Item[], isAdmin: boolean }) {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [checkOutState, checkOutAction, checkOutPending] = useActionState(handleCheckOutById, null)
    const [checkInState, checkInAction, checkInPending] = useActionState(handleCheckInById, null)
    const [deleteState, deleteAction, deletePending] = useActionState(handleDelete, null)

    // clear selected item if it was deleted or someone else changed a value.
    useEffect(() => {
        if (selectedId !== null && !items.some(item => item.id === selectedId)) {
            setSelectedId(null)
        }
    }, [items, selectedId])

    const selectedItem = items.find(item => item.id === selectedId)

    return (
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-md border border-zinc-200 dark:border-zinc-700">

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">

                {/* Create group */}
                <form action={handleSubmitItem} className="flex items-center gap-2">
                    <select
                        name="device"
                        disabled={!isAdmin}
                        className="text-sm text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="LAPTOP">Laptop</option>
                        <option value="TABLET">Tablet</option>
                    </select>
                    <button type="submit" disabled={!isAdmin} className={actionBtnClass}>+ Create</button>
                </form>

                {/* Divider */}
                <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

                {/* Selection-dependent group */}
                <form action={checkOutAction}>
                    <input type="hidden" name="itemId" value={selectedId ?? ''} />
                    <button
                        type="submit"
                        disabled={!selectedId || selectedItem?.checkedOut || checkOutPending}
                        className={actionBtnClass}
                    >
                        Check Out
                    </button>
                </form>
                <form action={checkInAction}>
                    <input type="hidden" name="itemId" value={selectedId ?? ''} />
                    <button
                        type="submit"
                        disabled={!selectedId || !selectedItem?.checkedOut || checkInPending}
                        className={actionBtnClass}
                    >
                        Check In
                    </button>
                </form>
                <form action={deleteAction}>
                    <input type="hidden" name="id" value={selectedId ?? ''} />
                    <button
                        type="submit"
                        disabled={!isAdmin || !selectedId || deletePending}
                        className={actionBtnClass}
                    >
                        Delete
                    </button>
                </form>
                {(checkOutState?.error ?? checkInState?.error ?? deleteState?.error) && (
                    <p aria-live="polite" className="text-sm text-red-500">
                        {checkOutState?.error ?? checkInState?.error ?? deleteState?.error}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-zinc-700 dark:text-zinc-300">
                    <thead className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-px"></th>
                            <th scope="col" className="px-6 py-3 font-medium">ID</th>
                            <th scope="col" className="px-6 py-3 font-medium">Model</th>
                            <th scope="col" className="px-6 py-3 font-medium">Checked Out</th>
                            <th scope="col" className="px-6 py-3 font-medium">Checked Out Date</th>
                            <th scope="col" className="px-6 py-3 font-medium">Checked Out By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                                className={`border-b border-zinc-200 dark:border-zinc-700 last:border-0 cursor-pointer transition-colors ${
                                    selectedId === item.id
                                        ? 'bg-zinc-100 dark:bg-zinc-800'
                                        : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                            >
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={selectedId === item.id}
                                        className={checkboxClass}
                                    />
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-zinc-900 dark:text-white whitespace-nowrap">{item.id}</th>
                                <td className="px-6 py-4">{item.model}</td>
                                <td className="px-6 py-4">{item.checkedOut ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4">{item.checkedOutDate ?? '—'}</td>
                                <td className="px-6 py-4">{item.checkedOutBy ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
