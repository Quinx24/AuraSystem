import { categoryConfig } from "../utils/sideQuestCategoryUtils";
import { useState } from "react";
import { Check } from "lucide-react";
import { addSideQuest } from "../services/sideQuestService";

export default function SideQuestSuggestion({
    sideQuests
}) {

    const [addedQuests, setAddedQuests] = useState([]);

    const [loadingQuestsId, setLoadingQuestsId] = useState([null]);

    const handleAddQuest = async (questId) => {
        try {
            setLoadingQuestsId(questId);
            await addSideQuest(questId);

            setAddedQuests((prev) => [...prev, questId]);
        } catch (error) {

            alert(
                error.response?.data?.message ??
                "Failed to add side quest. Please try again."
            );
        } finally {
            setLoadingQuestsId(null);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-6">

            <h2 className="text-xl font-semibold mb-6">
                Suggested Side Quests
            </h2>

            <div className="space-y-4">

                {sideQuests.map((quest) => {

                    const config = categoryConfig[
                        quest.category
                    ];

                    const Icon = config?.icon;

                    const isAdded = addedQuests.includes(
                        quest.id
                    );

                    const explanation = quest.recommendation?.explanations?.[0];

                    return (
                        <div
                            key={quest.id}
                            className="
                                flex
                                flex-col
                                md:flex-row
                                items-center
                                gap-4
                                p-4
                                rounded-2xl
                                border
                                border-gray-100
                            "
                        >

                            <div
                                className={`
                                    w-12
                                    h-12
                                    shrink-0
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    ${config.bg}
                                `}
                            >

                                <Icon
                                    size={22}
                                    className={config.text}
                                />

                            </div>


                            <div className="min-w-0 flex-1 text-center md:text-left">

                                <h3 className="font-semibold mb-1">
                                    {quest.title}
                                </h3>

                                <p className="text-sm text-gray-500 font-medium">
                                    {quest.description}
                                </p>

                                {explanation && (
                                    <p className="mt-2 text-xs font-medium text-purple-500">
                                        {explanation}
                                    </p>
                                )}

                            </div>

                            {
                                isAdded ? (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            md:gap-4
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-green-50
                                            text-green-600
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        <div
                                            className="
                                                w-4
                                                h-4
                                                rounded-full
                                                bg-green-500
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <Check 
                                                size={10}
                                                strokeWidth={3}
                                                className="text-white"
                                            />
                                        </div>    

                                        Added to Side-Quest

                                    </div>

                                ) : (

                                    <button
                                        disabled={loadingQuestsId === quest.id}
                                        onClick={() =>
                                            handleAddQuest(
                                                quest.id
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            md:gap-4
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-purple-200
                                            text-purple-600
                                            text-sm
                                            font-medium
                                            hover:bg-purple-50
                                            transition
                                        "
                                    >

                                        <div
                                            className="
                                                w-4
                                                h-4
                                                rounded-full
                                                border-2
                                                border-purple-400
                                            "
                                        />

                                    {loadingQuestsId === quest.id
                                        ? "Adding..."
                                        : "Add to Side-Quest"
                                    }

                                    </button>

                                )
                            }

                        </div>
                    );
                })}

            </div>

        </div>
    );
}
