import { useCallback, useEffect, useState } from "react";
import { getJournalEntries } from "../../services/journalService";
import { emotionValue } from "../../utils/emotionChartUtils";
import { emotionConfig } from "../../utils/emotionUtils";
import EmotionDot from "./EmotionDot";
import MoodStatistics from "./MoodStatistics";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function MoodTooltip({ active, payload }) {
    if (!active || !payload?.length) {
        return null;
    }

    const data = payload[0].payload;
    const config = emotionConfig[data.emotion];

    return (
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-md">
            <p className="text-sm font-bold text-slate-900">
                {data.day}
            </p>

            <p className="mt-1 text-sm font-medium text-gray-500">
                Emotion: {config?.label ?? "No journal"}
            </p>

            <p className="mt-1 text-sm font-medium text-gray-500">
                Journals: {data.journalCount ?? 0}
            </p>
        </div>
    );
}

export default function MoodSummaryChart() {

    const [chartData, setChartData] = useState([]);

    const [emotionSummary, setEmotionSummary] = useState({});

    const getLast7Days = () => {

        const days = [];

        for (let i = 6; i >= 0; i--) {

            const date = new Date();

            date.setHours(0, 0, 0, 0);

            date.setDate(date.getDate() - i);

            days.push({

                key: date.toISOString().split("T")[0],

                day: date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                )

            });

        }

        return days;

    };

    const loadChart = useCallback(async () => {

        const response = await getJournalEntries(
            0,
            100
        );

        const journals = response.data.result.content;

        const summary = {};

        journals.forEach(journal => {

            const emotion =
                journal.primaryEmotion;

            summary[emotion] =
                (summary[emotion] || 0) + 1;

        });

        const sorted = [...journals].sort(

            (a, b) =>

                new Date(a.createdAt) -

                new Date(b.createdAt)

        );

        const grouped = {};

        sorted.forEach(journal => {

            const date =

                journal.createdAt.substring(0, 10);

            if (!grouped[date]) {
                grouped[date] = [];
            }

            grouped[date].push(journal);

        });

        const last7Days = getLast7Days();

        const result = last7Days.map(day => {

            const journalsByDay = grouped[day.key] ?? [];
            const journal = journalsByDay[journalsByDay.length - 1];

            if (!journal) {

                return {

                    day: day.day,

                    emotion: null,

                    value: null,

                    journalCount: 0

                };

            }

            return {

                day: day.day,

                emotion: journal.primaryEmotion,

                value: emotionValue[journal.primaryEmotion],

                journalCount: journalsByDay.length

            };

        });

        return { summary, result };

    }, []);

    useEffect(() => {
        let isActive = true;

        const runLoad = async () => {
            try {
                const { summary, result } = await loadChart();

                if (!isActive) return;

                setEmotionSummary(summary);
                setChartData(result);
            } catch {
                if (!isActive) return;
                setEmotionSummary({});
                setChartData([]);
            }
        };

        void runLoad();

        return () => {
            isActive = false;
        };
    }, [loadChart]);

    const hasChartData = chartData.some((item) => item.value !== null);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
                transition
                duration-300
                hover:shadow-md
            "
        >

            <div className="flex items-end gap-2 mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Mood Summary
                </h2>

                <span className="text-sm text-gray-400">
                    (This Week)
                </span>

            </div>

            {hasChartData ? (
                <ResponsiveContainer
                    width="100%"
                    height={250}
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 40,
                            right: 20,
                            left: 20,
                            bottom: 10
                        }}
                    >

                        <CartesianGrid
                            horizontal={false}
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={15}
                            tick={{
                                fontSize: 13,
                                fill: "#6B7280"
                            }}
                        />

                        <YAxis
                            hide
                            domain={[0, 7]}
                        />

                        <Tooltip
                            content={<MoodTooltip />}
                            cursor={{
                                stroke: "#EDE9FE",
                                strokeWidth: 2
                            }}
                        />

                        <Line
                            type="natural"
                            dataKey="value"
                            connectNulls
                            stroke="#7C3AED"
                            strokeWidth={4}
                            dot={<EmotionDot />}
                            activeDot={{
                                r: 7,
                                fill: "#7C3AED",
                                stroke: "#FFFFFF",
                                strokeWidth: 3
                            }}
                            isAnimationActive={true}
                            animationDuration={900}
                        />

                    </LineChart>

                </ResponsiveContainer>
            ) : (
                <div className="flex h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-100 bg-violet-50/50 text-center md:h-[250px]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
                        ☁️
                    </div>

                    <p className="mt-4 font-bold text-slate-900">
                        No mood data yet
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Write a journal to start your weekly summary.
                    </p>
                </div>
            )}

            <MoodStatistics
                emotionSummary={emotionSummary}
            />

        </div>

    );

}
