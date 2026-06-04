const shimmer = "animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded"

function SkeletonCell({ className }: { className?: string }) {
    return <td className="px-6 py-4"><div className={`${shimmer} h-4 ${className ?? 'w-16'}`} /></td>
}

function SkeletonRow() {
    return (
        <tr className="border-b border-zinc-200 dark:border-zinc-700 last:border-0 bg-white dark:bg-zinc-900">
            <SkeletonCell className="w-64" />
            <SkeletonCell className="w-24" />
            <SkeletonCell className="w-40" />
            <SkeletonCell className="w-8" />
        </tr>
    )
}

export default function UsersTableSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-md border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
                <thead className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-medium">ID</th>
                        <th scope="col" className="px-6 py-3 font-medium">Name</th>
                        <th scope="col" className="px-6 py-3 font-medium">Email</th>
                        <th scope="col" className="px-6 py-3 font-medium">Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
            </table>
        </div>
    )
}
