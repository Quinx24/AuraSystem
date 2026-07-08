export default function NoteCard({
    note,
    mode = "view",
    onChange
}) {

    return (

        <div
            className="
                relative
                bg-pink-50
                rounded-xl
                p-4
                md:p-6
                border
                border-violet-100
                min-h-[210px]
            "
        >

            {/* Tape */}

            <div
                className="
                    absolute
                    -top-3
                    left-1/2
                    -translate-x-1/2
                    w-20
                    h-6
                    bg-orange-100
                    rotate-[10deg]
                    rounded-sm
                    opacity-80
                    shadow-sm
                "
            />

            <h3
                className="
                    font-semibold
                    mb-4
                    text-slate-700
                "
            >
                Note To Self
            </h3>

            {/* Paper */}

            <div
                className="
                    relative
                    h-[128px]
                    pl-10
                    pr-3
                    pt-1
                    pb-0
                    rounded-lg
                "
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 23px, #E9D5FF 24px)"
                }}
            >

                {/* Pink Margin Line */}

                <div
                    className="
                        absolute
                        left-6
                        top-0
                        bottom-0
                        w-[2px]
                        bg-pink-200
                        opacity-60
                    "
                />

                {/* Paper Holes */}

                <div
                    className="
                        absolute
                        left-[-12px]
                        top-2
                        bottom-2
                        flex
                        flex-col
                        justify-between
                    "
                >
                    {[...Array(5)].map((_, index) => (

                        <div
                            key={index}
                            className="
                                w-4
                                h-4
                                rounded-full
                                bg-white
                                border
                                border-slate-200
                                shadow-sm
                            "
                        />

                    ))}
                </div>

                {mode === "edit" ? (

                    <textarea
                        value={note}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write a gentle reminder for your future self..."
                        className="
                            w-full
                            h-full
                            resize-none
                            outline-none
                            bg-transparent
                            text-[15px]
                            text-slate-600
                            leading-[24px]
                        "
                    />

                ) : (

                    <div
                        className="
                            w-full
                            h-full
                            overflow-y-auto
                            whitespace-pre-wrap
                            text-[15px]
                            text-slate-600
                            leading-[24px]
                        "
                    >
                        {note || "No note for this journal."}
                    </div>

                )}

            </div>

        </div>

    );

}
