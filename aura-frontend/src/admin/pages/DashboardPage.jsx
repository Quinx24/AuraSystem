import { BookOpen, Target, Users, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import PageIntroduction from "../../components/PageIntroduction";
import StatCard from "../components/StatCard";
import ChartPlaceholder from "../components/ChartPlaceholder";
import { getDashboard } from "../services/dashboardService";

const activitySkeletonItems = Array.from({ length: 5 });

function formatActivityDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");
                const data = await getDashboard(controller.signal);

                if (isMounted) {
                    setDashboard(data);
                }
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    return;
                }

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                            err.message ||
                            "Unable to load dashboard data."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div>
            <PageIntroduction />

            {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={loading ? "..." : dashboard?.totalUsers ?? 0}
                />
                <StatCard
                    icon={BookOpen}
                    label="Journal Entries"
                    value={loading ? "..." : dashboard?.totalJournals ?? 0}
                />
                <StatCard
                    icon={Target}
                    label="Active Quests"
                    value={loading ? "..." : dashboard?.totalSideQuests ?? 0}
                />
                <StatCard
                    icon={Smile}
                    label="Avg. Mood"
                    value={loading ? "..." : dashboard?.averageMood || "N/A"}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ChartPlaceholder title="Platform Overview" height="h-80" />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-100/50">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Recent Activity
                    </h3>

                    {loading ? (
                        <div className="space-y-4">
                            {activitySkeletonItems.map((_, index) => (
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
                    ) : dashboard?.recentActivities?.length ? (
                        <div className="space-y-4">
                            {dashboard.recentActivities.map(
                                (activity, index) => (
                                    <div
                                        key={`${activity.type}-${activity.createdAt}-${index}`}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600">
                                            {activity.type?.slice(0, 1) || "A"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {activity.title || "Activity"}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {activity.description ||
                                                    "No description"}
                                            </p>
                                            {activity.createdAt && (
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {formatActivityDate(
                                                        activity.createdAt
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-400">
                            No recent activity.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
