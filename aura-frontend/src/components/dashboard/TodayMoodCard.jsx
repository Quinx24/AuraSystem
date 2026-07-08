import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine } from "lucide-react";

import { getJournalEntries } from "../../services/journalService";
import { emotionConfig } from "../../utils/emotionUtils";

const emotionDescriptions = {
    HAPPY: "You've been feeling positive today.",
    SAD: "You've had a softer emotional tone today.",
    ANGRY: "You've been carrying some frustration today.",
    STRESS: "You've been under some pressure today.",
    ANXIETY: "You've been feeling a little uncertain today.",
    NEUTRAL: "You've been feeling steady and balanced today.",
    EXCITED: "You've been feeling energized today."
};

const formatLastUpdated = (value) => {
    if (!value) {
        return "No journal yet";
    }

    const date = new Date(value);
    const isToday = date.toDateString() === new Date().toDateString();
    const dayLabel = isToday
        ? "Today"
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

    return `${dayLabel}, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
};

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadLatestJournalEntry();
    }, []);

    const emotion = latestJournalEntry?.primaryEmotion;
    const config = emotionConfig[emotion];

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                p-6
                shadow-sm
                h-full
                flex
                flex-col
                justify-between
                transition
                duration-300
                hover:shadow-md
            "
        >

            <div>

                <h2 className="text-xl font-bold text-slate-900">
                    Today's Mood
                </h2>

                <p className="text-gray-500 mt-1">
                    Your latest emotion analysis
                </p>

            </div>

            <div className="flex flex-col items-center mt-8">

                <div className="grid h-20 w-20 place-items-center rounded-full bg-violet-50 text-5xl shadow-inner md:h-24 md:w-24 md:text-6xl">
                    {config?.emoji ?? "☁️"}
                </div>

                <h3 className="text-2xl font-bold mt-4 text-slate-900">
                    {config?.label ?? "No Journal"}
                </h3>

                {latestJournalEntry ? (
                    <>
                        <p className="mt-3 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-600">
                            Confidence {Math.round(latestJournalEntry.confidence * 100)}%
                        </p>

                        <p className="mt-4 text-sm font-medium text-gray-400">
                            Last updated: {formatLastUpdated(latestJournalEntry.createdAt)}
                        </p>

                        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                            {emotionDescriptions[emotion] ?? "Your mood has been recorded today."}
                        </p>
                    </>
                ) : (
                    <p className="mt-4 max-w-[220px] text-center text-sm leading-6 text-gray-500">
                        Start a journal entry to see today's mood here.
                    </p>
                )}

            </div>

            <button
                onClick={() => navigate("/journal")}
                className="
                    mt-8
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-violet-600
                    py-3
                    font-semibold
                    text-white
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-violet-700
                    active:translate-y-0
                "
            >
                <PenLine size={18} />
                Write Journal
            </button>

        </div>

    );

}
