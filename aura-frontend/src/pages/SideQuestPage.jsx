import { emotionConfig } from "../utils/emotionUtils";
import { categoryConfig } from "../utils/sideQuestCategoryUtils";
import { getAllSideQuests } from "../api/sideQuestApi";
import { useEffect, useState } from "react";
import { 
    getTodayQuest, 
    completeQuest, 
    getCompletedQuest,
    addSideQuest
} from "../services/sideQuestService";

import SideQuestCard from "../components/SideQuestCard";

export default function SideQuestPage() {

    const [quests, setQuests] = useState([]);

    const [todayQuest, setTodayQuest] = useState([]);

    const [completedQuest, setCompletedQuest] = useState([]);

    console.log("completedQuest state:", completedQuest);

    console.log("todayQuest state:", todayQuest);

    const [activeTab, setActiveTab] = useState("recommended");

    const fetchSideQuests = async () => {

        try {

            const data = await getAllSideQuests();

            setQuests(data);

        }
        catch (error) {

            console.log(error);

        }

    };

    const loadTodayQuest = async () => {

        try {
            const response = await getTodayQuest();

            console.log("Today Quest Response:", response);

            console.log("Today Quest Data:", response.data);

            console.log("Today Quest Result:", response.data.result);

            setTodayQuest(response.data.result ?? []);
        }
        catch (error) {
            console.log(error);

            setTodayQuest([]);
        }
    };

    const loadCompletedQuest = async () => {
        try {
            const response = await getCompletedQuest();

            console.log("Completed Response:", response);
            console.log("Completed Data:", response.data);
            console.log("Completed Result:", response.data.result);

            setCompletedQuest(response.data.result);
        } catch (error) {
            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);
        }
    };

    const handleCompleteQuest = async (id) => {

        try {

            await completeQuest(id);

            await loadTodayQuest();

            await loadCompletedQuest();

        } catch (error) {

            console.log(error);

            alert("Complete quest failed.");

        }

    };

    const handleAddSideQuest = async (sideQuestId) => {
        try {

            await addSideQuest(sideQuestId);

            await loadTodayQuest();

            alert("Side quest added successfully!");

        } catch (error) {
            
            console.log(error);

            alert(
                error.response?.data?.message ??
                "Failed to add side quest."
            );
        }
    };

    useEffect(() => {

        fetchSideQuests();
        loadTodayQuest();
        loadCompletedQuest();

    }, []);

    return (

        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1
                    className="
                        text-4xl
                        font-bold
                        text-slate-900
                    "
                >
                    Side-Quests
                </h1>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        mt-2
                        text-gray-500
                    "
                >
                    <span>Home</span>

                    <span>&gt;</span>

                    <span>Side-Quests</span>

                </div>

            </div>

            {/* Tabs */}

            <div
                className="
                    flex
                    items-center
                    gap-10
                    border-b
                    border-gray-200
                "
            >

                <button
                    onClick={() => setActiveTab("recommended")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "recommended"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >

                    ✨ Recommended

                    {activeTab === "recommended" && (

                        <span
                            className="
                                absolute
                                left-0
                                bottom-0
                                w-full
                                h-[3px]
                                bg-violet-600
                                rounded-full
                            "
                        />

                    )}

                </button>

                <button
                    onClick={() => setActiveTab("myQuest")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "myQuest"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >

                    {console.log(todayQuest)}

                    📋 My Quests ({todayQuest.length})

                    {activeTab === "myQuest" && (

                        <span
                            className="
                                absolute
                                left-0
                                bottom-0
                                w-full
                                h-[3px]
                                bg-violet-600
                                rounded-full
                            "
                        />

                    )}

                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`
                        relative
                        pb-4
                        font-semibold
                        transition
                        ${activeTab === "completed"
                            ? "text-violet-600"
                            : "text-gray-500 hover:text-slate-900"
                        }
                    `}
                >

                    ✅ Completed ({completedQuest.length})

                    {activeTab === "completed" && (

                        <span
                            className="
                                absolute
                                left-0
                                bottom-0
                                w-full
                                h-[3px]
                                bg-violet-600
                                rounded-full
                            "
                        />

                    )}

                </button>

            </div>

            <div
                className="
                    grid
                    grid-cols-12
                    gap-6
                "
            >

                {/* Left */}

                <div className="col-span-9">

                    <div
                        className="
                                bg-white
                                rounded-3xl
                                shadow-sm
                                border
                                border-gray-100
                                p-6
                            "
                    >
                        <h3
                            className="
                                    font-semibold
                                    text-lg
                                    mb-5
                                "
                        >
                            Filter by Mood
                        </h3>

                        <div className="flex flex-wrap gap-3">

                            {Object.entries(emotionConfig).map(([emotion, config]) => (

                                <button
                                    key={emotion}
                                    className="
                                            flex
                                            items-center
                                            gap-2
                                            px-5
                                            py-2
                                            rounded-xl
                                            border
                                            border-gray-200
                                            font-medium
                                            hover:bg-purple-50
                                            hover:border-purple-300
                                            transition
                                        "
                                >
                                    <span>{config.emoji}</span>
                                    <span>{config.label}</span>
                                </button>

                            ))}

                        </div>

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mt-8
                                mb-5
                            "
                        >

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >
                                Filter by Category
                            </h3>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <span className="text-gray-500">
                                    Sort by
                                </span>

                                <select
                                    className="
                                        border
                                        border-gray-200
                                        rounded-xl
                                        px-3
                                        py-2
                                        outline-none
                                    "
                                >
                                    <option>Newest</option>
                                    <option>XP Reward</option>
                                </select>

                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            <button
                                className="
                                    px-5
                                    py-2
                                    rounded-xl
                                    border
                                    border-purple-500
                                    bg-purple-50
                                    text-purple-600
                                    font-medium
                                "
                            >
                                All
                            </button>

                            {Object.entries(categoryConfig).map(([category, config]) => {

                                const Icon = config.icon;

                                return (

                                    <button
                                        key={category}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            px-5
                                            py-2
                                            rounded-xl
                                            border
                                            border-gray-200
                                            font-medium
                                            hover:bg-purple-50
                                            hover:border-purple-300
                                            transition
                                        "
                                    >

                                        <Icon
                                            size={18}
                                            className={config.text}
                                        />

                                        <span>
                                            {config.label}
                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                        <div className="space-y-6 mt-6">

                            {/* Recommended Quests */}

                            {
                                activeTab === "recommended" &&

                                quests.map((quest) => (

                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="recommended"
                                        onAdd={handleAddSideQuest}
                                    />

                                ))
                            }

                            {/* My Quests */}

                            {
                                activeTab === "myQuest" &&

                                todayQuest.map((quest) => (

                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="myQuest"
                                        onComplete={handleCompleteQuest}
                                    />

                                ))
                            }

                            {/* Completed Quests */}

                            {
                                activeTab === "completed" &&

                                completedQuest.map((quest) => (

                                    <SideQuestCard
                                        key={quest.id}
                                        quest={quest}
                                        type="completed"
                                    />

                                ))
                            }

                        </div>
                    </div>
                </div>


                {/* Right */}

                <div className="col-span-3">

                </div>
            </div>
        </div>
    );

}