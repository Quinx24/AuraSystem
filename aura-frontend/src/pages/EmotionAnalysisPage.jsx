import { useEffect, useState } from "react";
import {
    getSideQuestByEmotion,
    addSideQuest
} from "../services/sideQuestService";
import { getJournalEntryById } from "../services/journalService";
import { emotionConfig } from "../utils/emotionUtils";
import EmotionSummary from "../components/journal/EmotionSummary";
import { useParams } from "react-router-dom";
import SideQuestSuggestion from "../components/SideQuestSuggestion";
import EmotionAnalysisCard from "../components/journal/EmotionAnalysisCard";
import MoodSummaryCard from "../components/journal/MoodSummaryCard";
import JournalStatsCard from "../components/journal/JournalStatsCard";

export default function EmotionAnalysisPage() {

    const [journal, setJournal] = useState(null);

    const [sideQuests, setSideQuests] = useState([]);

    const { id } = useParams();

    const formatDate = (dateString) => {

        return new Date(dateString)
            .toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getJournalEntryById(id);

                const journalData = response.data.result
                setJournal(journalData);

                const sideQuestResponse =
                    await getSideQuestByEmotion(
                        journalData.primaryEmotion
                    );

                setSideQuests(sideQuestResponse.data.result);

            } catch (error) {
                console.error(error);
            }
        };

        loadData();
    }, [id]);

    if (!journal) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <div
                    className="
                    w-16
                    h-16
                    border-4
                    border-purple-200
                    border-t-purple-600
                    rounded-full
                    animate-spin
                "
                />

                <h2 className="mt-6 text-2xl font-bold">
                    Analyzing your emotions...
                </h2>

                <p className="text-gray-500 mt-2">
                    Aura is processing your journal entry
                </p>
            </div>
        );
    }

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
        <div className="space-y-6">

            <h1 className="text-4xl font-bold">
                Emotion Analysis Results
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* LEFT */}

                <div className="xl:col-span-3 space-y-6">

                    <EmotionAnalysisCard
                        emotion={journal.primaryEmotion}
                        confidence={journal.confidence}
                        emotions={journal.emotions}
                    />

                    {/* EMOTION DETAILS */}

                    <div className="bg-white rounded-3xl p-6 shadow-sm">

                        <h2 className="text-xl font-semibold mb-6">
                            Emotion Details
                        </h2>

                        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">

                            {top5Emotions
                                .map((emotions) => {

                                    const config =
                                        emotionConfig[emotions.emotion];

                                    return (
                                        <div
                                            key={emotions.emotion}
                                            className={`
                                            ${config.bg}
                                            rounded-3xl
                                            p-5
                                            border
                                            border-gray-100
                                            min-h-[220px]
                                        `}
                                        >

                                            {/* Header */}

                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">
                                                    {config.emoji}
                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-lg">
                                                        {config.label}
                                                    </h3>

                                                    <p className="font-semibold text-gray-700">
                                                        {(emotions.score * 100).toFixed(0)}%
                                                    </p>

                                                </div>

                                            </div>

                                            {/* Description */}

                                            <p className="text-gray-600 text-center leading-8 mt-6">
                                                {config.description}
                                            </p>

                                        </div>

                                    );

                                })}

                        </div>

                    </div>

                    <SideQuestSuggestion
                        sideQuests={sideQuests}
                    />

                </div>

                {/* RIGHT SIDEBAR */}

                <div className="space-y-6">

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