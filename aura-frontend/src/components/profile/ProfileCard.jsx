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
                    p-5
                    md:p-8
                    transition-all
                    duration-300
                    hover:shadow-lg
                "
            >

                <div className="flex justify-center">

                    <img
                        src={avatarUrl}
                        alt="Profile Avatar"
                        className="
                            block
                            mx-auto
                            h-28
                            w-28
                            md:h-36
                            md:w-36
                            rounded-full
                            object-cover
                            border-4
                            border-violet-100
                        "
                    />

                </div>

                <h2
                    className="
                        text-2xl
                        md:text-3xl
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
                    Soul Explorer
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
                        onClick={() => setEditing(true)}
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
                        onClick={() => setChangingPassword(true)}
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
