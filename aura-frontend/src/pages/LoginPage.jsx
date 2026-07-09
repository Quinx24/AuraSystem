import AuthInput from "../components/auth/AuthInput";
import { login } from "../services/authService";
import AuthButton from "../components/auth/AuthButton";
import Divider from "../components/auth/Divider";
import SocialLogin from "../components/auth/SocialLogin";
import RoleSwitch from "../components/auth/RoleSwitch";
import Toast from "../components/auth/Toast";
import RoleMismatchDialog from "../components/auth/RoleMismatchDialog";

import { useState } from "react";
import { BookOpen, Heart, Lock, Mail, Shield, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";

export default function LoginPage() {

    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("USER");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const [toast, setToast] = useState(null);

    const [showRoleMismatchDialog, setShowRoleMismatchDialog] = useState(false);
    const [pendingUserRole, setPendingUserRole] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {

            const response = await login(formData);

            const data = response.data.result;

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            const userResponse = await getCurrentUser();

            const user = userResponse.data.result;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            const userRole = data.role || user.role;

            localStorage.setItem("role", userRole);

            if (selectedRole !== userRole) {
                setPendingUserRole(userRole);
                setShowRoleMismatchDialog(true);
                return;
            }

            if (userRole === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {

            setToast({
                message: error.response?.data?.message ?? "Login failed. Please check your credentials and try again.",
                type: "error"
            });

        }
    };

    const handleRoleSwitch = () => {
        setShowRoleMismatchDialog(false);
        setSelectedRole(pendingUserRole);

        if (pendingUserRole === "ADMIN") {
            navigate("/admin/dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    const handleDialogClose = () => {
        setShowRoleMismatchDialog(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fbf8ff] via-white to-[#f3edff] px-5 py-8 sm:px-8">
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl" />

            <div className="relative grid w-full max-w-6xl animate-fade-in overflow-hidden rounded-[36px] border border-white/70 bg-white/90 shadow-2xl shadow-violet-100/70 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">

                {/* Left */}
                <div className="flex flex-col justify-between gap-6 bg-gradient-to-br from-white via-[#fffbff] to-[#f7f1ff] px-6 py-8 sm:px-10 md:gap-8 lg:px-14 lg:py-12 xl:gap-10">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Aura"
                            className="h-12 w-12 rounded-2xl shadow-sm"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-[#2D2357]">
                                Aura
                            </h2>
                            <p className="text-sm text-gray-500">
                                Your emotional companion
                            </p>
                        </div>
                    </div>

                    <div>
                        <h1 className="mt-6 text-3xl font-bold leading-tight text-[#1B2559] md:text-4xl xl:text-5xl">
                            {selectedRole === "USER" ? "Welcome back 👋" : "Admin Portal"}
                        </h1>

                        <p className="mt-5 max-w-md text-base leading-8 text-gray-500 sm:text-lg">
                            {selectedRole === "USER"
                                ? "It's good to see you again. Let's continue your healing journey together."
                                : "Sign in to access the administration dashboard."}
                        </p>

                        {selectedRole === "ADMIN" && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                                <Shield size={16} />
                                <span>Administrator Mode</span>
                            </div>
                        )}
                    </div>

                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="absolute inset-x-8 bottom-2 h-24 rounded-full bg-violet-200/40 blur-2xl" />

                        <div className="relative rounded-[32px] border border-violet-100 bg-white/80 p-5 shadow-xl shadow-violet-100/70">
                            <div className="grid place-items-center rounded-[28px] bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 md:p-8">
                                <div className="relative h-44 w-44">
                                    <div className="absolute inset-7 rounded-full bg-violet-100" />
                                    <div className="absolute left-7 top-9 grid h-14 w-14 place-items-center rounded-3xl bg-white text-violet-500 shadow-md">
                                        <BookOpen size={28} />
                                    </div>
                                    <div className="absolute right-6 top-16 grid h-14 w-14 place-items-center rounded-3xl bg-white text-emerald-500 shadow-md">
                                        <Sprout size={28} />
                                    </div>
                                    <div className="absolute bottom-7 left-16 grid h-16 w-16 place-items-center rounded-full bg-white text-pink-500 shadow-md">
                                        <Heart size={30} />
                                    </div>
                                    <div className="absolute right-12 top-4 h-3 w-3 rounded-full bg-amber-300" />
                                    <div className="absolute bottom-10 right-4 h-4 w-4 rounded-full bg-sky-300" />
                                    <div className="absolute bottom-16 left-5 h-2.5 w-2.5 rounded-full bg-violet-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-center bg-[#fcfbff]/90 p-6 sm:p-10">

                    <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-8 shadow-xl shadow-violet-100/60 sm:p-10">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-slate-900">
                                {selectedRole === "USER" ? "Log in to Aura" : "Admin Sign In"}
                            </h2>

                            <p className="mt-2 text-sm font-medium text-gray-500">
                                {selectedRole === "USER"
                                    ? "Pick up right where your reflection left off."
                                    : "Access the administration panel"}
                            </p>
                        </div>

                        <RoleSwitch selectedRole={selectedRole} onRoleChange={setSelectedRole} />

                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                        >

                            {/* Email */}

                            <AuthInput
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="Enter your email"
                                icon={<Mail size={18} />}
                            />

                            {/* Password */}

                            <AuthInput
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Enter your password"
                                icon={<Lock size={18} />}
                            />

                            {/* Remember */}

                            <div className="flex justify-between text-sm">

                                <label className="flex items-center gap-2 font-medium text-gray-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-violet-600 accent-violet-600 focus:ring-violet-500"
                                    />
                                    Remember me
                                </label>

                                <button className="font-semibold text-violet-600 transition hover:text-violet-700 hover:underline">
                                    Forgot password?
                                </button>

                            </div>

                            {/* Button */}

                            <AuthButton
                                text="Log In"
                                type="submit"
                            />

                            {/* Divider - Only for User */}

                            {selectedRole === "USER" && <Divider />}

                            {/* Social - Only for User */}

                            {selectedRole === "USER" && <SocialLogin />}

                            {/* Sign up - Only for User */}

                            {selectedRole === "USER" && (
                                <p className="text-center text-sm text-gray-500">
                                    Don't have an account?
                                    <button
                                        type="button"
                                        className="ml-2 font-semibold text-violet-600 transition hover:text-violet-700 hover:underline"
                                        onClick={() => navigate("/register")}
                                    >
                                        Sign up
                                    </button>
                                </p>
                            )}

                        </form>

                    </div>

                </div>

            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Role Mismatch Dialog */}
            <RoleMismatchDialog
                isOpen={showRoleMismatchDialog}
                onClose={handleDialogClose}
                onSwitch={handleRoleSwitch}
                currentRole={selectedRole}
                accountRole={pendingUserRole}
            />
        </div>
    );
}
