export default function TablePlaceholder({ columns, rows = 5 }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-violet-100/50">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80">
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-4 font-semibold text-slate-600"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-slate-50 last:border-0"
                            >
                                {columns.map((col) => (
                                    <td key={col} className="px-6 py-4">
                                        <div className="h-4 animate-pulse rounded-lg bg-slate-100" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
