import RecentJournalItem from "./RecentJournalItem";

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
                p-4
                md:p-6
            "
        >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        Recent Journals
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-400
                            mt-1
                        "
                    >
                        Your latest emotional memories
                    </p>

                </div>

                <button
                    className="
                        text-violet-600
                        font-semibold
                        hover:underline
                    "
                >
                    View All →
                </button>

            </div>

            <div
                className="
                    mt-6
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
