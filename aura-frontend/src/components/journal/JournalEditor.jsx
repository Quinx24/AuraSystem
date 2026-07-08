export default function JournalEditor({
    journalContent,
    setJournalContent
}) {
    return (
        <div
            className="
                bg-white
                rounded-3xl
                border
                border-violet-100
                p-6
                shadow-sm
            "
        >
            <h2 className="text-2xl font-semibold mb-6">
                Today's Journal
            </h2>

            <textarea
                value={journalContent}
                onChange={(e) =>
                    setJournalContent(e.target.value)
                }
                placeholder="Write about your day..."
                className="
                    w-full
                    h-[500px]
                    resize-none
                    outline-none
                    overflow-y-auto
                    leading-10
                    font-serif
                    text-lg
                    text-slate-700
                "
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 38px, #E9D5FF 39px)"
                }}
            />
        </div>
    );
}
