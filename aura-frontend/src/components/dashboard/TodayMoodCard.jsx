import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJournalEntries } from "../../services/journalService";
import { emotionConfig } from "../../utils/emotionUtils";

export default function TodayMoodCard() {

    const [latestJournalEntry, setLatestJournalEntry] = useState(null);

    const navigate = useNavigate();

    const loadLatestJournalEntry = async () => {

        try {
            const response = await getJournalEntries(
                0,
                1
            );

            const journals = response.data.result.content;

            if (journals.length > 0) {
                setLatestJournalEntry(journals[0]);
            }
        } catch (error) {
            console.error("Error fetching journal entries:", error);
        }
    };

    useEffect(() => {
        loadLatestJournalEntry();
    }, []);

    console.log("Latest Journal Entry:", latestJournalEntry);

    return (

        <div
            className="
            bg-white
            rounded-3xl
            p-6
            shadow-sm
            h-full
            flex
            flex-col
            justify-between
        "
        >

            <div>

                <h2 className="text-xl font-bold">
                    Today's Mood
                </h2>

                <p className="text-gray-500 mt-1">
                    Your latest emotion analysis
                </p>

            </div>

            <div
                className="
                flex
                flex-col
                items-center
                mt-8
            "
            >

                <div className="text-7xl">

                    {
                        latestJournalEntry
                            ? emotionConfig[
                                latestJournalEntry.primaryEmotion
                            ]?.emoji
                            : "☁️"
                    }

                </div>

                <h3
                    className="
                    text-2xl
                    font-bold
                    mt-4
                "
                >

                    {
                        latestJournalEntry
                            ? emotionConfig[
                                latestJournalEntry.primaryEmotion
                            ]?.label
                            : "No Journal"
                    }

                </h3>

                {
                    latestJournalEntry && (

                        <p
                            className="
                            mt-3
                            text-sm
                            text-gray-500
                        "
                        >
                            Confidence {" "}
                            {
                                Math.round(
                                    latestJournalEntry.confidence * 100
                                )
                            }
                            %
                        </p>

                    )
                }

            </div>

            <button
                onClick={() => navigate("/journal")}
                className="
                mt-8
                w-full
                py-3
                rounded-2xl
                bg-violet-600
                text-white
                font-semibold
                hover:bg-violet-700
                transition
            "
            >
                Write Journal
            </button>

        </div>

    );

}