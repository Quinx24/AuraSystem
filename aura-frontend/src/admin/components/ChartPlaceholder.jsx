import { BarChart3 } from "lucide-react";

export default function ChartPlaceholder({ title = "Chart", height = "h-72" }) {
    return (
        <div
            className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-100/50 ${height} flex flex-col`}
        >
            <h3 className="mb-4 text-base font-semibold text-slate-900">
                {title}
            </h3>
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 via-white to-pink-50">
                <BarChart3 className="mb-3 text-violet-300" size={48} />
                <p className="text-sm font-medium text-slate-400">
                    Chart placeholder
                </p>
            </div>
        </div>
    );
}
