import EmotionChart from "./EmotionChart";
import EmotionSummary from "./EmotionSummary";

export default function EmotionAnalysisCard({
    emotion,
    confidence,
    emotions
}) {
    return (

        <div className="bg-white rounded-3xl p-6 shadow-sm">

            <div className="grid lg:grid-cols-2 gap-6">

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

                <div className="lg:border-l lg:border-gray-200 lg:pl-8">

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