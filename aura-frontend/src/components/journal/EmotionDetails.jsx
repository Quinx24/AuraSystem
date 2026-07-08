import { emotionConfig } from "../../utils/emotionUtils";

export default function EmotionDetails({
    emotions
}) {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-6">

            <h2 className="text-xl font-semibold mb-6">
                Emotion Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                {emotions.map((item) => {

                    const config =
                        emotionConfig[item.emotion] ?? {
                            bg: "bg-gray-100",
                            emoji: "❓",
                            label: item.emotion,
                            description: "No description available."
                        };

                    return (
                        <div
                            key={item.emotion}
                            className={`
                                ${config.bg}
                                rounded-3xl
                                p-5
                                border
                                border-gray-100
                                min-h-[180px]
                                md:min-h-[220px]
                            `}
                        >

                            <div className="flex items-center gap-3">

                                <div className="text-3xl md:text-4xl">
                                    {config.emoji}
                                </div>

                                <div>

                                    <h3 className="font-bold text-lg">
                                        {config.label}
                                    </h3>

                                    <p className="font-semibold text-gray-700">
                                        {(item.score * 100).toFixed(0)}%
                                    </p>

                                </div>

                            </div>

                            <p className="text-gray-600 text-center leading-8 mt-6">
                                {config.description}
                            </p>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}
