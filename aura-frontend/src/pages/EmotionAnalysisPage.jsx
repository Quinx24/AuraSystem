import { useEffect, useState } from "react";
import { getJournalEntryById } from "../services/journalService";
import { getRecommendedSideQuests } from "../api/sideQuestApi";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageIntroduction from "../components/PageIntroduction";
import SideQuestSuggestion from "../components/SideQuestSuggestion";
import EmotionAnalysisCard from "../components/journal/EmotionAnalysisCard";
import MoodSummaryCard from "../components/journal/MoodSummaryCard";
import JournalStatsCard from "../components/journal/JournalStatsCard";
import EmotionDetails from "../components/journal/EmotionDetails";
import { usePageMeta } from "../contexts/PageMetaContext";

export default function EmotionAnalysisPage() {

    const [journal, setJournal] = useState(null);

    const [recommendations, setRecommendations] = useState([]);

    const { id } = useParams();

    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Emotion Analysis Results", breadcrumb: ["Home", "Emotion Analysis"] });
        return () => setPage({});
    }, [id, setPage]);

    useEffect(() => {
        let isMounted = true;

        const mapRecommendation = (result) => ({
            ...result.quest,
            recommendation: {
                score: result.score,
                explanations: result.explanations ?? [],
                confidence: result.confidence,
                recommendationTime: result.recommendationTime
            }
        });

        const loadData = async () => {
            try {
                const response = await getJournalEntryById(id);
                const loadedJournal = response.data.result;

                if (!isMounted) return;

                setJournal(loadedJournal);

                try {
                    const recommendationResults = await getRecommendedSideQuests({
                        emotion: loadedJournal?.primaryEmotion,
                        limit: 3
                    });

                    if (!isMounted) return;

                    setRecommendations(
                        (recommendationResults ?? []).map(mapRecommendation)
                    );
                } catch {
                    if (!isMounted) return;

                    setRecommendations(loadedJournal?.sideQuests ?? []);
                }
            } catch {
                // Error silently ignored - data will remain empty
            }
        };

        if (id) loadData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (!journal) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-100 text-violet-600">
                    <Loader2 size={32} className="animate-spin" />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                    Analyzing your emotions...
                </h2>

                <p className="text-gray-500 mt-2">
                    Aura is processing your journal entry
                </p>
            </div>
        );
    }

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

        updatedAt: journal.updatedAt || journal.createdAt

    };

    const sortedEmotions = [...journal.emotions]
        .sort((a, b) => b.score - a.score);

    const top5Emotions = sortedEmotions.slice(0, 5);

    const top3Emotions = sortedEmotions.slice(0, 3);

    return (
        <div className="space-y-8">
            <PageIntroduction />
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* LEFT */}

                <div className="xl:col-span-3 space-y-8">

                    <EmotionAnalysisCard
                        emotion={journal.primaryEmotion}
                        confidence={journal.confidence}
                        emotions={journal.emotions}
                    />

                    {/* EMOTION DETAILS */}

                    <EmotionDetails 
                        emotions={top5Emotions}
                    />

                    {/* SIDE-QUESTS SUGGESTION  */}

                    <SideQuestSuggestion
                        sideQuests={
                            recommendations.length > 0
                                ? recommendations
                                : journal.sideQuests || []
                        }
                    />

                </div>

                {/* RIGHT SIDEBAR */}

                <div className="space-y-8">

                    <MoodSummaryCard
                        emotion={journal.primaryEmotion}
                        confidence={journal.confidence}
                        emotions={top3Emotions}
                    />

                    <JournalStatsCard
                        stats={stats}
                    />

                </div>

            </div>

        </div>
    );
}
