import { emotionConfig } from "../utils/emotionUtils";
import { categoryConfig } from "../utils/sideQuestCategoryUtils";
import { getAllSideQuests, getRecommendedSideQuests } from "../api/sideQuestApi";
import { useCallback, useEffect, useRef, useState } from "react";
import PageIntroduction from "../components/PageIntroduction";
import {
    getTodayQuest,
    completeQuest,
    getCompletedQuest,
    addSideQuest,
    removeSideQuest
} from "../services/sideQuestService";
import {
    CheckCircle2,
    Flame,
    SearchX,
    Sparkles,
    Star,
    Target
} from "lucide-react";
import SideQuestCard from "../components/SideQuestCard";
import { usePageMeta } from "../contexts/PageMetaContext";

const ALL_FILTER = "All";

const DEFAULT_SORT = "newest";

const sortOptions = [
    { label: "Newest", value: DEFAULT_SORT },
    { label: "Oldest", value: "oldest" },
    { label: "XP (High → Low)", value: "xp_desc" },
    { label: "XP (Low → High)", value: "xp_asc" },
    { label: "A → Z", value: "title_asc" }
];

export default function SideQuestPage() {

    const [quests, setQuests] = useState([]);

    const [isLoadingQuests, setIsLoadingQuests] = useState(false);

    const [todayQuest, setTodayQuest] = useState([]);

    const [completedQuest, setCompletedQuest] = useState([]);

    const [activeTab, setActiveTab] = useState("recommended");

    const [selectedMood, setSelectedMood] = useState(ALL_FILTER);

    const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);

    const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT);

    const [pendingQuestIds, setPendingQuestIds] = useState(() => new Set());

    const latestQuestRequestId = useRef(0);

    const fetchSideQuests = useCallback(async (filters = {}) => {

        const requestId = latestQuestRequestId.current + 1;

        latestQuestRequestId.current = requestId;

        setIsLoadingQuests(true);

        try {

            const canUseRecommendations =
                filters.category === ALL_FILTER &&
                filters.sort === DEFAULT_SORT;

            const data = canUseRecommendations
                ? await getRecommendedSideQuests({
                    emotion: filters.mood,
                    limit: 3
                })
                : await getAllSideQuests(filters);

            const normalizedQuests = canUseRecommendations
                ? (data ?? []).map((result) => ({
                    ...result.quest,
                    recommendation: {
                        score: result.score,
                        explanations: result.explanations ?? [],
                        confidence: result.confidence,
                        recommendationTime: result.recommendationTime
                    }
                }))
                : data ?? [];

            if (latestQuestRequestId.current === requestId) {
                setQuests(normalizedQuests);
            }

        }
        catch {
            try {
                const fallbackData = await getAllSideQuests(filters);

                if (latestQuestRequestId.current === requestId) {
                    setQuests(fallbackData ?? []);
                }
            } catch {
                if (latestQuestRequestId.current === requestId) {
                    setQuests([]);
                }
            }

        } finally {

            if (latestQuestRequestId.current === requestId) {
                setIsLoadingQuests(false);
            }

        }

    }, []);

    const loadTodayQuest = useCallback(async () => {

        try {
            const response = await getTodayQuest();

            setTodayQuest(response.data.result ?? []);
        }
        catch {
            setTodayQuest([]);
        }
    }, []);

    const loadCompletedQuest = useCallback(async () => {
        try {
            const response = await getCompletedQuest();

            setCompletedQuest(response.data.result ?? []);
        } catch {
            setCompletedQuest([]);
        }
    }, []);

    const handleCompleteQuest = async (id) => {

        try {
            setPendingQuestIds((prev) => new Set(prev).add(id));

            await completeQuest(id);

            await Promise.all([
                loadTodayQuest(),
                loadCompletedQuest()
            ]);

        } catch {
            alert("Complete quest failed.");

        } finally {
            setPendingQuestIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });

        }

    };

    const handleToggleSideQuest = async (sideQuestId, isInMyQuests) => {
        try {
            setPendingQuestIds((prev) => new Set(prev).add(sideQuestId));

            if (isInMyQuests) {
                await removeSideQuest(sideQuestId);
            } else {
                await addSideQuest(sideQuestId);
            }

            await Promise.all([
                loadTodayQuest(),
                loadCompletedQuest()
            ]);

            alert(
                isInMyQuests
                    ? "Side quest removed from My Quests."
                    : "Side quest added successfully!"
            );

        } catch (error) {
            alert(
                error.response?.data?.message ??
                "Failed to update side quest."
            );
        } finally {
            setPendingQuestIds((prev) => {
                const next = new Set(prev);
                next.delete(sideQuestId);
                return next;
            });
        }
    };

    const handleClearFilters = () => {
        setSelectedMood(ALL_FILTER);
        setSelectedCategory(ALL_FILTER);
        setSelectedSort(DEFAULT_SORT);
    };

    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Side Quests", breadcrumb: ["Home", "Side Quests"] });
        return () => setPage({});
    }, [setPage]);

    useEffect(() => {
        let isMounted = true;

        Promise.resolve().then(() => {
            if (!isMounted) return;
            loadTodayQuest();
            loadCompletedQuest();
        });

        return () => {
            isMounted = false;
        };
    }, [loadTodayQuest, loadCompletedQuest]);

    useEffect(() => {
        let isMounted = true;

        Promise.resolve().then(() => {
            if (!isMounted) return;
            fetchSideQuests({
                mood: selectedMood,
                category: selectedCategory,
                sort: selectedSort
            });
        });

        return () => {
            isMounted = false;
        };
    }, [fetchSideQuests, selectedMood, selectedCategory, selectedSort]);

    const addedQuestIds = new Set(
        todayQuest.map((quest) => quest.sideQuestId)
    );

    const currentQuests =
        activeTab === "recommended"
            ? quests
            : activeTab === "myQuest"
                ? todayQuest
                : completedQuest;

    const totalXp = completedQuest.reduce(
        (sum, quest) => sum + (quest.xpReward ?? 0),
        0
    );

    const stats = [
        {
            label: "Current Streak",
            value: "-",
            icon: Flame,
            className: "bg-orange-50 text-orange-500"
        },
        {
            label: "Total XP",
            value: totalXp,
            icon: Star,
            className: "bg-amber-50 text-amber-500"
        },
        {
            label: "Completed Quests",
            value: completedQuest.length,
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-500"
        },
        {
            label: "Active Quests",
            value: todayQuest.length,
            icon: Target,
            className: "bg-violet-50 text-violet-500"
        }
    ];

    return (

        <div className="space-y-8">
            <PageIntroduction />

            <div className="flex flex-col gap-5">
                {/* page meta set via context */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="min-w-[140px] rounded-2xl border border-violet-100 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${stat.className}`}>
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <div className="text-xl font-bold text-slate-900">
                                            {stat.value}
                                        </div>

                                        <div className="text-xs font-medium text-slate-500">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-200 md:gap-12">
                <button
                    onClick={() => setActiveTab("recommended")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "recommended"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >
                    <span className="inline-flex items-center gap-2">
                        <Sparkles size={18} />
                        Recommended
                    </span>

                    {activeTab === "recommended" && (
                        <span className="absolute left-0 bottom-0 w-full h-[3px] bg-violet-600 rounded-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("myQuest")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "myQuest"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >
                    <span className="inline-flex items-center gap-2">
                        <Target size={18} />
                        My Quests ({todayQuest.length})
                    </span>

                    {activeTab === "myQuest" && (
                        <span className="absolute left-0 bottom-0 w-full h-[3px] bg-violet-600 rounded-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "completed"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Completed ({completedQuest.length})
                    </span>

                    {activeTab === "completed" && (
                        <span className="absolute left-0 bottom-0 w-full h-[3px] bg-violet-600 rounded-full" />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <div className="min-w-0 xl:col-span-9">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                        <h3 className="font-semibold text-lg mb-6 text-slate-900">
                            Filter by Mood
                        </h3>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedMood(ALL_FILTER)}
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    border
                                    font-medium
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    ${selectedMood === ALL_FILTER
                                        ? "border-violet-500 bg-violet-50 text-violet-600"
                                        : "border-gray-200 bg-white text-slate-700 hover:bg-violet-50 hover:border-violet-300"
                                    }
                                `}
                            >
                                All
                            </button>

                            {Object.entries(emotionConfig).map(([emotion, config]) => (
                                <button
                                    key={emotion}
                                    onClick={() => setSelectedMood(emotion)}
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        border
                                        font-medium
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        ${selectedMood === emotion
                                            ? "border-violet-500 bg-violet-50 text-violet-600"
                                            : "border-gray-200 bg-white hover:bg-violet-50 hover:border-violet-300"
                                        }
                                    `}
                                >
                                    <span className={`grid h-7 w-7 place-items-center rounded-lg ${config.bg}`}>
                                        {config.emoji}
                                    </span>
                                    <span className="text-slate-700">{config.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Filter by Category
                            </h3>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-gray-500">
                                    Sort by
                                </span>

                                <select
                                    value={selectedSort}
                                    onChange={(event) => setSelectedSort(event.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2.5 outline-none bg-white transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:bg-violet-50"
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleClearFilters}
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedCategory(ALL_FILTER)}
                                className={`
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    border
                                    font-medium
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    ${selectedCategory === ALL_FILTER
                                        ? "border-violet-500 bg-violet-50 text-violet-600"
                                        : "border-gray-200 bg-white text-slate-700 hover:bg-violet-50 hover:border-violet-300"
                                    }
                                `}
                            >
                                All
                            </button>

                            {Object.entries(categoryConfig).map(([category, config]) => {
                                const Icon = config.icon;

                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            px-5
                                            py-2.5
                                            rounded-xl
                                            border
                                            font-medium
                                            shadow-sm
                                            transition-all
                                            duration-200
                                            hover:-translate-y-0.5
                                            ${selectedCategory === category
                                                ? "border-violet-500 bg-violet-50 text-violet-600"
                                                : "border-gray-200 bg-white hover:bg-violet-50 hover:border-violet-300"
                                            }
                                        `}
                                    >
                                        <Icon size={18} className={config.text} />
                                        <span>{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-6 mt-8">
                            {activeTab === "recommended" && isLoadingQuests &&
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="mt-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex flex-1 items-start gap-4">
                                                <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-gray-100" />

                                                <div className="flex flex-1 flex-col">
                                                    <div className="h-5 w-2/5 animate-pulse rounded-full bg-gray-100" />
                                                    <div className="mt-3 h-4 w-4/5 animate-pulse rounded-full bg-gray-100" />
                                                    <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-gray-100" />

                                                    <div className="mt-3 flex gap-2">
                                                        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-100" />
                                                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                                                        <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-8 w-32 animate-pulse rounded-xl bg-gray-100" />
                                        </div>
                                    </div>
                                ))}

                            {activeTab === "recommended" && !isLoadingQuests &&
                                quests.map((quest) => (
                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="recommended"
                                        isAdded={addedQuestIds.has(quest.id)}
                                        isBusy={pendingQuestIds.has(quest.id)}
                                        explanations={quest.recommendation?.explanations}
                                        confidence={quest.recommendation?.confidence}
                                        onAdd={handleToggleSideQuest}
                                    />
                                ))}

                            {activeTab === "myQuest" &&
                                todayQuest.map((quest) => (
                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="myQuest"
                                        isBusy={pendingQuestIds.has(quest.id)}
                                        onComplete={handleCompleteQuest}
                                    />
                                ))}

                            {activeTab === "completed" &&
                                completedQuest.map((quest) => (
                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="completed"
                                    />
                                ))}

                            {currentQuests.length === 0 && !isLoadingQuests && (
                                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 px-6 py-12 text-center">
                                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-violet-500 shadow-sm">
                                        <SearchX size={30} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        No quests found.
                                    </h3>

                                    <p className="mt-2 text-sm font-medium text-slate-500">
                                        Try another mood or category.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden xl:col-span-3 xl:block" />
            </div>
        </div>
    );
}
