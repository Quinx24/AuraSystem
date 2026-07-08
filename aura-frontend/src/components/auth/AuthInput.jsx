import { Eye } from "lucide-react";

export default function AuthInput({
    label,
    icon,
    type,
    placeholder,
    name,
    value,
    onChange,
    error,
}) {
    return (
        <div>

            <label className="text-sm font-semibold text-slate-700">
                {label}
            </label>

            <div className="group relative mt-2">

                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-violet-500">
                    {icon}
                </div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                        w-full
                        border
                        border-gray-200
                        rounded-2xl
                        bg-white
                        py-3
                        pl-11
                        pr-11
                        text-sm
                        font-medium
                        text-slate-800
                        shadow-sm
                        transition
                        duration-200
                        placeholder:text-gray-400
                        hover:border-violet-200
                        hover:bg-violet-50/30
                        focus:outline-none
                        focus:border-violet-400
                        focus:ring-4
                        focus:ring-violet-100
                    "
                />

                {type === "password" && (
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition group-focus-within:text-violet-400">
                        <Eye size={17} />
                    </div>
                )}

                {error && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}
