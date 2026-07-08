export default function StatCard({ icon: Icon, label, value, trend }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-100/50">
            <div className="flex items-center justify-between">
                <div className="rounded-xl bg-violet-50 p-3">
                    <Icon className="text-violet-600" size={22} />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-emerald-500">
                        {trend}
                    </span>
                )}
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
    );
}
