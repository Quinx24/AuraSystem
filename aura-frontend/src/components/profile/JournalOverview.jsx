import { useEffect, useState } from "react";
import { getJournalEntries } from "../../services/journalService";
import EmotionDonutChart from "./EmotionDonutChart";
import EmotionProgressItem from "./EmotionProgressItem";
import { emotionConfig } from "../../utils/emotionUtils";
import { PieChart } from "lucide-react";

export default function JournalOverview() {

    const [emotionSummary, setEmotionSummary] = useState({});

    const total = Object.values(emotionSummary).reduce(
        (sum, count) => sum + count,
        0
    );

    useEffect(() => {
        let isActive = true;

        const loadSummarySafely = async () => {
            try {
                const response = await getJournalEntries(0, 100);
                if (!isActive) return;

                const journals = response.data.result.content;
                const summary = {};

                journals.forEach((journal) => {
                    const emotion = journal.primaryEmotion;
                    summary[emotion] = (summary[emotion] || 0) + 1;
                });

                setEmotionSummary(summary);
            } catch {
                if (!isActive) return;
                setEmotionSummary({});
            }
        };

        void loadSummarySafely();

        return () => {
            isActive = false;
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

            <div className="flex items-center gap-3 mb-2">

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
                    <PieChart size={22} />
                </div>

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Journal Overview
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-0.5
                        "
                    >
                        Emotional distribution from your journals
                    </p>

                </div>

            </div>

            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-8
                    xl:grid-cols-12
                    xl:gap-10
                "
            >

                <div className="min-w-0 xl:col-span-7">

                    <div className="space-y-5">

                        {

                            Object.entries(emotionSummary).map(
                                ([emotion, count]) => (
                                    <EmotionProgressItem
                                        key={emotion}
                                        emoji={emotionConfig[emotion].emoji}
                                        label={emotionConfig[emotion].label}
                                        color={emotionConfig[emotion].color}
                                        count={count}
                                        percentage={Math.round((count / total) * 1000) / 10}
                                    />
                                )
                            )

                        }

                    </div>

                </div>

                <div className="min-w-0 xl:col-span-5">

                    <EmotionDonutChart
                        summary={emotionSummary}
                    />

                </div>

            </div>

        </div>

    );

}
