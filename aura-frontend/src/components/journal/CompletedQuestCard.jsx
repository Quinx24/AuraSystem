import {
    CheckCircle2
}
    from "lucide-react";

export default function CompletedQuestCard({
    quests
}) {

    return (

        <div
            className="
                bg-white 
                rounded-3xl 
                shadow-sm 
                p-4
                md:p-6
                min-h-[360px]
                md:min-h-[400px]
                flex
                flex-col
            "
        >

            <h2 className="text-xl font-semibold mb-6">
                Completed Side Quests
            </h2>

            <div
                className="
                    flex-1
                    space-y-4
                    overflow-y-auto
                    pr-2
                "
            >

                {
                    quests.length === 0 ? (

                        <p className="text-gray-500">
                            No completed side quests.
                        </p>

                    ) : (

                        quests.map((quest) => (

                            <div
                                key={quest.id}
                                className="
                                    rounded-2xl
                                    border
                                    border-violet-100
                                    p-4
                                    md:p-5
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={22}
                                        className="text-green-500"
                                    />

                                    <h3 className="font-semibold">
                                        {quest.title}
                                    </h3>

                                </div>

                                <p className="text-gray-600 leading-7 mt-2">
                                    {quest.description}
                                </p>

                                <p className="text-sm text-violet-500 mt-3">
                                    Completed at {quest.completedAt}
                                </p>

                            </div>

                        ))

                    )
                }

            </div>
        </div>

    );

}
