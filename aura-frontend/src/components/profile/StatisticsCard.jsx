import StatisticItem from "./StatisticItem";

export default function StatisticsCard() {

    const statistics = {

        streak: 7,

        dominantEmotion: "Happy",

        totalJournals: 36,

        completedQuests: 18

    };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
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
                    grid-cols-4
                    gap-5
                "
            >
                <StatisticItem

                    icon="🔥"

                    title="Current Streak"

                    value={`${statistics.streak} Days`}

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