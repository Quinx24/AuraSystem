import { emotionConfig } from "../../utils/emotionUtils";

export default function MoodStatistics({ emotionSummary }) {

    return (

        <div className="grid grid-cols-7 gap-3 mt-5">

            {

                Object.entries(emotionConfig).map(([emotion, config], index) => {

                    const count =
                        emotionSummary[emotion] || 0;

                    return (

                        <div
                            key={index}
                            className={`
                                rounded-xl
                                py-3
                                text-center
                                ${config ? config.bg : "bg-gray-50"}
                            `}
                        >

                            <p
                                className="
                                    text-2xl
                                    font-bold
                                "
                            >
                                {count}
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    mt-1
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