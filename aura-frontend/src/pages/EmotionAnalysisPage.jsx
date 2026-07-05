import { useEffect, useState } from "react";
import {
    getSideQuestByEmotion,
    addSideQuest
} from "../services/sideQuestService";
import { getJournalEntryById } from "../services/journalService";

import EmotionChart from "../components/EmotionChart";
import { emotionConfig } from "../utils/emotionUtils";
import EmotionSummary from "../components/EmotionSummary";
import { useParams } from "react-router-dom";
import SideQuestSuggestion from "../components/SideQuestSuggestion";

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

    const wordCount = journal.journalContent.trim().split(/\s+/).length

    const characterCount = journal.journalContent.length;

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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

                    {/* TOP CARD */}

                    <div className="bg-white rounded-3xl p-6 shadow-sm">

                        <div className="grid lg:grid-cols-2 gap-6">

                            <div>

                                <h2 className="text-xl font-semibold mb-4">
                                    Primary Emotion
                                </h2>

                                <EmotionSummary
                                    emotion={journal.primaryEmotion}
                                    confidence={journal.confidence}
                                    showDescription={true}
                                    width="w-72"
                                />

                            </div>

                            <div className="lg:border-l lg:border-gray-200 lg:pl-8">

                                <h2 className="text-xl font-semibold mb-4">
                                    Emotion Distribution
                                </h2>

                                <EmotionChart
                                    emotions={journal.emotions}
                                />

                            </div>

                        </div>

                    </div>

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

                    <div className="bg-white rounded-3xl p-6 shadow-sm">

                        <h2 className="font-semibold text-lg mb-4">
                            Mood Summary
                        </h2>

                        <EmotionSummary
                            emotion={journal.primaryEmotion}
                            confidence={journal.confidence}
                            showDescription={false}
                            width="w-50"
                        />

                        <hr className="my-6 border-gray-200" />

                        <h3 className="font-semibold mb-4">
                            Emotions Detected
                        </h3>

                        <div className="flex flex-wrap gap-3">

                            {top3Emotions
                                .map((emotion) => {

                                    const config =
                                        emotionConfig[emotion.emotion];

                                    return (

                                        <div
                                            key={emotion.emotion}
                                            className={`
                                                ${config.bg}
                                                px-4
                                                py-2
                                                rounded-full
                                                flex
                                                items-center
                                                gap-2
                                            `}
                                        >

                                            <span>
                                                {config.emoji}
                                            </span>

                                            <span className="text-sm font-medium">
                                                {config.label}
                                            </span>

                                        </div>

                                    );

                                })}

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">

                        <h2 className="font-semibold text-lg mb-4">
                            Journal Stats
                        </h2>

                        <div className="space-y-4">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Words
                                </span>

                                <span className="font-semibold">
                                    {wordCount}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Characters
                                </span>

                                <span className="font-semibold">
                                    {characterCount}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Reading Time
                                </span>

                                <span className="font-semibold">
                                    ~ {readingTime} min
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    Created
                                </span>

                                <span className="font-semibold text-right">
                                    {formatDate(journal.createdAt)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    Last Updated
                                </span>

                                <span className="font-semibold text-right">
                                    {formatDate(
                                        journal.updatedAt || journal.createdAt
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}