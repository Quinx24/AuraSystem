import { useEffect, useState } from "react";
import { getJournalEntries } from "../../services/journalService";
import { emotionValue } from "../../utils/emotionChartUtils";
import EmotionDot from "./EmotionDot";
import MoodStatistics from "./MoodStatistics";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

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

    const loadChart = async () => {

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

        setEmotionSummary(summary);

        const sorted = [...journals].sort(

            (a, b) =>

                new Date(a.createdAt) -

                new Date(b.createdAt)

        );

        const grouped = {};

        sorted.forEach(journal => {

            const date =

                journal.createdAt.substring(0, 10);

            grouped[date] = journal;

        });

        const last7Days = getLast7Days();

        const result = last7Days.map(day => {

            const journal = grouped[day.key];

            if (!journal) {

                return {

                    day: day.day,

                    emotion: null,

                    value: null

                };

            }

            return {

                day: day.day,

                emotion: journal.primaryEmotion,

                value: emotionValue[journal.primaryEmotion]

            };

        });

        console.log(result);

        setChartData(result);

        console.table(result);

        journals.forEach(journal => {

            console.log(journal.primaryEmotion);

        });


    };

    useEffect(() => {

        loadChart();

    }, []);

    useEffect(() => {

        console.log(chartData);

    }, [chartData]);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
            "
        >

            <div className="flex items-end gap-2 mb-6">

                <h2
                    className="
                        text-xl
                        font-bold
                        text-gray-900
                    "
                >
                    Mood Summary
                </h2>

                <span
                    className="
                        text-sm
                        text-gray-400
                    "
                >
                    (This Week)
                </span>

            </div>

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

                    <Line

                        type="natural"

                        dataKey="value"

                        connectNulls

                        stroke="#7C3AED"

                        strokeWidth={3}

                        dot={<EmotionDot />}

                        activeDot={false}

                        isAnimationActive={true}

                    />

                </LineChart>

            </ResponsiveContainer>

            <MoodStatistics

                emotionSummary={emotionSummary}

            />

        </div>

    );

}