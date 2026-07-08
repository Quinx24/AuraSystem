import { useEffect, useState } from "react";
import { BookOpen, Flame, Star, Target } from "lucide-react";
import TodayMoodCard from "../components/dashboard/TodayMoodCard";
import MoodSummaryChart from "../components/dashboard/MoodSummaryChart";
import CalendarPreview from "../components/dashboard/CalendarPreview";
import SideQuestPreview from "../components/dashboard/SideQuestPreview";
import { getJournalEntries } from "../services/journalService";
import { getLevel } from "../services/levelService";
import { getStreak } from "../services/streakService";
import { getTodayQuest } from "../services/sideQuestService";
import { getCurrentUser } from "../services/userService";

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good Morning";
    }

    if (hour < 18) {
        return "Good Afternoon";
    }

    return "Good Evening";
};

function AnimatedValue({ value }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const numericValue = Number(value) || 0;

        if (numericValue === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayValue(0);
            return;
        }

        let frame = 0;
        const totalFrames = 18;
        const timer = window.setInterval(() => {
            frame += 1;
            setDisplayValue(Math.round((numericValue * frame) / totalFrames));

            if (frame >= totalFrames) {
                window.clearInterval(timer);
                setDisplayValue(numericValue);
            }
        }, 24);

        return () => window.clearInterval(timer);
    }, [value]);

    return <span>{displayValue}</span>;
}

export default function DashboardPage() {

    const [userName, setUserName] = useState("");

    const [quickStats, setQuickStats] = useState({
        currentStreak: 0,
        totalXp: 0,
        totalJournals: 0,
        activeSideQuests: 0
    });

    useEffect(() => {
        const loadDashboardStats = async () => {
            const [
                userResponse,
                streakResponse,
                levelResponse,
                journalResponse,
                questResponse
            ] = await Promise.allSettled([
                getCurrentUser(),
                getStreak(),
                getLevel(),
                getJournalEntries(0, 100),
                getTodayQuest()
            ]);

            if (userResponse.status === "fulfilled") {
                setUserName(userResponse.value.data.result?.fullName ?? "");
            }

            setQuickStats({
                currentStreak: streakResponse.status === "fulfilled"
                    ? streakResponse.value?.currentStreak ?? 0
                    : 0,
                totalXp: levelResponse.status === "fulfilled"
                    ? levelResponse.value?.xp ?? 0
                    : 0,
                totalJournals: journalResponse.status === "fulfilled"
                    ? journalResponse.value.data.result?.totalElements
                        ?? journalResponse.value.data.result?.content?.length
                        ?? 0
                    : 0,
                activeSideQuests: questResponse.status === "fulfilled"
                    ? questResponse.value.data.result?.length ?? 0
                    : 0
            });
        };

        loadDashboardStats();
    }, []);

    const stats = [
        {
            label: "Current Streak",
            value: quickStats.currentStreak,
            icon: Flame,
            className: "bg-orange-50 text-orange-500"
        },
        {
            label: "Total XP",
            value: quickStats.totalXp,
            icon: Star,
            className: "bg-amber-50 text-amber-500"
        },
        {
            label: "Total Journal Entries",
            value: quickStats.totalJournals,
            icon: BookOpen,
            className: "bg-sky-50 text-sky-500"
        },
        {
            label: "Active Side Quests",
            value: quickStats.activeSideQuests,
            icon: Target,
            className: "bg-violet-50 text-violet-500"
        }
    ];

    return (

        <div className="space-y-8">
            <div className="animate-in fade-in duration-300">

                <h1 className="text-4xl font-bold text-slate-900">
                    {getGreeting()}{userName ? `, ${userName}` : ""} 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Let's take care of your mind today.
                </p>

            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.className}`}>
                                    <Icon size={20} />
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                                        <AnimatedValue value={stat.value} />
                                    </p>

                                    <p className="text-sm font-medium text-gray-500">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-4">

                    <TodayMoodCard />

                </div>

                <div className="col-span-12 xl:col-span-8">

                    <MoodSummaryChart />

                </div>

                <div className="col-span-12 xl:col-span-7">

                    <CalendarPreview />

                </div>

                <div className="col-span-12 xl:col-span-5">

                    <SideQuestPreview />

                </div>
            </div>
        </div>

    );

}
