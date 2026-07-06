import { emotionConfig } from "../../utils/emotionUtils";

export default function EmotionDetails({
    emotions
}) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold mb-6">
                Emotion Details
            </h2>

            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">

                {emotions.map((item) => {

                    const config =
                        emotionConfig[item.emotion];

                    return (
                        <div
                            key={item.emotion}
                            className={`
                                ${config.bg}
                                rounded-3xl
                                p-5
                                border
                                border-gray-100
                                min-h-[220px]
                            `}
                        >

                            <div className="flex items-center gap-3">

                                <div className="text-4xl">
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