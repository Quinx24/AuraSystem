import { PlusCircle, Star, CheckCircle } from "lucide-react";
import { categoryConfig } from "../utils/sideQuestCategoryUtils";

export default function SideQuestCard({
    quest,
    type = "recommended",
    onComplete,
    onAdd,
}) {

    const config = categoryConfig[quest.category];

    const Icon = config.icon;

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-6
                mt-6
                hover:shadow-md
                transition
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-6
                "
            >

                {/* Left */}

                <div
                    className="
                        flex
                        items-center
                        gap-5
                        flex-1
                    "
                >

                    {/* Icon */}

                    <div
                        className={`
                            w-23
                            h-23
                            rounded-full
                            flex
                            items-center
                            justify-center
                            ${config.bg}
                        `}
                    >

                        <Icon
                            size={40}
                            className={config.text}
                        />

                    </div>

                    {/* Content */}

                    <div
                        className="
                            flex
                            flex-col
                            justify-center
                        "
                    >

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            {quest.title}
                        </h2>

                        <p
                            className="
                                mt-3
                                text-gray-500
                                text-md
                                font-medium
                                leading-8
                            "
                        >
                            {quest.description}
                        </p>

                        <div
                            className="
                                flex
                                gap-3
                                mt-5
                            "
                        >

                            <span
                                className={`
                                    px-4
                                    py-1.5
                                    rounded-full
                                    text-sm
                                    font-medium
                                    ${config.bg}
                                    ${config.text}
                                `}
                            >
                                {config.label}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Right */}

                <div
                    className="
                        flex
                        flex-col
                        justify-between
                        items-end
                        h-full
                        gap-8
                    "
                >

                    {/* XP */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xl
                            font-bold
                            text-amber-500
                        "
                    >

                        <Star
                            size={24}
                            fill="currentColor"
                        />

                        +{quest.xpReward} XP

                    </div>

                    {/* Button */}

                    {
                        type === "recommended" && (

                            <button
                                onClick={() => onAdd(quest.id)}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-6
                                    py-3
                                    rounded-2xl
                                    bg-violet-600
                                    text-white
                                    font-medium
                                    hover:bg-violet-700
                                    transition
                                "
                            >

                                <PlusCircle size={18} />

                                Add to Side-Quest

                            </button>

                        )
                    }

                    {
                        type === "myQuest" && (

                            <button
                                onClick={() => onComplete(quest.id)}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-6
                                    py-3
                                    rounded-2xl
                                    bg-green-600
                                    text-white
                                    font-medium
                                    hover:bg-green-700
                                    transition
                                "
                            >

                                <CheckCircle size={18} />

                                Complete

                            </button>

                        )
                    }

                    {
                        type === "completed" && (

                            <div
                                className="
                                    px-6
                                    py-3
                                    rounded-2xl
                                    bg-gray-100
                                    text-gray-600
                                    font-semibold
                                "
                            >

                                ✔ Completed

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );

}