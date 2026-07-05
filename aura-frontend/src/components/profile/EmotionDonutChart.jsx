import { emotionConfig } from "../../utils/emotionUtils";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#8B5CF6",
    "#FBBF24",
    "#34D399",
    "#FB7185",
    "#60A5FA",
    "#F87171",
    "#A78BFA",
];

export default function EmotionDonutChart({ summary }) {
    const data = Object.entries(summary).map(

        ([emotion, count]) => ({

            emotion,

            label: emotionConfig[emotion].label,

            value: count

        })

    );

    const total = data.reduce(

        (sum, item) => sum + item.value,

        0

    );

    return (
        <div className="flex items-center justify-center gap-8">

            <div className="w-[260px] h-[260px]">
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="45%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <text
                            x="45%"
                            y="45%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >

                            <tspan
                                fontSize="28"
                                fontWeight="bold"
                                fill="#111827"
                            >
                                {total}
                            </tspan>

                            <tspan
                                x="45%"
                                dy="22"
                                fontSize="13"
                                fill="#9CA3AF"
                            >
                                Journals
                            </tspan>

                        </text>

                        <Tooltip
                            formatter={(value) => [`${value} Journals`, "Count"]}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            <div className="space-y-4">

                {data.map((item, index) => (

                    <div
                        key={item.emotion}
                        className="flex items-center justify-between gap-8 min-w-[180px]"
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor:
                                        COLORS[index % COLORS.length]
                                }}
                            />

                            <span className="font-medium">
                                {item.label}
                            </span>

                        </div>

                        <div className="text-right">

                            <p
                                className="
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {item.value}
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-gray-400
                                "
                            >
                                {
                                    ((item.value / total) * 100)
                                        .toFixed(1)
                                }%
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}