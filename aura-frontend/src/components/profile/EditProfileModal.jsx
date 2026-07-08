import { useEffect, useState } from "react";
import { updateCurrentUser } from "../../services/userService";

import {
    FiUser,
    FiMail,
    FiLink,
} from "react-icons/fi";

import AvatarUploader from "./AvatarUploader";

export default function EditProfileModal({
    open,
    user,
    level,
    onClose,
    onSuccess
}) {

    const [form, setForm] = useState({
        fullName: "",
        avatarUrl: ""
    });

    useEffect(() => {

        if (user) {

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                fullName: user.fullName || "",
                avatarUrl: user.avatarUrl || ""
            });

        }

    }, [user]);

    if (!open) return null;

    const handleSave = async () => {

        try {

            await updateCurrentUser(form);

            await onSuccess();

            onClose();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                backdrop-blur-sm
                flex
                items-center
                justify-center
                z-50
                p-4
                md:p-6
            "
        >
            <div
                className="
                    bg-white
                    rounded-[32px]
                    shadow-2xl
                    w-full
                    max-w-5xl
                    overflow-hidden
                    flex
                    max-h-[90vh]
                    flex-col
                    overflow-y-auto
                    lg:flex-row
                    animate-fade-in
                "
            >

                <div
                    className="
                        w-full
                        lg:w-[320px]
                        bg-gradient-to-b
                        from-violet-600
                        to-purple-700
                        text-white
                        p-6
                        md:p-8
                        flex
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <AvatarUploader
                        avatarUrl={form.avatarUrl}
                        border="border-4 border-white"
                        onUploaded={(avatarUrl) => {
                            setForm({
                                ...form,
                                avatarUrl,
                            });
                        }}
                    />

                    <div className="w-full mt-8">

                        <p
                            className="
                                text-lg
                                font-semibold
                            "
                        >
                            Level {level.level}
                        </p>

                        <div
                            className="
                                bg-white/20
                                h-2
                                rounded-full
                                mt-2
                            "
                        >

                            <div
                                className="bg-white h-full rounded-full"
                                style={{
                                    width: `${level.progress}%`
                                }}
                            />

                        </div>

                        <p className="mt-4 text-sm text-white/80">
                            {level.xp} / {level.requiredXp} XP
                        </p>

                        <div
                            className="
                                mt-10
                                w-full
                                rounded-2xl
                                bg-white/10
                                p-5
                                backdrop-blur-sm
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-white/60
                                "
                            >
                                Membership
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-semibold
                                "
                            >
                                Soul Explorer
                            </p>

                        </div>

                    </div>

                </div>

                <div
                    className="
                        flex-1
                        p-5
                        md:p-10
                    "
                >

                    <h2
                        className="
                            text-2xl
                            md:text-3xl
                            xl:text-4xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Edit Profile
                    </h2>

                    <p
                        className="
                            text-gray-500
                            mt-2
                            mb-10
                        "
                    >
                        Update your personal information and customize your profile.
                    </p>

                    <div className="space-y-5">

                        <div>

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                <FiUser size={17} />

                                <span>
                                    Full Name
                                </span>

                            </label>

                            <input
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    px-5
                                    py-4
                                    transition
                                    outline-none
                                    focus:border-violet-500
                                    focus:ring-4
                                    focus:ring-violet-100
                                "
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fullName: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div>

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                <FiMail size={16} />

                                <span>Email</span>

                            </label>

                            <input
                                value={user.email}
                                disabled
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    px-5
                                    py-4
                                    text-gray-500
                                    cursor-not-allowed
                                "
                            />

                        </div>

                        <div>

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                <FiLink size={16} />

                                <span>Avater URL</span>

                            </label>

                            <input
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    px-5
                                    py-4
                                    transition
                                    outline-none
                                    focus:border-violet-500
                                    focus:ring-4
                                    focus:ring-violet-100
                                "
                                value={form.avatarUrl}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        avatarUrl: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row sm:gap-4">

                        <button
                            onClick={onClose}
                            className="
                                px-6
                                md:px-8
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                font-semibold
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="
                                px-6
                                md:px-8
                                py-3
                                rounded-xl
                                bg-gradient-to-r
                                from-violet-600
                                to-purple-500
                                text-white
                                font-semibold
                                hover:shadow-xl
                                transition
                            "
                        >
                            Save
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}
