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
                className="h-28 border border-gray-100"
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
                        h-28
                        border
                        border-gray-100
                        cursor-pointer
                        hover:bg-violet-50
                        transition
                        p-3
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

                <div className="font-semibold">
                    {day}
                </div>

                {

                    entry && (

                        <div className="flex justify-center items-center h-13">

                            <span className="text-4xl">

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

            <h1 className="text-4xl font-bold">
                Calendar Tracker
            </h1>

            <div className="grid grid-cols-4 gap-6">

                <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm">

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

                        <h2 className="text-3xl font-bold">

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

                    <div className="grid grid-cols-7 text-center font-semibold mb-2">

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

                <div className="space-y-6">

                    <div className="bg-violet-50 rounded-3xl p-6 shadow-sm">

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

                                    <span className="text-3xl">
                                        {config.emoji}
                                    </span>

                                    <span className="font-medium">
                                        {config.label}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                    <div className="bg-white rounded-3xl p-10 shadow-sm">

                        <p className="font-semibold leading-8">
                            Click on any date
                            to see your journal
                            and reflections.
                        </p>

                        <div className="text-6xl text-center mt-6">
                            ☁️
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );

}