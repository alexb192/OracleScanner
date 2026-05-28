const shimmer = "animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded"

function SkeletonCell({ className }: { className?: string }) {
    return <td className="px-6 py-4"><div className={`${shimmer} h-4 ${className ?? 'w-16'}`} /></td>
}

function SkeletonRow() {
    return (
        <tr className="border-b border-zinc-200 dark:border-zinc-700 last:border-0 bg-white dark:bg-zinc-900">
            <td className="px-4 py-4">
                <div className={`${shimmer} w-4 h-4 rounded-sm`} />
            </td>
            <SkeletonCell className="w-8" />
            <SkeletonCell className="w-20" />
            <SkeletonCell className="w-8" />
            <SkeletonCell className="w-28" />
            <SkeletonCell className="w-24" />
        </tr>
    )
}

export default function ItemsTableSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-md border border-zinc-200 dark:border-zinc-700">

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <div className={`${shimmer} h-7 w-24`} />
                <div className={`${shimmer} h-7 w-16`} />
                <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                <div className={`${shimmer} h-7 w-20`} />
                <div className={`${shimmer} h-7 w-20`} />
                <div className={`${shimmer} h-7 w-14`} />
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
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
                        {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
