import { Shield, User } from "lucide-react";

export default function RoleMismatchDialog({ isOpen, onClose, onSwitch, accountRole }) {
    if (!isOpen) return null;

    const isAdminAccount = accountRole === "ADMIN";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                        isAdminAccount ? "bg-violet-100" : "bg-emerald-100"
                    }`}>
                        {isAdminAccount ? (
                            <Shield className="text-violet-600" size={32} />
                        ) : (
                            <User className="text-emerald-600" size={32} />
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">
                        {isAdminAccount ? "Admin Account Detected" : "User Account Detected"}
                    </h3>

                    <p className="mt-3 text-gray-600">
                        {isAdminAccount
                            ? "This account belongs to an administrator. Would you like to switch to Admin mode?"
                            : "This account belongs to a regular user. Would you like to switch to User mode?"}
                    </p>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSwitch}
                        className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition ${
                            isAdminAccount
                                ? "bg-violet-600 hover:bg-violet-700 shadow-violet-200/60"
                                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/60"
                        }`}
                    >
                        Switch to {isAdminAccount ? "Admin" : "User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
