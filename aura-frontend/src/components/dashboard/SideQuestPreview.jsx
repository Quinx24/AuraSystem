import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper, Star, Target } from "lucide-react";

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
                    response.data.result ?? []
                );

            }
            catch (error) {

                console.log(error);

            }

        };

        loadQuest();

    }, []);

    const quest = todayQuest[0];
    const remainingQuests = todayQuest.length;
    const xpAvailable = todayQuest.reduce(
        (sum, item) => sum + (item.xpReward ?? 0),
        0
    );

    if (!quest) {

        return (

            <div
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    shadow-sm
                    p-6
                    h-full
                    flex
                    flex-col
                    justify-center
                    items-center
                    text-center
                    transition
                    duration-300
                    hover:shadow-md
                "
            >

                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-500 shadow-inner">
                    <PartyPopper size={38} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                    All Side Quests Completed
                </h2>

                <p className="mt-2 text-gray-500">
                    Great job today! You've cleared your active quests.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
                    <Star size={16} fill="currentColor" />
                    XP earned today
                </div>

                <button
                    onClick={() => navigate("/quests")}
                    className="
                        mt-6
                        rounded-2xl
                        bg-violet-600
                        px-5
                        py-2.5
                        font-semibold
                        text-white
                        transition
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-violet-700
                        active:translate-y-0
                    "
                >
                    View Side Quests
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
                border
                border-gray-100
                shadow-sm
                p-6
                h-full
                transition
                duration-300
                hover:shadow-md
            "
        >

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Active Quests
                    </h2>

                    <p className="mt-1 text-sm font-medium text-gray-500">
                        {remainingQuests} remaining today
                    </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
                    <Star size={15} fill="currentColor" />
                    +{xpAvailable} XP
                </div>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-3xl bg-gray-50/80 p-4">

                <div
                    className={`
                        w-16
                        h-16
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${config.bg}
                    `}
                >

                    <Icon
                        size={30}
                        className={config.text}
                    />

                </div>

                <div>

                    <h3 className="font-bold text-slate-900">
                        {quest.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 leading-6">
                        {quest.description}
                    </p>

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-violet-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-violet-600">
                        <Target size={16} />
                        <span className="text-sm font-bold">
                            Remaining
                        </span>
                    </div>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {remainingQuests}
                    </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={16} />
                        <span className="text-sm font-bold">
                            Status
                        </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                        In progress
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate("/quests")}
                className="
                    mt-6
                    w-full
                    rounded-2xl
                    bg-violet-600
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-violet-700
                    active:translate-y-0
                "
            >
                Continue
            </button>

        </div>

    );

}
