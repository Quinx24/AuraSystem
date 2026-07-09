import {
    FiMail,
    FiCalendar,
    FiAward
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/userService";
import { getLevel } from "../../services/levelService";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileCard() {

    const [user, setUser] = useState({
        fullName: "",
        email: "",
        avatarUrl: null,
        createdAt: null,
    });

    const [level, setLevel] = useState({
        level: 1,
        xp: 0,
        requiredXp: 100,
        progress: 0,
    });

    const avatarUrl = user.avatarUrl
        ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}`
        : "https://i.pravatar.cc/300";

    const [editing, setEditing] = useState(false);

    const [changingPassword, setChangingPassword] = useState(false);

    const loadUser = async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    const loadLevel = async () => {
        try {
            const data = await getLevel();
            setLevel(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUser();
        loadLevel();
    }, []);

    return (
        <>
            <div
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    shadow-sm
                    p-6
                    md:p-8
                    transition-all
                    duration-300
                    hover:shadow-md
                "
            >

                <div className="flex justify-center">

                    <div className="relative">
                        <img
                            src={avatarUrl}
                            alt="Profile Avatar"
                            className="
                                block
                                mx-auto
                                h-32
                                w-32
                                md:h-40
                                md:w-40
                                rounded-full
                                object-cover
                                border-4
                                border-white
                                shadow-lg
                                shadow-violet-100
                            "
                        />
                        <div className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-violet-500 text-white shadow-md">
                            <span className="text-lg">✨</span>
                        </div>
                    </div>

                </div>

                <h2
                    className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        text-center
                        text-slate-900
                        mt-6
                    "
                >
                    {user.fullName}
                </h2>

                <p
                    className="
                        mt-3
                        mx-auto
                        w-fit
                        px-4
                        py-1.5
                        rounded-full
                        bg-gradient-to-r from-violet-50 to-violet-100
                        text-violet-700
                        text-sm
                        font-semibold
                        border border-violet-200
                    "
                >
                    Soul Explorer
                </p>

                <div className="mt-6">

                    <div className="flex justify-between items-center mb-2">

                        <span
                            className="
                                text-sm
                                font-medium
                                text-gray-600
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
                            h-2.5
                            bg-gray-100
                            rounded-full
                            overflow-hidden
                        "
                    >

                        <div
                            className="
                                h-full
                                bg-gradient-to-r from-violet-500 to-violet-600
                                rounded-full
                                transition-all duration-500
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

                <div className="space-y-4">

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-50
                                flex
                                items-center
                                justify-center
                                text-violet-600
                            "
                        >

                            <FiMail
                                className="
                                    text-lg
                                "
                            />

                        </div>

                        <div className="flex-1">

                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Email
                            </p>

                            <p className="font-medium text-slate-700">
                                {user.email}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-50
                                flex
                                items-center
                                justify-center
                                text-violet-600
                            "
                        >

                            <FiCalendar
                                className="
                                    text-lg
                                "
                            />

                        </div>

                        <div className="flex-1">

                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Joined Date
                            </p>

                            <p className="font-medium text-slate-700">
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )
                                    : "-"
                                }
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-50
                                flex
                                items-center
                                justify-center
                                text-violet-600
                            "
                        >

                            <FiAward
                                className="
                                    text-lg
                                "
                            />

                        </div>

                        <div className="flex-1">

                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Membership
                            </p>

                            <p className="font-medium text-slate-700">
                                Free User
                            </p>

                        </div>

                    </div>

                </div>


                <div className="mt-8 space-y-3">

                    <button
                        onClick={() => setEditing(true)}
                        className="
                            w-full
                            py-3
                            rounded-xl
                            bg-gradient-to-r from-violet-600 to-violet-700
                            text-white
                            font-semibold
                            hover:from-violet-700
                            hover:to-violet-800
                            transition-all duration-200
                            shadow-md
                            shadow-violet-200
                        "
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() => setChangingPassword(true)}
                        className="
                            w-full
                            py-3
                            rounded-xl
                            border
                            border-violet-200
                            text-violet-700
                            font-semibold
                            hover:bg-violet-50
                            hover:border-violet-300
                            transition-all duration-200
                        "
                    >
                        Change Password
                    </button>

                </div>
            </div>

            <EditProfileModal
                open={editing}
                user={user}
                level={level}
                onClose={() => setEditing(false)}
                onSuccess={loadUser}
            />

            <ChangePasswordModal
                open={changingPassword}
                onClose={() => setChangingPassword(false)}
            />
        </>
    );
}
