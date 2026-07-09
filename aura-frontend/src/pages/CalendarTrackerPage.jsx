import { useEffect, useState } from "react";
import { getJournalEntries } from "../services/journalService";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import PageIntroduction from "../components/PageIntroduction";
import { usePageMeta } from "../contexts/PageMetaContext";

import { emotionConfig } from "../utils/emotionUtils";

export default function CalendarTrackerPage() {

    const [currentDate, setCurrentDate] = useState(
        new Date()
    );

    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Calendar Tracker", breadcrumb: ["Home", "Calendar Tracker"] });
        return () => setPage({});
    }, []);

    const [entries, setEntries] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const loadEntries = async () => {

            try {

                const response = await getJournalEntries();

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

    const goToToday = () => {
        setCurrentDate(new Date());
    };

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
                className="h-20 border border-gray-100 sm:h-24 xl:h-32"
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
                        h-20
                        sm:h-24
                        xl:h-32
                        border
                        border-gray-100
                        cursor-pointer
                        hover:bg-violet-50
                        transition-all duration-200
                        p-3
                        md:p-4
                        relative
                        ${isCurrentMonth &&
                        day === today.getDate()
                        ? "bg-violet-100 ring-2 ring-violet-300 ring-inset"
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
                <div className="text-sm font-semibold md:text-base lg:text-lg">
                    {day}
                </div>

                {entry && (
                    <div className="flex h-12 items-center justify-center md:h-14 xl:h-16">
                        <span className="text-3xl md:text-4xl xl:text-5xl transition-transform hover:scale-110">
                            {emotionConfig[
                                entry.primaryEmotion
                            ]?.emoji}
                        </span>
                    </div>
                )}

                {!entry && (
                    <div className="flex h-12 items-center justify-center md:h-14 xl:h-16 opacity-0 hover:opacity-30 transition-opacity">
                        <span className="text-2xl text-violet-300">+</span>
                    </div>
                )}
            </div >

        );

    }

    return (

        <div className="space-y-8">


            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

                <div className="min-w-0 rounded-3xl bg-white p-6 shadow-sm md:p-8 xl:col-span-3">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all duration-200"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl xl:text-4xl">
                                {monthName} {year}
                            </h2>

                            <button
                                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all duration-200"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <button
                            onClick={goToToday}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 font-medium hover:bg-violet-100 transition-all duration-200"
                        >
                            <Calendar size={16} />
                            Today
                        </button>
                    </div>

                    <div className="mb-4 grid grid-cols-7 text-center text-sm font-semibold text-gray-500 md:text-base">
                        <div className="py-2">Sun</div>
                        <div className="py-2">Mon</div>
                        <div className="py-2">Tue</div>
                        <div className="py-2">Wed</div>
                        <div className="py-2">Thu</div>
                        <div className="py-2">Fri</div>
                        <div className="py-2">Sat</div>
                    </div>

                    <div className="grid grid-cols-7">

                        {cells}

                    </div>

                </div>

                <div className="min-w-0 space-y-6">

                    <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar size={20} className="text-violet-600" />
                            <h2 className="font-bold text-xl text-slate-900">
                                Mood Legend
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(emotionConfig).map(
                                ([emotion, config]) => (

                                    <div
                                        key={emotion}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className={`grid h-10 w-10 place-items-center rounded-lg ${config.bg}`}>
                                            <span className="text-2xl">
                                                {config.emoji}
                                            </span>
                                        </div>
                                        <span className="font-medium text-slate-700">
                                            {config.label}
                                        </span>
                                    </div>

                                )
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm md:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={20} className="text-violet-600" />
                            <h2 className="font-bold text-lg text-slate-900">
                                How to Use
                            </h2>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="text-violet-600 mt-1">•</span>
                                <span>Click on any date to view your journal entry</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-violet-600 mt-1">•</span>
                                <span>Emoji shows your primary emotion for that day</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-violet-600 mt-1">•</span>
                                <span>Empty dates mean no journal entry yet</span>
                            </li>
                        </ul>
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-4xl">
                                ☁️
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );

}
