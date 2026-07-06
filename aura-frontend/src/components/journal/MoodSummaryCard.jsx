import EmotionSummary from "./EmotionSummary";
import { emotionConfig } from "../../utils/emotionUtils";

export default function MoodSummaryCard({
    emotion,
    confidence,
    emotions
}) {
    return (

        <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="font-semibold text-lg mb-4">
                Mood Summary
            </h2>

            <EmotionSummary
                emotion={emotion}
                confidence={confidence}
                showDescription={false}
                width="w-50"
            />

            <hr className="my-6 border-gray-200" />

            <h3 className="font-semibold mb-4">
                Emotions Detected
            </h3>

            <div className="flex flex-wrap gap-3">

                {emotions.map((item) => {

                    const config =
                        emotionConfig[item.emotion];

                    return (

                        <div
                            key={item.emotion}
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
    );
}