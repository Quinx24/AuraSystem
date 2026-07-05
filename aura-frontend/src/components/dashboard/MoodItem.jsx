export default function MoodItem({
    icon,
    label,
    value,
    maxValue
}) {

    const percent =
        maxValue === 0
            ? 0
            : (value / maxValue) * 100;

    return (

        <div className="space-y-2">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <span className="text-2xl">
                        {icon}
                    </span>

                    <span className="text-[17px] font-medium text-gray-800">
                        {label}
                    </span>

                </div>

                <span className="text-sm font-medium text-gray-500">
                    {value}
                </span>

            </div>

            <div
                className="
                    w-full
                    h-3
                    bg-[#F2F3F7]
                    rounded-full
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        rounded-full
                        bg-violet-500
                        transition-all
                        duration-700
                        ease-out
                    "
                    style={{
                        width: `${percent}%`
                    }}
                />

            </div>

        </div>

    );

}