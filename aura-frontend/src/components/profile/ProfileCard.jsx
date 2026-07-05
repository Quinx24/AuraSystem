import { FiCamera } from "react-icons/fi";

import {
    FiMail,
    FiCalendar,
    FiAward
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { getLevel } from "../../services/levelService";

export default function ProfileCard() {

    const [level, setLevel] = useState({
        level: 1,
        xp: 0,
        requiredXp: 100,
        progress: 0,
    });

    const loadLevel = async () => {
        try {

            const data = await getLevel();

            setLevel(data);

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {
        loadLevel();
    }, []);

    const user = {

        fullName: "Tien Nguyen",

        role: "Soul Explorer",

        email: "tien@gmail.com",

        joinedDate: "July 2026"

    };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-sm
                p-8
                transition-all
                duration-300
                hover:shadow-lg
            "
        >

            <div className="relative w-fit mx-auto">

                <img
                    src="https://i.pravatar.cc/300"
                    className="
                        w-36
                        h-36
                        rounded-full
                        object-cover
                        border-4
                        border-violet-100
                    "
                />

                <button
                    className="
                        absolute
                        bottom-2
                        right-1
                        w-10
                        h-10
                        rounded-full
                        bg-white
                        shadow-md
                        border
                        border-gray-100
                        flex
                        items-center
                        justify-center
                        hover:bg-violet-50
                        transition
                    "
                >
                    <FiCamera
                        className="
                            text-violet-600
                        "
                    />
                </button>

            </div>

            <h2
                className="
                    text-3xl
                    font-bold
                    text-center
                    mt-6
                "
            >
                {user.fullName}
            </h2>

            <p
                className="
                    mt-4
                    mx-auto
                    w-fit
                    px-4
                    py-2
                    rounded-full
                    bg-violet-50
                    text-violet-600
                    text-sm
                    font-semibold
                "
            >
                {user.role}
            </p>

            <div className="mt-6">

                <div className="flex justify-between mb-2">

                    <span
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Level {level.level}
                    </span>

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-violet-600
                        "
                    >
                        {level.xp} / {level.requiredXp} XP
                    </span>

                </div>

                <div
                    className="
                        h-3
                        bg-gray-100
                        rounded-full
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            h-full
                            bg-violet-500
                            rounded-full
                        "
                        style={{
                            width: `${level.progress}%`
                        }}
                    />

                </div>

            </div>

            <hr
                className="
                    my-8
                    border-gray-100
                "
            />

            <div className="space-y-5">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-violet-50
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <FiMail
                            className="
                                text-violet-600
                                text-lg
                            "
                        />

                    </div>

                    <div>

                        <p className="text-sm text-gray-400">
                            Email
                        </p>

                        <p className="font-medium">
                            {user.email}
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-violet-50
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <FiCalendar
                            className="
                                text-violet-500
                                text-lg
                            "
                        />

                    </div>

                    <div>

                        <p className="text-sm text-gray-400">
                            Joined Date
                        </p>

                        <p className="font-medium">
                            {user.joinedDate}
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-violet-50
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <FiAward
                            className="
                                text-violet-500
                                text-lg
                            "
                        />

                    </div>

                    <div>

                        <p className="text-sm text-gray-400">
                            Membership
                        </p>

                        <p className="font-medium">
                            Free User
                        </p>

                    </div>

                </div>

            </div>


            <div className="mt-10 space-y-4">

                <button
                    className="
                        w-full
                        py-3
                        rounded-xl
                        bg-violet-600
                        text-white
                        font-semibold
                        hover:bg-violet-700
                        transition
                    "
                >
                    Edit Profile
                </button>

                <button
                    className="
                        w-full
                        py-3
                        rounded-xl
                        border
                        border-violet-300
                        text-violet-600
                        font-semibold
                        hover:bg-violet-50
                        transition
                    "
                >
                    Change Password
                </button>

            </div>
        </div>

    );
}