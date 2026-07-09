export default function StatisticItem({

    icon,

    title,

    value,

    bgColor

}) {

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                flex
                flex-col
                items-center
                justify-center
                text-center
            "
        >

            <div
                className="
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                "

                style={{
                    backgroundColor: bgColor
                }}

            >

                {icon}

            </div>

            <h2
                className="
                    mt-6
                    text-3xl
                    font-semibold
                    text-slate-900
                "
            >
                {value}
            </h2>

            <p
                className="
                    mt-3
                    text-gray-500
                    text-sm
                "
            >

                {title}

            </p>

        </div>

    );

}