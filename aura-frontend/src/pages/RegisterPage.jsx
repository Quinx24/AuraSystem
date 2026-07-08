import {
  User,
  Mail,
  Lock,
  Heart,
  Bot,
  Sparkles,
  BookOpen,
} from "lucide-react";

import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import Divider from "../components/auth/Divider";
import SocialLogin from "../components/auth/SocialLogin";
import { register } from "../services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agree) {
      newErrors.agree = "Please accept the Terms of Service.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {

      await register({

        fullName: formData.fullName,

        email: formData.email,

        password: formData.password,

      });

      alert("Register successful!");

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message ??
        "Register failed."
      );

    }
  };

  const features = [
    {
      title: "Track your emotions",
      description: "Understand your feelings better.",
      icon: Heart,
      className: "text-pink-500"
    },
    {
      title: "Get AI support",
      description: "Chat with your emotional companion.",
      icon: Bot,
      className: "text-violet-500"
    },
    {
      title: "Build better habits",
      description: "Small steps, big changes.",
      icon: Sparkles,
      className: "text-sky-500"
    }
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fbf8ff] via-white to-[#f3edff] px-5 py-8 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl" />

      <div className="relative grid w-full max-w-7xl animate-fade-in overflow-hidden rounded-[36px] border border-white/70 bg-white/90 shadow-2xl shadow-violet-100/70 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">

        {/* ================= LEFT ================= */}

        <div className="flex flex-col justify-between gap-6 bg-gradient-to-br from-white via-[#fffbff] to-[#f7f1ff] px-6 py-8 sm:px-10 md:gap-8 lg:px-14 lg:py-12">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <img
              src="/logo.png"
              alt="Aura"
              className="h-12 w-12 rounded-2xl shadow-sm"
            />

            <div>

              <h2 className="text-2xl font-bold text-[#221C5A]">
                Aura
              </h2>

              <p className="text-sm text-gray-500">
                Your emotional companion
              </p>

            </div>

          </div>

          <div>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-[#1B2559] md:text-4xl xl:text-5xl">
              Create your account
            </h1>

            <p className="mt-5 max-w-md text-base leading-8 text-gray-500 sm:text-lg">
              Start your journey to a calmer, healthier mind with small reflections that add up.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-8 bottom-2 h-24 rounded-full bg-violet-200/40 blur-2xl" />

            <div className="relative rounded-[32px] border border-violet-100 bg-white/80 p-5 shadow-xl shadow-violet-100/70">
              <div className="grid place-items-center rounded-[28px] bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-5 md:p-8">
                <div className="relative h-40 w-44">
                  <div className="absolute inset-6 rounded-full bg-violet-100" />
                  <div className="absolute left-6 top-8 grid h-14 w-14 place-items-center rounded-3xl bg-white text-violet-500 shadow-md">
                    <BookOpen size={28} />
                  </div>
                  <div className="absolute right-6 top-14 grid h-14 w-14 place-items-center rounded-3xl bg-white text-emerald-500 shadow-md">
                    <Sparkles size={28} />
                  </div>
                  <div className="absolute bottom-7 left-16 grid h-16 w-16 place-items-center rounded-full bg-white text-pink-500 shadow-md">
                    <Heart size={30} />
                  </div>
                  <div className="absolute right-11 top-3 h-3 w-3 rounded-full bg-amber-300" />
                  <div className="absolute bottom-9 right-4 h-4 w-4 rounded-full bg-sky-300" />
                  <div className="absolute bottom-16 left-4 h-2.5 w-2.5 rounded-full bg-violet-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature */}

          <div className="space-y-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 transition duration-200 hover:translate-x-1"
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center transition duration-200 group-hover:scale-105 ${feature.className}`}>
                    <Icon size={27} />
                  </div>

                  <div className="pt-0.5">
                    <h3 className="font-bold text-slate-900 transition duration-200 group-hover:text-violet-600">
                      {feature.title}
                    </h3>

                    <p className="mt-1.5 text-sm font-medium text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center justify-center bg-[#fcfbff]/90 p-6 sm:p-10 lg:p-12">

          <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-7 shadow-xl shadow-violet-100/60 sm:p-9">

            <div className="mb-7 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Join Aura
              </h2>

              <p className="mt-2 text-sm font-medium text-gray-500">
                Create a private space for your thoughts.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >

              {/* Full Name */}

              <AuthInput
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="Enter your full name"
                icon={<User size={18} />}
              />

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
                placeholder="Create a password"
                icon={<Lock size={18} />}
              />

              {/* Confirm Password */}

              <AuthInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                icon={<Lock size={18} />}
              />

              {/* Checkbox */}

              <label className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-sm font-medium leading-6 text-gray-500">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-violet-600 accent-violet-600"
                />

                <span>
                  I agree to the
                  <span className="cursor-pointer font-semibold text-violet-600 transition hover:text-violet-700">
                    {" "}Terms of Service
                  </span>
                  {" "}and{" "}
                  <span className="cursor-pointer font-semibold text-violet-600 transition hover:text-violet-700">
                    Privacy Policy
                  </span>
                </span>

              </label>

              {errors.agree && (
                <p className="text-sm font-medium text-red-500">
                  {errors.agree}
                </p>
              )}

              {/* Button */}

              <AuthButton
                text="Create Account"
                type="submit"
              />

              {/* Divider */}

              <Divider />

              {/* Social */}

              <SocialLogin />

              {/* Login */}

              <p className="text-center text-sm text-gray-500">

                Already have an account?

                <Link
                  to="/"
                  className="ml-2 font-semibold text-violet-600 transition hover:text-violet-700 hover:underline"
                >
                  Log In
                </Link>

              </p>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
