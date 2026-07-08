import { emotionConfig } from "../utils/emotionUtils";
import { categoryConfig } from "../utils/sideQuestCategoryUtils";
import { getAllSideQuests } from "../api/sideQuestApi";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    getTodayQuest,
    completeQuest,
    getCompletedQuest,
    addSideQuest
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

    const latestQuestRequestId = useRef(0);

    const fetchSideQuests = useCallback(async (filters = {}) => {

        const requestId = latestQuestRequestId.current + 1;

        latestQuestRequestId.current = requestId;

        setIsLoadingQuests(true);

        try {

            const data = await getAllSideQuests(filters);

            if (latestQuestRequestId.current === requestId) {
                setQuests(data ?? []);
            }

        }
        catch (error) {

            console.log(error);

            if (latestQuestRequestId.current === requestId) {
                setQuests([]);
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
        catch (error) {
            console.log(error);

            setTodayQuest([]);
        }
    }, []);

    const loadCompletedQuest = useCallback(async () => {
        try {
            const response = await getCompletedQuest();

            setCompletedQuest(response.data.result ?? []);
        } catch (error) {
            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);
        }
    }, []);

    const handleCompleteQuest = async (id) => {

        try {

            await completeQuest(id);

            await loadTodayQuest();

            await loadCompletedQuest();

        } catch (error) {

            console.log(error);

            alert("Complete quest failed.");

        }

    };

    const handleAddSideQuest = async (sideQuestId) => {
        try {

            await addSideQuest(sideQuestId);

            await loadTodayQuest();

            alert("Side quest added successfully!");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ??
                "Failed to add side quest."
            );
        }
    };

    const handleClearFilters = () => {
        setSelectedMood(ALL_FILTER);
        setSelectedCategory(ALL_FILTER);
        setSelectedSort(DEFAULT_SORT);
    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTodayQuest();
        loadCompletedQuest();

    }, [loadTodayQuest, loadCompletedQuest]);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSideQuests({
            mood: selectedMood,
            category: selectedCategory,
            sort: selectedSort
        });

    }, [fetchSideQuests, selectedMood, selectedCategory, selectedSort]);

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

        <div className="space-y-6">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">
                        Side-Quests
                    </h1>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <span>Home</span>
                        <span>&gt;</span>
                        <span>Side-Quests</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="min-w-[140px] rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`grid h-9 w-9 place-items-center rounded-xl ${stat.className}`}>
                                        <Icon size={18} />
                                    </div>

                                    <div>
                                        <div className="text-lg font-bold text-slate-900">
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

            <div className="flex items-center gap-10 border-b border-gray-200">
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
                        <Sparkles size={17} />
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
                        <Target size={17} />
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
                        <CheckCircle2 size={17} />
                        Completed ({completedQuest.length})
                    </span>

                    {activeTab === "completed" && (
                        <span className="absolute left-0 bottom-0 w-full h-[3px] bg-violet-600 rounded-full" />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-9">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-lg mb-5 text-slate-900">
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
                                    py-2
                                    rounded-xl
                                    border
                                    font-medium
                                    shadow-sm
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    ${selectedMood === ALL_FILTER
                                        ? "border-purple-500 bg-purple-50 text-purple-600"
                                        : "border-gray-200 bg-white text-slate-700 hover:bg-purple-50 hover:border-purple-300"
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
                                        py-2
                                        rounded-xl
                                        border
                                        font-medium
                                        shadow-sm
                                        transition
                                        duration-200
                                        hover:-translate-y-0.5
                                        ${selectedMood === emotion
                                            ? "border-purple-500 bg-purple-50 text-purple-600"
                                            : "border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300"
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

                        <div className="flex items-center justify-between mt-8 mb-5">
                            <h3 className="text-lg font-semibold">
                                Filter by Category
                            </h3>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">
                                    Sort by
                                </span>

                                <select
                                    value={selectedSort}
                                    onChange={(event) => setSelectedSort(event.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white transition duration-200 hover:border-purple-300 focus:border-purple-500 focus:bg-purple-50"
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
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
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
                                    py-2
                                    rounded-xl
                                    border
                                    font-medium
                                    shadow-sm
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    ${selectedCategory === ALL_FILTER
                                        ? "border-purple-500 bg-purple-50 text-purple-600"
                                        : "border-gray-200 bg-white text-slate-700 hover:bg-purple-50 hover:border-purple-300"
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
                                            py-2
                                            rounded-xl
                                            border
                                            font-medium
                                            shadow-sm
                                            transition
                                            duration-200
                                            hover:-translate-y-0.5
                                            ${selectedCategory === category
                                                ? "border-purple-500 bg-purple-50 text-purple-600"
                                                : "border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300"
                                            }
                                        `}
                                    >
                                        <Icon size={18} className={config.text} />
                                        <span>{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-6 mt-6">
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
                                        onAdd={handleAddSideQuest}
                                    />
                                ))}

                            {activeTab === "myQuest" &&
                                todayQuest.map((quest) => (
                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="myQuest"
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
