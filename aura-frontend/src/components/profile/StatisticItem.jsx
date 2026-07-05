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

            <p
                className="
                    mt-5
                    text-gray-500
                    text-sm
                "
            >

                {title}

            </p>

            <h2
                className="
                    mt-2
                    text-2xl
                    font-bold
                    text-gray-900
                "
            >
                {value}
            </h2>

        </div>

    );

}