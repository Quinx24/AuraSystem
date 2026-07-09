import { Filter, Search } from "lucide-react";
import { useEffect } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import TablePlaceholder from "../components/TablePlaceholder";

export default function UsersPage() {
    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Users", breadcrumb: ["Admin", "Users"] });
        return () => setPage({});
    }, []);

    return (
        <div>
            <PageIntroduction />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            <TablePlaceholder
                columns={["Name", "Email", "Role", "Status", "Joined"]}
            />

            <div className="mt-6 flex items-center justify-center gap-2">
                <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    Prev
                </button>
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            page === 1
                                ? "bg-violet-600 text-white"
                                : "border border-gray-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
