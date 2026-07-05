import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTodayQuest } from "../../services/sideQuestService";
import { categoryConfig } from "../../utils/sideQuestCategoryUtils";

export default function SideQuestPreview() {

    const [todayQuest, setTodayQuest] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const loadQuest = async () => {

            try {

                const response =
                    await getTodayQuest();

                setTodayQuest(
                    response.data.result
                );

            }
            catch (error) {

                console.log(error);

            }

        };

        loadQuest();

    }, []);

    const quest = todayQuest[0];

    if (!quest) {

        return (

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    p-6
                    h-full
                    flex
                    flex-col
                    justify-center
                    items-center
                "
            >

                <div className="text-6xl">

                    🎉

                </div>

                <h2
                    className="
                        mt-4
                        text-xl
                        font-bold
                    "
                >

                    All Side Quests Completed

                </h2>

                <p
                    className="
                        mt-2
                        text-gray-500
                    "
                >

                    Great job today!

                </p>

                <button
                    onClick={() => navigate("/quests")}
                    className="
                        mt-6
                        text-violet-600
                        font-semibold
                    "
                >

                    View Side Quests →

                </button>

            </div>

        );

    }

    const config =
        categoryConfig[quest.category];

    const Icon =
        config.icon;

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-sm
                p-6
                h-full
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                    mb-6
                "
            >

                Today's Side Quest

            </h2>

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className={`
                        w-16
                        h-16
                        rounded-full
                        flex
                        items-center
                        justify-center
                        ${config.bg}
                    `}
                >

                    <Icon
                        size={30}
                        className={config.text}
                    />

                </div>

                <div>

                    <h3 className="font-bold">

                        {quest.title}

                    </h3>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >

                        {quest.description}

                    </p>

                </div>

            </div>

            <div
                className="
                    mt-6
                    flex
                    justify-between
                    items-center
                "
            >

                <span
                    className="
                        font-bold
                        text-amber-500
                    "
                >

                    +{quest.xpReward} XP

                </span>

                <button
                    onClick={() => navigate("/quests")}
                    className="
                        text-violet-600
                        font-semibold
                    "
                >

                    Open →

                </button>

            </div>

        </div>

    );

}