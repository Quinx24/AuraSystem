import MoodSummaryCard from "../components/journal/MoodSummaryCard";
import JournalStatsCard from "../components/journal/JournalStatsCard";
import EmotionDetails from "../components/journal/EmotionDetails";
import JournalCard from "../components/journal/JournalCard";
import CompletedQuestCard from "../components/journal/CompletedQuestCard";
import JournalHistoryHeader from "../components/journal/JournalHistoryHeader";
import EmotionChartCard from "../components/journal/EmotionChartCard";
import MemoryCard from "../components/journal/MemoryCard";
import NoteCard from "../components/journal/NoteCard";
import RelatedCard from "../components/journal/RelatedCard";

export default function JournalHistoryPage() {

    const journal = {

        id: 1,

        journalContent:
            `Today was one of the most productive days I've had this week.

I finished implementing the Journal History feature and successfully refactored several reusable components. Although there were still a few bugs to fix, I felt motivated and excited because everything was gradually coming together.

Tomorrow I want to continue improving the Calendar Tracker and connect it with the backend API.`,

        noteToSelf:
            "Keep coding consistently. Small improvements every day will eventually become something great.",

        primaryEmotion: "HAPPY",

        confidence: 0.91,

        createdAt: "2026-07-07T09:30:00",

        updatedAt: "2026-07-07T10:15:00",

        memoryPhoto: null,

        tags: [
            "Coding",
            "Project",
            "Growth"
        ],

        emotions: [

            {
                emotion: "HAPPY",
                score: 0.91
            },

            {
                emotion: "EXCITED",
                score: 0.73
            },

            {
                emotion: "NEUTRAL",
                score: 0.48
            },

            {
                emotion: "STRESS",
                score: 0.21
            },

            {
                emotion: "ANXIETY",
                score: 0.09
            }

        ]

    };

    const completedQuests = [

        {
            id: 1,
            title: "Drink 2L Water",
            description: "Stay hydrated throughout the day.",
            completedAt: "08:30"
        },

        {
            id: 2,
            title: "Read 20 Minutes",
            description: "Continue reading Atomic Habits.",
            completedAt: "15:20"
        },

        {
            id: 3,
            title: "Go For A Walk",
            description: "Walk outside for 15 minutes.",
            completedAt: "18:45"
        }

    ];

    const wordCount =
        journal.journalContent.trim().split(/\s+/).length;

    const characterCount =
        journal.journalContent.length;

    const readingTime =
        Math.max(1, Math.ceil(wordCount / 200));

    const stats = {

        wordCount,

        characterCount,

        readingTime,

        createdAt: journal.createdAt,

        updatedAt: journal.updatedAt

    };

    const sortedEmotions =
        [...journal.emotions]
            .sort((a, b) => b.score - a.score);

    const top3Emotions =
        sortedEmotions.slice(0, 3);

    const top5Emotions =
        sortedEmotions.slice(0, 5);

    return (

        <div className="space-y-6">

            <JournalHistoryHeader

                createdAt={journal.createdAt}

            />

            <div className="grid grid-cols-12 gap-6">

                {/* LEFT */}

                <div className="col-span-9 space-y-6">

                    {/* Journal + Memory */}

                    <div className="grid grid-cols-9 gap-6">

                        <div className="col-span-6">

                            <JournalCard
                                journal={journal}
                            />

                        </div>

                        <div className="col-span-3 space-y-6">

                            <MemoryCard
                                memoryPhoto={journal.memoryPhoto}
                                mode="view"
                            />

                            <NoteCard
                                note={journal.noteToSelf}
                                mode="view"
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-6 gap-6">

                        <div className="col-span-3">

                            <EmotionChartCard
                                emotions={journal.emotions}
                            />

                        </div>

                        <div className="col-span-3">

                            <CompletedQuestCard
                                quests={completedQuests}
                            />

                        </div>

                    </div>

                    <EmotionDetails
                        emotions={top5Emotions}
                    />

                </div>

                {/* RIGHT */}

                <div className="col-span-3 space-y-6">

                    <MoodSummaryCard
                        emotion={journal.primaryEmotion}
                        confidence={journal.confidence}
                        emotions={top3Emotions}
                    />

                    <RelatedCard />

                    <JournalStatsCard
                        stats={stats}
                    />

                </div>

            </div>

        </div>

    );

}