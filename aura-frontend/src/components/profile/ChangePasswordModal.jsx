import { useEffect, useState } from "react";

import {
    FiLock,
    FiEye,
    FiEyeOff
} from "react-icons/fi";

import { changePassword } from "../../services/userService";
import { toast } from "sonner";

export default function ChangePasswordModal({
    open,
    onClose
}) {

    const [form, setForm] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrent, setShowCurrent] = useState(false);

    const [showNew, setShowNew] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [strength, setStrength] = useState(0);

    const resetForm = () => {

        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        setErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        setStrength(0);

    };

    const calculateStrength = (password) => {

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score;
    };

    const getStrengthColor = () => {

        switch (strength) {

            case 1:
                return "#ef4444";

            case 2:
                return "#f97316";

            case 3:
                return "#facc15";

            case 4:
                return "#84cc16";

            case 5:
                return "#22c55e";

            default:
                return "#e5e7eb";
        }

    };

    const getStrengthLabel = () => {

        switch (strength) {

            case 1:
                return "Weak";

            case 2:
                return "Fair";

            case 3:
                return "Good";

            case 4:
                return "Strong";

            case 5:
                return "Very Strong";

            default:
                return "";
        }

    };

    const getStrengthTextColor = () => {

        switch (strength) {

            case 1:
                return "text-red-500";

            case 2:
                return "text-orange-500";

            case 3:
                return "text-yellow-500";

            case 4:
                return "text-lime-500";

            case 5:
                return "text-green-600";

            default:
                return "text-gray-400";

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        if (e.target.name === "newPassword") {
            setStrength(
                calculateStrength(e.target.value)
            );
        }

        setErrors({
            ...errors,
            [e.target.name]: ""
        });

    };


    const handleSave = async () => {

        if (!form.currentPassword.trim()) {

            setErrors({
                currentPassword: "Current password is required.",
                newPassword: "",
                confirmPassword: ""
            });

            return;
        }

        if (!form.newPassword.trim()) {

            setErrors({
                currentPassword: "",
                newPassword: "New password is required.",
                confirmPassword: ""
            });

            return;
        }

        if (form.newPassword.length < 8) {

            setErrors({
                currentPassword: "",
                newPassword: "Password must be at least 8 characters.",
                confirmPassword: ""
            });

            return;
        }

        if (form.newPassword !== form.confirmPassword) {

            setErrors({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "Passwords do not match."
            });

            return;
        }

        try {

            setLoading(true);

            setErrors({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            toast.success("Password changed successfully!");

            resetForm();

            onClose();

        } catch (error) {

            const message = error.response?.data?.message;

            if (message === "Invalid password") {

                setErrors({
                    currentPassword: "Current password is incorrect.",
                    newPassword: "",
                    confirmPassword: ""
                });

            } else if (
                message === "New password must be different from current password"
            ) {

                setErrors({
                    currentPassword: "",
                    newPassword:
                        "New password must be different from your current password.",
                    confirmPassword: ""
                });

            } else {

                toast.error(
                    message || "Failed to change password."
                );

            }

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        if (!open) {

            resetForm();
        }

    }, [open]);

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">

            <div className="bg-white rounded-3xl w-full max-w-xl p-8">

                <h2 className="text-3xl font-bold">
                    Change Password
                </h2>

                <p
                    className="
                        text-gray-500
                        mt-2
                        mb-8
                    "
                >
                    Update your password to keep your account secure.
                </p>

                <div className="space-y-6">

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

                            <FiLock size={16} />

                            <span>
                                Current Password
                            </span>

                        </label>

                        <div className="relative">

                            <input
                                type={showCurrent ? "text" : "password"}
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter your current password"
                                className={`
                                    w-full
                                    rounded-2xl
                                    px-5
                                    py-4
                                    pr-14
                                    outline-none
                                    transition
                                    focus:ring-4
                                    ${errors.currentPassword
                                        ? "border border-red-500 focus:ring-red-100 focus:border-red-500"
                                        : "border border-gray-200 focus:ring-violet-100 focus:border-violet-500"
                                    }
                                `}
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            >
                                {
                                    showCurrent
                                        ? <FiEyeOff />
                                        : <FiEye />
                                }
                            </button>

                        </div>

                        {
                            errors.currentPassword && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.currentPassword}
                                </p>
                            )
                        }

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

                            <FiLock size={16} />

                            <span>
                                New Password
                            </span>

                        </label>

                        <div className="relative">

                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                className={`
                                    w-full
                                    rounded-2xl
                                    px-5
                                    py-4
                                    pr-14
                                    outline-none
                                    transition
                                    focus:ring-4
                                    ${errors.newPassword
                                        ? "border border-red-500 focus:ring-red-100 focus:border-red-500"
                                        : "border border-gray-200 focus:ring-violet-100 focus:border-violet-500"
                                    }
                                `}
                            />

                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            >
                                {
                                    showNew
                                        ? <FiEyeOff />
                                        : <FiEye />
                                }
                            </button>

                        </div>

                        {
                            errors.newPassword && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.newPassword}
                                </p>
                            )
                        }

                        {
                            form.newPassword && (

                                <div className="mt-3">

                                    <div className="flex justify-between text-sm">

                                        <span className="text-gray-500">
                                            Password Strength
                                        </span>

                                        <span className={`font-medium ${getStrengthTextColor()}`}>
                                            {getStrengthLabel()}
                                        </span>

                                    </div>

                                    <div
                                        className="
                                            mt-2
                                            h-2
                                            rounded-full
                                            bg-gray-200
                                            overflow-hidden
                                        "
                                    >

                                        <div
                                            className="h-full transition-all duration-300"
                                            style={{
                                                width: `${strength * 20}%`,
                                                backgroundColor: getStrengthColor()
                                            }}
                                        />

                                    </div>

                                </div>

                            )
                        }

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

                            <FiLock size={16} />

                            <span>
                                Confirm New Password
                            </span>

                        </label>

                        <div className="relative">

                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                className={`
                                    w-full
                                    rounded-2xl
                                    px-5
                                    py-4
                                    pr-14
                                    outline-none
                                    transition
                                    focus:ring-4
                                    ${errors.confirmPassword
                                        ? "border border-red-500 focus:ring-red-100 focus:border-red-500"
                                        : "border border-gray-200 focus:ring-violet-100 focus:border-violet-500"
                                    }
                                `}
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            >
                                {
                                    showConfirm
                                        ? <FiEyeOff />
                                        : <FiEye />
                                }
                            </button>

                        </div>

                        {
                            errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )
                        }

                    </div>

                </div>

                <div className="flex justify-end gap-4 mt-10">

                    <button
                        disabled={loading}
                        onClick={() => {

                            resetForm();

                            onClose();

                        }}
                        className="
                            px-8
                            py-3
                            rounded-xl
                            border
                            border-gray-300
                            font-semibold
                            hover:bg-gray-100
                            transition
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="
                            px-8
                            py-3
                            rounded-xl
                            bg-violet-600
                            text-white
                            font-semibold
                            hover:bg-violet-700
                            transition
                        "
                    >
                        {
                            loading
                                ? "Updating..."
                                : "Update Password"
                        }
                    </button>

                </div>

            </div>

        </div>

    );
}