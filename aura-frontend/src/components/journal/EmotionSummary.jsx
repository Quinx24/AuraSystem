import { emotionConfig } from "../../utils/emotionUtils";

export default function EmotionSummary({
    emotion,
    confidence,
    title,
    showDescription = false,
    width = "w-full"
}) {

    const config = emotionConfig[emotion];

    const intensity =
        Math.round(confidence * 10);

    return (

        <div>

            {title && (

                <h2 className="text-xl font-semibold mb-4">
                    {title}
                </h2>

            )}

            <div className="flex items-center gap-6">

                <div className="text-7xl">
                    {config?.emoji}
                </div>

                <div className="flex-1">

                    <h3 className="text-4xl font-bold text-purple-600 mb-6">
                        {config?.label}
                    </h3>

                    <p className="mt-4 font-medium">
                        Intensity: {intensity}/10
                    </p>

                    <div
                        className={`mt-4 ${width} bg-gray-200 rounded-full h-3`}
                    >

                        <div
                            className="bg-purple-500 h-3 rounded-full"
                            style={{
                                width: `${confidence * 100}%`
                            }}
                        />

                    </div>

                    {showDescription && (

                        <p className="text-gray-600 mt-8 leading-7 max-w-md">
                            {config?.description}
                        </p>

                    )}

                </div>

            </div>

        </div>

    );
}