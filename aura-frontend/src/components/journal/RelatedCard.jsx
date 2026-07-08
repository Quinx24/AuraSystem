import {
    BookOpen,
    CalendarDays,
    Target,
    ChevronRight
} from "lucide-react";

import { Link } from "react-router-dom";

export default function RelatedCard() {

    return (

        <div className="min-h-[300px] rounded-3xl bg-white p-3 shadow-sm md:min-h-[330px]">

            <h2 className="text-xl font-semibold mb-5 px-3 mt-2">
                Related
            </h2>

            <div className="space-y-4">

                <Link
                    to="/journal"
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        hover:bg-violet-50
                        py-3
                        px-4
                        transition
                    "
                >

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100">

                            <BookOpen
                                size={18}
                                className="text-violet-600"
                            />

                        </div>

                        <div className="min-w-0 px-2">

                            <h3 className="font-medium">
                                Emotion Journal
                            </h3>

                            <p className="text-sm text-gray-500">
                                View all journal entries
                            </p>

                        </div>

                    </div>

                    <ChevronRight
                        size={18}
                        className="text-gray-400"
                    />

                </Link>

                <Link
                    to="/calendar"
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        hover:bg-violet-50
                        py-3
                        px-4
                        transition
                    "
                >

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">

                            <CalendarDays
                                size={18}
                                className="text-blue-600"
                            />

                        </div>

                        <div className="min-w-0 px-2">

                            <h3 className="font-medium">
                                Calendar Tracker
                            </h3>

                            <p className="text-sm text-gray-500">
                                Browse your emotional calendar
                            </p>

                        </div>

                    </div>

                    <ChevronRight
                        size={18}
                        className="text-gray-400"
                    />

                </Link>

                <Link
                    to="/quests"
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        hover:bg-violet-50
                        py-3
                        px-4
                        transition
                    "
                >

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">

                            <Target
                                size={18}
                                className="text-emerald-600"
                            />

                        </div>

                        <div className="min-w-0 px-2">

                            <h3 className="font-medium">
                                Side-Quests
                            </h3>

                            <p className="text-sm text-gray-500">
                                Review your completed quests
                            </p>

                        </div>

                    </div>

                    <ChevronRight
                        size={18}
                        className="text-gray-400"
                    />

                </Link>

            </div>

        </div>

    );

}
