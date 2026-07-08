import { formatDate } from "../../utils/dateUtils";
import { ArrowLeft } from "lucide-react";

export default function JournalHistoryHeader({
    createdAt
}) {

    return (

        <div className="mb-6">

            <button
                className="
                    flex
                    items-center
                    gap-2
                    text-slate-700
                    hover:text-violet-600
                    transition-colors
                    mb-4
                "
            >
                <ArrowLeft size={18} />

                <span>
                    Back to Calendar
                </span>

            </button>

            <h1
                className="
                    text-2xl
                    md:text-3xl
                    xl:text-4xl
                    font-bold
                    text-slate-900
                "
            >
                Journal History
            </h1>

            <p
                className="
                    text-gray-500
                    mt-2
                "
            >
                {formatDate(createdAt)}
            </p>

        </div>

    );

}
