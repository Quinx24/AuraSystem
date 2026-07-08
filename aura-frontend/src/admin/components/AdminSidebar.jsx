import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Target,
    BarChart3,
    User,
    LogOut,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BookOpen, label: "Journal Entries", path: "/admin/journals" },
    { icon: Target, label: "Side Quests", path: "/admin/side-quests" },
    { icon: BarChart3, label: "Statistics", path: "/admin/statistics" },
    { icon: User, label: "Profile", path: "/admin/profile" },
];

export default function AdminSidebar({ collapsed, onToggle }) {
    const navigate = useNavigate();

    return (
        <aside
            className={`
                fixed top-0 left-0 z-40 hidden h-screen flex-col
                border-r border-slate-200 bg-white
                lg:flex transition-all duration-300
                ${collapsed ? "w-[80px]" : "w-[280px]"}
            `}
        >
            <div
                className={`flex items-center ${collapsed ? "justify-center px-3" : "justify-between px-6"} pt-8 pb-6`}
            >
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                            <Shield className="text-violet-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Aura Admin
                            </h2>
                            <p className="text-xs text-slate-500">
                                Management Panel
                            </p>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                        <Shield className="text-violet-600" size={20} />
                    </div>
                )}

                <button
                    type="button"
                    onClick={onToggle}
                    className={`rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 ${collapsed ? "absolute right-2 top-8" : ""}`}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight size={18} />
                    ) : (
                        <ChevronLeft size={18} />
                    )}
                </button>
            </div>

            <nav className="flex-1 px-4">
                {menuItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `
                            mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                            ${collapsed ? "justify-center" : ""}
                            ${isActive ? "bg-violet-100 text-violet-600" : "text-slate-700 hover:bg-slate-100"}
                            `
                        }
                    >
                        <Icon size={20} />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-200 px-4 py-4">
                <button
                    type="button"
                    onClick={() => navigate("/admin/login")}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 ${collapsed ? "justify-center" : ""}`}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
