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

            <label className="font-medium">
                {label}
            </label>

            <div className="relative mt-2">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                        rounded-xl
                        py-3
                        pl-11
                        pr-4
                        focus:outline-none
                        focus:ring-2
                        focus:ring-violet-400
                    "
                />

                {error && (
                    <p className="mt-1 text-sm text-red-500">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}