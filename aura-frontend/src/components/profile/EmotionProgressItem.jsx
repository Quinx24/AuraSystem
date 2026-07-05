export default function EmotionProgressItem({
    emoji,

    label,

    color,

    count,

    percentage
}) {

    return (

        <div
            className="
                space-y-3
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <span
                        className="
                            text-2xl
                        "
                    >
                        {emoji}
                    </span>

                    <span
                        className="
                            font-medium
                        "
                    >
                        {label}
                    </span>

                </div>

                <div
                    className="
                        text-right
                    "
                >

                    <p
                        className="
                            font-semibold
                        "
                    >
                        {count}
                    </p>

                    <p
                        className="
                            text-sm
                            text-gray-400
                        "
                    >
                        {percentage}%
                    </p>

                </div>

            </div>

            <div
                className="
                    h-2.5
                    rounded-full
                    bg-gray-100
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                    "
                    style={{
                        width: `${percentage}%`,

                        backgroundColor: color
                    }}
                />

            </div>

        </div>

    );

}