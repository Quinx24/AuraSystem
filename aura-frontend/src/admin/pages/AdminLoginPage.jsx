import { Lock, Mail, Shield } from "lucide-react";

export default function AdminLoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fbf8ff] via-white to-[#f3edff] px-5 py-8 sm:px-8">
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl" />

            <div className="relative w-full max-w-md animate-fade-in overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-violet-100/70 backdrop-blur-xl sm:p-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                        <Shield className="text-violet-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Aura Admin
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to the management panel
                    </p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Email
                        </label>
                        <div className="group relative mt-2">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-violet-500"
                                size={18}
                            />
                            <input
                                type="email"
                                placeholder="admin@aura.com"
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 shadow-sm transition placeholder:text-gray-400 hover:border-violet-200 hover:bg-violet-50/30 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <div className="group relative mt-2">
                            <Lock
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-violet-500"
                                size={18}
                            />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 shadow-sm transition placeholder:text-gray-400 hover:border-violet-200 hover:bg-violet-50/30 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-2xl bg-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/60 transition hover:bg-violet-700"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
