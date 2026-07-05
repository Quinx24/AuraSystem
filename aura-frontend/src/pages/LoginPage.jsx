import AuthInput from "../components/auth/AuthInput";
import { login } from "../services/authService";
import AuthButton from "../components/auth/AuthButton";
import Divider from "../components/auth/Divider";
import SocialLogin from "../components/auth/SocialLogin";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";

export default function LoginPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

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

            navigate("/journal");

        } catch (error) {

            alert(
                error.response?.data?.message ??
                "Login failed. Please check your credentials and try again."
            );

        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f7f2ff] flex items-center justify-center px-6">
            <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-xl overflow-hidden grid lg:grid-cols-2">

                {/* Left */}
                <div className="flex flex-col justify-center px-14 py-12 bg-gradient-to-br from-white to-[#faf5ff]">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <img src="/logo.png" alt="Aura" className="w-12 h-12" />
                        <div>
                            <h2 className="text-2xl font-bold text-[#2D2357]">
                                Aura
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Your emotional companion
                            </p>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-[#1B2559] mb-5">
                        Welcome back 👋
                    </h1>

                    <p className="text-gray-500 text-lg mb-10 leading-8">
                        It's good to see you again.
                        <br />
                        Let's continue your healing journey together.
                    </p>

                    <img src="/mascot-login.png" alt="" className="w-72 mx-auto" />

                    <div className="mt-10 bg-white rounded-2xl p-5 shadow-md border">
                        <h4 className="font-semibold text-[#2D2357]">
                            💜 You matter.
                        </h4>

                        <p className="text-gray-500 text-sm mt-2 leading-6">
                            Your feelings matter.
                            <br />
                            We're here whenever you need.
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-center bg-[#fcfbff] p-10">

                    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border p-10">

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

                                <label className="flex items-center gap-2 text-gray-500">
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <button className="text-violet-500 hover:underline">
                                    Forgot password?
                                </button>

                            </div>

                            {/* Button */}

                            <AuthButton
                                text="Log In"
                                type="submit"
                            />

                            {/* Divider */}

                            <Divider />

                            {/* Social */}

                            <SocialLogin />

                            <p className="text-center text-gray-500 text-sm">
                                Don't have an account?
                                <button 
                                    type="button"
                                    className="text-violet-600 font-semibold ml-2 hover:underline"
                                    onClick={() => navigate("/register")}
                                >
                                    Sign up
                                </button>
                            </p>

                        </form>

                    </div>

                </div>

            </div>
        </div>
    );
}