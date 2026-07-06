import { formatDate } from "../../utils/dateUtils";

export default function JournalStatsCard({
    stats
}) {

    const {
        wordCount,
        characterCount,
        readingTime,
        createdAt,
        updatedAt
    } = stats;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="font-semibold text-lg mb-4">
                Journal Stats
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Words
                    </span>

                    <span className="font-semibold">
                        {wordCount}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Characters
                    </span>

                    <span className="font-semibold">
                        {characterCount}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Reading Time
                    </span>

                    <span className="font-semibold">
                        ~ {readingTime} min
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Created
                    </span>

                    <span className="font-semibold text-right">
                        {formatDate(createdAt)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Last Updated
                    </span>

                    <span className="font-semibold text-right">
                        {formatDate(updatedAt)}
                    </span>
                </div>

            </div>

        </div>
    );
}