import StatisticItem from "./StatisticItem";
import { useEffect, useState } from "react";
import { getStreak } from "../../services/streakService";

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

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadStatistics();
    }, []);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-4
                md:p-6
            "
        >

            <div className="flex items-center gap-3 mb-6">

                <div
                    className="
                        w-10
                        h-10
                        rounded-xl
                        bg-violet-100
                        flex
                        items-center
                        justify-center
                    "
                >
                    📊
                </div>

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-gray-900
                        "
                    >
                        My Statistics
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-400
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
