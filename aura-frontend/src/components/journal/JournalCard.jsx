export default function JournalCard({
    journal
}) {

    const {

        journalContent

    } = journal;

    return (

        <div
            className="
                relative
                bg-white
                rounded-3xl
                border
                border-violet-100
                p-4
                md:p-6
                shadow-sm
            "
        >

            <h2 className="mb-5 text-xl font-semibold md:mb-6 md:text-2xl">
                Journal Entry
            </h2>

            <div
                className="
                    w-full
                    h-[360px]
                    md:h-[440px]
                    xl:h-[505px]
                    overflow-y-auto
                    leading-10
                    font-serif
                    text-base
                    md:text-lg
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
