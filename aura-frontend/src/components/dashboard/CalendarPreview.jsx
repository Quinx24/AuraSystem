import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJournalEntries } from "../../services/journalService";
import { emotionConfig } from "../../utils/emotionUtils";

const formatDateLabel = (year, month, day) => {
    return new Date(year, month, day).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
};

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

        } catch {
            setEntries([]);

        }

    };

    useEffect(() => {
        let isMounted = true;

        Promise.resolve().then(() => {
            if (isMounted) loadEntries();
        });

        return () => {
            isMounted = false;
        };
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
                className="h-12 border border-gray-100 bg-gray-50/40 sm:h-14"
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
        const config = emotionConfig[entry?.primaryEmotion];
        const confidence = entry?.confidence
            ? `${Math.round(entry.confidence * 100)}%`
            : "-";
        const tooltip = entry
            ? `${formatDateLabel(year, month, day)}\nEmotion: ${config?.label ?? entry.primaryEmotion}\nConfidence: ${confidence}`
            : formatDateLabel(year, month, day);

        cells.push(

            <button
                key={day}
                type="button"
                title={tooltip}
                onClick={() => {
                    if (entry?.id) {
                        navigate(`/emotion-analysis/${entry.id}`);
                    }
                }}
                className={`
                    h-12
                    sm:h-14
                    border
                    border-gray-100
                    p-1
                    text-left
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-violet-50
                    hover:shadow-sm
                    ${entry ? "cursor-pointer" : "cursor-default"}
                    ${day === today.getDate()
                        ? "bg-violet-100"
                        : "bg-white"}
                `}
            >

                <div className="text-xs font-medium text-slate-500">
                    {day}
                </div>

                {entry && (
                    <div className="flex h-8 items-center justify-center">
                        <span className="text-xl">
                            {config?.emoji}
                        </span>
                    </div>
                )}

            </button>

        );

    }

    const hasEntries = entries.length > 0;

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                p-6
                shadow-sm
                h-full
                transition
                duration-300
                hover:shadow-md
            "
        >

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                    Calendar
                </h2>

                <button
                    onClick={() => navigate("/calendar")}
                    className="
                        text-violet-600
                        font-semibold
                        transition
                        hover:text-violet-700
                    "
                >
                    View →
                </button>

            </div>

            <h3 className="text-center font-semibold mb-4 text-slate-800">
                {monthName} {year}
            </h3>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">

                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>

            </div>

            <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-gray-100">

                {cells}

            </div>

            {!hasEntries && (
                <div className="mt-5 rounded-2xl border border-dashed border-violet-100 bg-violet-50/50 px-4 py-3 text-center">
                    <p className="text-sm font-bold text-slate-900">
                        No calendar activity yet
                    </p>

                    <p className="mt-1 text-xs font-medium text-gray-500">
                        Journal entries will appear on the days you write.
                    </p>
                </div>
            )}

        </div>

    );

}
