import { formatDate } from "../../utils/dateUtils";

export default function JournalCard({
    journal
}) {

    const {

        journalContent,

        noteToSelf,

        memoryPhoto,

        tags

    } = journal;

    return (

        <div
            className="
                relative
                bg-white
                rounded-3xl
                border
                border-violet-100
                p-6
                shadow-sm
            "
        >

            <h2 className="text-2xl font-semibold mb-6">
                Journal Entry
            </h2>

            <div
                className="
                    w-full
                    h-[505px]
                    overflow-y-auto
                    leading-10
                    font-serif
                    text-lg
                    text-slate-700
                    whitespace-pre-wrap
                    mt-3
                "
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 38px, #E9D5FF 39px)"
                }}
            >
                {journalContent}
            </div>

        </div>

    );

}