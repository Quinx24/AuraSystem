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
import { getJournalEntryById } from "../services/journalService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function JournalHistoryPage() {

    const { id } = useParams();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                setLoading(true);
                const response = await getJournalEntryById(id);
                setJournal(response.data.result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJournal();
        }
    }, [id]);

    if (loading) {
        return <div className="p-8">Loading journal...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    if (!journal) {
        return <div className="p-8">Journal not found</div>;
    }

    const completedQuests = journal.sideQuests
        ?.filter(q => q.completed)
        ?.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            completedAt: q.completedDate ? new Date(q.completedDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
        })) || [];

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

        <div className="space-y-8">

            <JournalHistoryHeader

                createdAt={journal.createdAt}

            />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">

                {/* LEFT */}

                <div className="min-w-0 space-y-8 xl:col-span-9">

                    {/* Journal + Memory */}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">

                        <div className="min-w-0 lg:col-span-6">

                            <JournalCard
                                journal={journal}
                            />

                        </div>

                        <div className="min-w-0 space-y-6 lg:col-span-3">

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

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">

                        <div className="min-w-0 lg:col-span-3">

                            <EmotionChartCard
                                emotions={journal.emotions}
                            />

                        </div>

                        <div className="min-w-0 lg:col-span-3">

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

                <div className="min-w-0 space-y-8 xl:col-span-3">

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
