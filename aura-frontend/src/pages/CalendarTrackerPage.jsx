import { useEffect, useState } from "react";
import { getJournalEntries } from "../services/journalService";
import { useNavigate } from "react-router-dom";

import { emotionConfig } from "../utils/emotionUtils";

export default function CalendarTrackerPage() {

    const [currentDate, setCurrentDate] = useState(
        new Date()
    );

    const [entries, setEntries] = useState([]);

    console.log(entries);

    const navigate = useNavigate();

    useEffect(() => {

        const loadEntries = async () => {

            try {

                const response = await getJournalEntries();

                console.log("Journal entries loaded:", response.data.result.content);

                setEntries(response.data.result.content);

            } catch (error) {

                console.error(error);

            }

        };

        loadEntries();

    }, []);

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    const monthName =
        currentDate.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const firstDay = new Date(
        year,
        month,
        1
    ).getDay();

    const today = new Date();

    const isCurrentMonth =
        today.getMonth() === month &&
        today.getFullYear() === year;

    const emotionByDate = {};

    entries.forEach((entry) => {

        const date = new Date(entry.createdAt);

        const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

        emotionByDate[key] = entry;

    });

    const cells = [];

    for (let i = 0; i < firstDay; i++) {

        cells.push(
            <div
                key={`empty-${i}`}
                className="h-16 border border-gray-100 sm:h-20 xl:h-28"
            />
        );

    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dateKey =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");

        const entry = emotionByDate[dateKey];

        cells.push(

            <div
                key={day}
                className={`
                        h-16
                        sm:h-20
                        xl:h-28
                        border
                        border-gray-100
                        cursor-pointer
                        hover:bg-violet-50
                        transition
                        p-2
                        md:p-3
                        ${isCurrentMonth &&
                        day === today.getDate()
                        ? "bg-violet-100"
                        : ""
                    }
                `}

                onClick={() => {

                    if (entry) {

                        navigate(
                            `/emotion-analysis/${entry.id}`
                        );

                    }

                }}
            >

                <div className="text-xs font-semibold md:text-base">
                    {day}
                </div>

                {

                    entry && (

                        <div className="flex h-10 items-center justify-center md:h-13">

                            <span className="text-2xl md:text-3xl xl:text-4xl">

                                {
                                    emotionConfig[
                                        entry.primaryEmotion
                                    ]?.emoji
                                }

                            </span>

                        </div>

                    )

                }

            </div >

        );

    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-bold md:text-3xl xl:text-4xl">
                Calendar Tracker
            </h1>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

                <div className="min-w-0 rounded-3xl bg-white p-4 shadow-sm md:p-6 xl:col-span-3">

                    <div
                        className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    "
                    >

                        <button
                            onClick={() => {

                                setCurrentDate(

                                    new Date(
                                        year,
                                        month - 1,
                                        1
                                    )

                                );

                            }}
                            className="
                            px-4
                            py-2
                            border
                            border-slate-100
                            rounded-xl
                        "
                        >
                            ←
                        </button>

                        <h2 className="text-xl font-bold md:text-2xl xl:text-3xl">

                            {monthName}
                            {" "}
                            {year}

                        </h2>

                        <button
                            onClick={() => {

                                setCurrentDate(

                                    new Date(
                                        year,
                                        month + 1,
                                        1
                                    )

                                );

                            }}
                            className="
                            px-4
                            py-2
                            border
                            border-slate-100
                            rounded-xl
                        "
                        >
                            →
                        </button>

                    </div>

                    <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold md:text-base">

                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>

                    </div>

                    <div className="grid grid-cols-7">

                        {cells}

                    </div>

                </div>

                <div className="min-w-0 space-y-6">

                    <div className="rounded-3xl bg-violet-50 p-4 shadow-sm md:p-6">

                        <h2 className="font-bold text-xl mb-6">
                            Mood Legend
                        </h2>

                        {Object.entries(emotionConfig).map(
                            ([emotion, config]) => (

                                <div
                                    key={emotion}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-4
                                    "
                                >

                                    <span className="text-2xl md:text-3xl">
                                        {config.emoji}
                                    </span>

                                    <span className="font-medium">
                                        {config.label}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">

                        <p className="font-semibold leading-8">
                            Click on any date
                            to see your journal
                            and reflections.
                        </p>

                        <div className="mt-6 text-center text-4xl md:text-6xl">
                            ☁️
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );

}
