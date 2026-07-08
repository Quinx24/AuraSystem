import { emotionConfig } from "../../utils/emotionUtils";

export default function MoodStatistics({ emotionSummary }) {

    return (

        <div className="grid grid-cols-2 gap-3 mt-5 md:grid-cols-4 xl:grid-cols-7">

            {

                Object.entries(emotionConfig).map(([emotion, config], index) => {

                    const count =
                        emotionSummary[emotion] || 0;

                    return (

                        <div
                            key={index}
                            className={`
                                rounded-xl
                                border
                                border-gray-100
                                py-3
                                text-center
                                shadow-sm
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:shadow-md
                                ${config ? config.bg : "bg-gray-50"}
                            `}
                        >

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {count}
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    mt-1
                                    text-gray-600
                                "
                            >
                                {config.label}
                            </p>
                        </div>

                    );

                })

            }

        </div>

    );

}
