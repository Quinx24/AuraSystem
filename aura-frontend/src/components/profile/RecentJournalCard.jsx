import RecentJournalItem from "./RecentJournalItem";
import { BookOpen } from "lucide-react";

export default function RecentJournalCard() {

    const journals = [

        {

            id: 1,

            emotion: "HAPPY",

            title: "Happy",

            date: "Today",

            time: "10:30 AM",

            content:
                "Today I finally finished my dashboard UI."

        },

        {

            id: 2,

            emotion: "SAD",

            title: "Sad",

            date: "Yesterday",

            time: "08:15 PM",

            content:
                "I felt a little stressed because of my thesis."

        },

        {

            id: 3,

            emotion: "EXCITED",

            title: "Excited",

            date: "2 days ago",

            time: "03:20 PM",

            content:
                "I completed my recommendation system."

        }

    ];

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
                md:p-8
            "
        >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-11
                            h-11
                            rounded-xl
                            bg-gradient-to-br from-violet-100 to-violet-50
                            flex
                            items-center
                            justify-center
                            text-violet-600
                        "
                    >
                        <BookOpen size={22} />
                    </div>

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Recent Journals
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-0.5
                            "
                        >
                            Your latest emotional memories
                        </p>

                    </div>

                </div>

                <button
                    className="
                        text-violet-600
                        font-semibold
                        hover:text-violet-700
                        hover:underline
                        transition-colors
                    "
                >
                    View All →
                </button>

            </div>

            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-3
                    xl:gap-5
                "
            >

                {
                    journals.map((journal) => (
                        <RecentJournalItem
                            key={journal.id}
                            id={journal.id}
                            emotion={journal.emotion}
                            title={journal.title}
                            date={journal.date}
                            time={journal.time}
                            content={journal.content}
                        />
                    ))
                }

            </div>

        </div>

    );

}
