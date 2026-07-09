import { User, Shield } from "lucide-react";

export default function RoleSwitch({ selectedRole, onRoleChange }) {
    return (
        <div className="mb-6">
            <div className="relative flex w-full rounded-2xl bg-gray-100 p-1.5 shadow-inner">
                <div
                    className={`absolute top-1.5 bottom-1.5 w-1/2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 shadow-lg shadow-violet-200/60 transition-all duration-300 ease-out ${
                        selectedRole === "USER" ? "left-1.5" : "left-[calc(50%-6px)]"
                    }`}
                />
                <button
                    type="button"
                    onClick={() => onRoleChange("USER")}
                    className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                        selectedRole === "USER"
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                    <User size={18} />
                    <span>User</span>
                </button>
                <button
                    type="button"
                    onClick={() => onRoleChange("ADMIN")}
                    className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                        selectedRole === "ADMIN"
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                    <Shield size={18} />
                    <span>Admin</span>
                </button>
            </div>
        </div>
    );
}
