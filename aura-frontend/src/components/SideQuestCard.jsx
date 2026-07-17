import {
    CheckCircle,
    Clock,
    GaugeCircle,
    PlusCircle,
    Star
} from "lucide-react";
import { categoryConfig } from "../utils/sideQuestCategoryUtils";

export default function SideQuestCard({
    quest,
    type = "recommended",
    isAdded = false,
    isBusy = false,
    onComplete,
    onAdd,
}) {

    const config = categoryConfig[quest.category];

    const Icon = config.icon;

    const statusLabel =
        type === "completed"
            ? "Completed"
            : type === "myQuest"
                ? "Accepted"
                : "Recommended";

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-4
                mt-4
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-violet-100
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-4
                        flex-1
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
                            shrink-0
                            shadow-inner
                            ${config.bg}
                        `}
                    >

                        <Icon
                            size={28}
                            className={config.text}
                        />

                    </div>

                    <div
                        className="
                            flex
                            min-w-0
                            flex-col
                            justify-center
                        "
                    >

                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {quest.title}
                            </h2>

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-violet-100
                                    bg-violet-50
                                    px-2.5
                                    py-0.5
                                    text-xs
                                    font-semibold
                                    text-violet-600
                                "
                            >
                                {statusLabel}
                            </span>
                        </div>

                        <p
                            className="
                                mt-1.5
                                text-gray-500
                                text-sm
                                font-medium
                                leading-6
                            "
                        >
                            {quest.description}
                        </p>

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                                mt-3
                            "
                        >

                            <span
                                className={`
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-medium
                                    ${config.bg}
                                    ${config.text}
                                `}
                            >
                                {config.label}
                            </span>

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    bg-slate-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                <Clock size={13} />
                                5 min
                            </span>

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    bg-emerald-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-emerald-600
                                "
                            >
                                <GaugeCircle size={13} />
                                Easy
                            </span>

                        </div>

                    </div>

                </div>

                <div
                    className="
                        flex
                        shrink-0
                        flex-col
                        items-end
                        justify-start
                        gap-3
                        lg:items-end
                    "
                >
                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-xl
                            bg-amber-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-amber-600
                            shadow-none
                        "
                    >
                        <Star
                            size={14}
                            fill="currentColor"
                        />
                        +{quest.xpReward} XP
                    </div>

                    {
                        type === "recommended" && (
                            <button
                                disabled={isBusy}
                                onClick={() => onAdd?.(quest.id, isAdded)}
                                className={
                                    `
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    min-w-[170px]
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    text-sm
                                    font-semibold
                                    shadow-md
                                    transition
                                    duration-200
                                    ease-out
                                    ${isAdded
                                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md active:translate-y-0"
                                        : "bg-violet-600 text-white hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg active:translate-y-0"
                                    }
                                    ${isBusy ? "cursor-not-allowed opacity-70" : ""}
                                `}
                            >
                                {isAdded ? (
                                    <CheckCircle size={16} />
                                ) : (
                                    <PlusCircle size={16} />
                                )}
                                {isAdded ? "Added to My Quests" : "Add to My Quests"}
                            </button>
                        )
                    }

                    {
                        type === "myQuest" && (
                            <button
                                disabled={isBusy}
                                onClick={() => onComplete(quest.id)}
                                className={`
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    min-w-[170px]
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-green-600
                                    text-white
                                    text-sm
                                    font-semibold
                                    shadow-md
                                    transition
                                    duration-200
                                    ease-out
                                    hover:-translate-y-0.5
                                    hover:bg-green-700
                                    hover:shadow-lg
                                    active:translate-y-0
                                    ${isBusy ? "cursor-not-allowed opacity-70" : ""}
                                `}
                            >
                                <CheckCircle size={16} />
                                Complete
                            </button>
                        )
                    }

                    {
                        type === "completed" && (
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    min-w-[170px]
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-gray-100
                                    text-gray-600
                                    text-sm
                                    font-semibold
                                    shadow-md
                                    transition
                                    duration-200
                                    ease-out
                                "
                            >
                                <CheckCircle size={16} />
                                Completed
                            </div>
                        )
                    }

                </div>

            </div>

        </div>

    );

}
