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

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">

                <div className="text-5xl md:text-6xl xl:text-7xl">
                    {config?.emoji}
                </div>

                <div className="min-w-0 flex-1">

                    <h3 className="mb-4 text-2xl font-bold text-purple-600 md:text-3xl xl:mb-6 xl:text-4xl">
                        {config?.label}
                    </h3>

                    <p className="mt-4 font-medium">
                        Intensity: {intensity}/10
                    </p>

                    <div
                        className={`mt-4 max-w-full ${width} bg-gray-200 rounded-full h-3`}
                    >

                        <div
                            className="bg-purple-500 h-3 rounded-full"
                            style={{
                                width: `${confidence * 100}%`
                            }}
                        />

                    </div>

                    {showDescription && (

                        <p className="mt-6 max-w-md text-gray-600 leading-7 md:mt-8">
                            {config?.description}
                        </p>

                    )}

                </div>

            </div>

        </div>

    );
}
