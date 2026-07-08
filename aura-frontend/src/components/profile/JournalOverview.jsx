import { useEffect, useState } from "react";
import { getJournalEntries } from "../../services/journalService";
import EmotionDonutChart from "./EmotionDonutChart";
import EmotionProgressItem from "./EmotionProgressItem";
import { emotionConfig } from "../../utils/emotionUtils";

export default function JournalOverview() {

    const [emotionSummary, setEmotionSummary] = useState({});

    const total = Object.values(emotionSummary).reduce(

        (sum, count) => sum + count,

        0

    );

    const loadSummary = async () => {

        const response = await getJournalEntries(
            0,
            100
        );

        const journals = response.data.result.content;

        const summary = {};

        journals.forEach(journal => {

            const emotion = journal.primaryEmotion;

            summary[emotion] =
                (summary[emotion] || 0) + 1;

        });

        setEmotionSummary(summary);

    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSummary();

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
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                "
            >
                Journal Overview
            </h2>

            <p
                className="
                    text-sm
                    text-gray-400
                    mt-1
                "
            >
                Emotional distribution from your journals.
            </p>

            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-12
                    xl:gap-8
                "
            >

                <div className="min-w-0 xl:col-span-7">

                    <div className="space-y-6">

                        {

                            Object.entries(emotionSummary).map(

                                ([emotion, count]) => (

                                    <EmotionProgressItem

                                        key={emotion}

                                        emoji={

                                            emotionConfig[emotion].emoji

                                        }

                                        label={

                                            emotionConfig[emotion].label

                                        }

                                        color={
                                            emotionConfig[emotion].color
                                        }

                                        count={count}

                                        percentage={
                                            Math.round(
                                                (count / total) * 1000
                                            ) / 10
                                        }

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
