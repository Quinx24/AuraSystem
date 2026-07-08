import { Calendar, Filter, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import TablePlaceholder from "../components/TablePlaceholder";

export default function JournalManagementPage() {
    return (
        <div>
            <PageHeader
                title="Journal Entries"
                description="Browse and manage user journal entries"
            />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search journals..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <Filter size={16} />
                    Emotion
                </button>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <Calendar size={16} />
                    Date
                </button>
            </div>

            <TablePlaceholder
                columns={["User", "Title", "Emotion", "Date", "Actions"]}
            />
        </div>
    );
}
