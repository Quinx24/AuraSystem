import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import AdminBreadcrumb from "./AdminBreadcrumb";

const routeMeta = {
    "/admin/dashboard": { title: "Dashboard", breadcrumb: ["Admin", "Dashboard"] },
    "/admin/users": { title: "Users", breadcrumb: ["Admin", "Users"] },
    "/admin/journals": { title: "Journal Entries", breadcrumb: ["Admin", "Journal Entries"] },
    "/admin/side-quests": { title: "Side Quests", breadcrumb: ["Admin", "Side Quests"] },
    "/admin/statistics": { title: "Statistics", breadcrumb: ["Admin", "Statistics"] },
    "/admin/profile": { title: "Profile", breadcrumb: ["Admin", "Profile"] },
};

export default function AdminHeader() {
    const { pathname } = useLocation();
    const meta = routeMeta[pathname] ?? {
        title: "Admin",
        breadcrumb: ["Admin"],
    };

    return (
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
            <div>
                <h1 className="text-lg font-bold text-slate-900 md:text-xl">
                    {meta.title}
                </h1>
                <AdminBreadcrumb items={meta.breadcrumb} />
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                <div className="relative hidden sm:block">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 rounded-xl border border-gray-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 md:w-64"
                    />
                </div>

                <button
                    type="button"
                    className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500" />
                </button>

                <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-sm font-bold text-white">
                        A
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-900">
                            Admin User
                        </p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
