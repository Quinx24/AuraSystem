import { emotionConfig } from "../utils/emotionUtils";

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

export default function EmotionChart({ emotions }) {
    const data = emotions
        .slice(0, 5)
        .map((e) => ({
            emotion: e.emotion,
            label:
                emotionConfig[e.emotion]?.label
                || e.emotion,
            value: Number((e.score * 100).toFixed(2)),
        }));

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

                        <Tooltip />

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

                        <span className="text-gray-600">
                            {item.value.toFixed(1)}%
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}