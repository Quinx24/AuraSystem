import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJournalEntries } from "../../services/journalService";
import { emotionConfig } from "../../utils/emotionUtils";

export default function CalendarPreview() {

    const [entries, setEntries] = useState([]);

    const navigate = useNavigate();

    const loadEntries = async () => {

        try {

            const response = await getJournalEntries(
                0,
                100
            );

            setEntries(
                response.data.result.content
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadEntries();

    }, []);

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth();

    const monthName =
        today.toLocaleString(
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
                className="h-14 border border-gray-100"
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
                        h-14
                        border
                        border-gray-100
                        transition
                        p-1
                        ${day === today.getDate()
                        ? "bg-violet-100"
                        : ""}
                    }
                `}
            >

                <div className="text-xs">
                    {day}
                </div>

                {

                    entry && (

                        <div className="flex justify-center items-center h-8">

                            <span className="text-xl">

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

        <div
            className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                h-full
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-5
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                    "
                >
                    Calendar
                </h2>

                <button
                    onClick={() => navigate("/calendar")}
                    className="
                        text-violet-600
                        font-semibold
                    "
                >
                    View →
                </button>

            </div>

            <h3
                className="
                    text-center
                    font-semibold
                    mb-4
                "
            >
                {monthName} {year}
            </h3>

            <div
                className="
                    grid
                    grid-cols-7
                    text-center
                    text-xs
                    font-semibold
                    mb-2
                "
            >

                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>

            </div>

            <div
                className="
                    grid
                    grid-cols-7
                "
            >

                {cells}

            </div>

        </div>

    );

}