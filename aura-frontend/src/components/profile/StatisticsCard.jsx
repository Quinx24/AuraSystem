import StatisticItem from "./StatisticItem";
import { useEffect, useState } from "react";
import { getStreak } from "../../services/streakService";
import { BarChart3 } from "lucide-react";

export default function StatisticsCard() {

    const [statistics, setStatistics] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIn: 0,
        dominantEmotion: "Happy",
        totalJournals: 36,
        completedQuests: 18,
    });

    const loadStatistics = async () => {
        try {
            const streak = await getStreak();
            setStatistics(prev => ({
                ...prev,
                currentStreak: streak.currentStreak,
                longestStreak: streak.longestStreak,
                totalCheckIn: streak.totalCheckIn
            }));
        } catch {
            setStatistics(prev => ({
                ...prev,
                currentStreak: 0,
                longestStreak: 0,
                totalCheckIn: 0
            }));
        }
    };

    useEffect(() => {
        let isMounted = true;

        Promise.resolve().then(() => {
            if (isMounted) loadStatistics();
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
                md:p-8
            "
        >

            <div className="flex items-center gap-3 mb-8">

                <div
                    className="
                        w-11
                        h-11
                        rounded-xl
                        bg-gradient-to-br from-violet-100 to-violet-50
                        flex
                        items-center
                        justify-center
                        text-violet-600
                    "
                >
                    <BarChart3 size={22} />
                </div>

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        My Statistics
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-0.5
                        "
                    >
                        Your emotional journey at a glance
                    </p>

                </div>

            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                    xl:gap-5
                "
            >
                <StatisticItem

                    icon="🔥"

                    title="Current Streak"

                    value={`${statistics.currentStreak} ${statistics.currentStreak === 1 ? "Day" : "Days"
                        }`}

                    bgColor="#FEF3C7"

                />

                <StatisticItem

                    icon="😊"

                    title="Dominant Emotion"

                    value={statistics.dominantEmotion}

                    bgColor="#F3E8FF"

                />

                <StatisticItem

                    icon="📖"

                    title="Total Journals"

                    value={statistics.totalJournals}

                    bgColor="#DBEAFE"

                />

                <StatisticItem

                    icon="🎯"

                    title="Completed Quests"

                    value={statistics.completedQuests}

                    bgColor="#DCFCE7"

                />
            </div>

        </div>

    );
}
