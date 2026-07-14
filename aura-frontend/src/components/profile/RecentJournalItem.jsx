import { useNavigate } from "react-router-dom";
import { emotionConfig } from "../../utils/emotionUtils";

export default function RecentJournalItem({
    id,
    emotion,
    date,
    time,
    content
}) {
    const navigate = useNavigate();
    const config = emotionConfig[emotion];

    return (

        <div
            className={`
                rounded-2xl
                border
                border-gray-100
                p-5
                transition-all
                duration-300
                hover:shadow-md
                ${config.bg}
            `}
        >

            <div className="flex items-center gap-3">

                <span className="text-3xl">
                    {config.emoji}
                </span>

                <div>

                    <h3
                        className={`
                            text-lg
                            font-bold
                            ${config.text}
                        `}
                    >
                        {config.label}
                    </h3>

                    <p
                        className="
                            text-sm
                            text-gray-400
                        "
                    >
                        {date} • {time}
                    </p>

                </div>

            </div>

            <p
                className="
                    mt-5
                    text-gray-600
                    leading-7
                    line-clamp-2
                "
            >
                {content}
            </p>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => navigate(`/journal-history/${id}`)}
                    className="
                        inline-flex
                        items-center
                        gap-1
                        text-violet-600
                        font-semibold
                        transition
                        duration-200
                        hover:text-violet-700
                        hover:underline
                        hover:-translate-y-0.5
                    "
                >
                    Read More →
                </button>
            </div>

        </div>

    );

}
