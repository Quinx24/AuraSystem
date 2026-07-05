import {
  User,
  Mail,
  Lock,
  Eye,
  Heart,
  Bot,
  Sparkles,
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

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
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

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ??
        "Register failed."
      );

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8f4ff] flex items-center justify-center px-8 py-10">

      <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* ================= LEFT ================= */}

        <div className="px-16 py-12 flex flex-col justify-center bg-gradient-to-br from-white to-[#faf5ff]">

          {/* Logo */}

          <div className="flex items-center gap-4 mb-12">

            <img
              src="/logo.png"
              alt="Aura"
              className="w-12 h-12"
            />

            <div>

              <h2 className="text-3xl font-bold text-[#221C5A]">
                Aura
              </h2>

              <p className="text-gray-500">
                Your emotional companion
              </p>

            </div>

          </div>

          <h1 className="text-5xl font-bold text-[#1B2559] leading-tight">
            Create your account
          </h1>

          <p className="text-gray-500 text-lg mt-5 leading-8">
            Start your journey to a happier
            <br />
            and healthier you 💜
          </p>

          {/* Mascot */}

          <img
            src="/mascot-register.png"
            alt=""
            className="w-72 mx-auto my-10"
          />

          {/* Feature */}

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="bg-pink-50 p-3 rounded-full">
                <Heart className="text-pink-500" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Track your emotions
                </h3>

                <p className="text-gray-500 text-sm">
                  Understand your feelings better.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-full">
                <Bot className="text-violet-500" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Get AI support
                </h3>

                <p className="text-gray-500 text-sm">
                  Chat with your emotional companion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-sky-50 p-3 rounded-full">
                <Sparkles className="text-sky-500" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Build better habits
                </h3>

                <p className="text-gray-500 text-sm">
                  Small steps, big changes.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center justify-center bg-[#fcfbff] p-12">

          <div className="bg-white rounded-3xl shadow-lg border w-full max-w-md p-10">

            <form
              className="space-y-5"
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

              <label className="flex gap-3 text-sm text-gray-500">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />

                <span>
                  I agree to the
                  <span className="text-violet-600">
                    {" "}Terms of Service
                  </span>
                  {" "}and{" "}
                  <span className="text-violet-600">
                    Privacy Policy
                  </span>
                </span>

              </label>

              {errors.agree && (
                <p className="text-sm text-red-500">
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
                  to="/login"
                  className="ml-2 text-violet-600 font-semibold"
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