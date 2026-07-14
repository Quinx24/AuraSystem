import { BookOpen, Smile, Target, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import PageIntroduction from "../../components/PageIntroduction";
import StatCard from "../components/StatCard";
import { usePageMeta } from "../../contexts/PageMetaContext";
import { emotionConfig } from "../../utils/emotionUtils";
import { getStatistics } from "../services/statisticsService";

function formatNumber(value) {
    return new Intl.NumberFormat("en").format(value ?? 0);
}

function getEmotionLabel(emotion) {
    return emotionConfig[emotion]?.label || emotion || "N/A";
}

function getEmotionColor(emotion) {
    return emotionConfig[emotion]?.color || "#8B5CF6";
}

function hasChartData(data) {
    return Array.isArray(data) && data.some((item) => (item.value ?? 0) > 0);
}

function ChartCard({ title, loading, children, isEmpty }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-100/50">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
                {title}
            </h3>
            {loading ? (
                <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
            ) : isEmpty ? (
                <div className="flex h-72 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                        No statistics available
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        There is not enough data to render this chart yet.
                    </p>
                </div>
            ) : (
                <div className="h-72">{children}</div>
            )}
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm shadow-lg shadow-violet-100/50">
            <p className="font-semibold text-slate-700">{label}</p>
            {payload.map((item) => (
                <p key={item.dataKey || item.name} className="text-slate-500">
                    {item.name}: {formatNumber(item.value)}
                </p>
            ))}
        </div>
    );
}

function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0];

    return (
        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm shadow-lg shadow-violet-100/50">
            <p className="font-semibold text-slate-700">{item.name}</p>
            <p className="text-slate-500">Value: {formatNumber(item.value)}</p>
        </div>
    );
}

export default function StatisticsPage() {
    const { setPage } = usePageMeta();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setPage({ title: "Statistics", breadcrumb: ["Admin", "Statistics"] });
        return () => setPage({});
    }, [setPage]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function loadStatistics() {
            try {
                setLoading(true);
                setError("");
                const data = await getStatistics(controller.signal);

                if (isMounted) {
                    setStatistics(data);
                }
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    return;
                }

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                            err.message ||
                            "Unable to load statistics."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadStatistics();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const emotionChartData = useMemo(() => {
        if (!statistics?.emotionDistribution) {
            return [];
        }

        return statistics.emotionDistribution.map((item) => ({
            ...item,
            label: getEmotionLabel(item.emotion),
            color: getEmotionColor(item.emotion),
        }));
    }, [statistics]);

    const overview = statistics?.overview;
    const completedQuestChart = statistics?.completedQuestChart || [];

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
                    value={loading ? "..." : formatNumber(overview?.totalUsers)}
                />
                <StatCard
                    icon={BookOpen}
                    label="Total Journals"
                    value={loading ? "..." : formatNumber(overview?.totalJournals)}
                />
                <StatCard
                    icon={Target}
                    label="Quests Completed"
                    value={
                        loading
                            ? "..."
                            : formatNumber(overview?.completedQuests)
                    }
                />
                <StatCard
                    icon={Smile}
                    label="Top Emotion"
                    value={
                        loading ? "..." : getEmotionLabel(overview?.topEmotion)
                    }
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard
                    title="User Growth"
                    loading={loading}
                    isEmpty={!hasChartData(statistics?.usersByMonth)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={statistics?.usersByMonth || []}>
                            <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" />
                            <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                            <YAxis stroke="#94A3B8" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                name="Users"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Journal Activity"
                    loading={loading}
                    isEmpty={!hasChartData(statistics?.journalsByDay)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={statistics?.journalsByDay || []}>
                            <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" />
                            <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                            <YAxis stroke="#94A3B8" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="value"
                                name="Journals"
                                stroke="#EC4899"
                                fill="#FCE7F3"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Emotion Distribution"
                    loading={loading}
                    isEmpty={!hasChartData(emotionChartData)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={emotionChartData}
                                dataKey="value"
                                nameKey="label"
                                innerRadius={60}
                                outerRadius={95}
                                paddingAngle={3}
                            >
                                {emotionChartData.map((item) => (
                                    <Cell
                                        key={item.emotion}
                                        fill={item.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Completed Quests"
                    loading={loading}
                    isEmpty={!hasChartData(completedQuestChart)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={completedQuestChart}>
                            <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" />
                            <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                            <YAxis stroke="#94A3B8" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="value"
                                name="Completed Quests"
                                fill="#22C55E"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}
