import EmotionChart from "./EmotionChart";
import EmotionSummary from "./EmotionSummary";

export default function EmotionAnalysisCard({
    emotion,
    confidence,
    emotions
}) {
    return (

        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-6">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Primary Emotion
                    </h2>

                    <EmotionSummary
                        emotion={emotion}
                        confidence={confidence}
                        showDescription={true}
                        width="w-72"
                    />

                </div>

                <div className="min-w-0 lg:border-l lg:border-gray-200 lg:pl-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Emotion Distribution
                    </h2>

                    <EmotionChart
                        emotions={emotions}
                    />

                </div>

            </div>

        </div >
    );
}
