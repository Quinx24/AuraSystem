import { BookOpen, Target, Users, Smile } from "lucide-react";
import StatCard from "../components/StatCard";
import ChartPlaceholder from "../components/ChartPlaceholder";

const activityItems = Array.from({ length: 5 });

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Overview of the Aura platform
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} label="Total Users" value="—" />
                <StatCard icon={BookOpen} label="Journal Entries" value="—" />
                <StatCard icon={Target} label="Active Quests" value="—" />
                <StatCard icon={Smile} label="Avg. Mood" value="—" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ChartPlaceholder title="Platform Overview" height="h-80" />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-100/50">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {activityItems.map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                                    <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
