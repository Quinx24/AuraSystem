import {
    FiHome,
    FiEdit3,
    FiCalendar,
    FiMessageCircle,
    FiTarget,
    FiBarChart2,
    FiBell,
    FiUser,
    FiSettings,
    FiLogOut,
} from 'react-icons/fi';

import { NavLink, useNavigate } from 'react-router-dom';

import { logout } from '../services/authService';

const menuItems = [
    {
        icon: <FiHome />,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: <FiEdit3 />,
        label: 'Emotion Journal',
        path: '/journal',
    },
    {
        icon: <FiCalendar />,
        label: 'Calendar Tracker',
        path: '/calendar',
    },
    // {
    //     icon: <FiMessageCircle />,
    //     label: 'AI Companion',
    //     path: '/ai',
    // },
    {
        icon: <FiTarget />,
        label: 'Side-Quests',
        path: '/quests',
    },
    // {
    //     icon: <FiBarChart2 />,
    //     label: 'Insights',
    //     path: '/insights',
    // },
    // {
    //     icon: <FiBell />,
    //     label: 'Notifications',
    //     path: '/notifications',
    // },
    {
        icon: <FiUser />,
        label: 'Profile',
        path: '/profile',
    },
];

export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/");
    };

    return (
        <aside className="fixed top-0 left-0 w-[280px] h-screen border-r border-slate-200 bg-white flex flex-col">

            {/* Logo */}
            <div className="px-6 pt-8 pb-6">
                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        🌤️
                    </div>

                    <div>
                        <h2 className="font-bold text-2xl text-slate-900">
                            Aura
                        </h2>

                        <p className="text-[13px] text-slate-500">
                            Your emotional companion
                        </p>
                    </div>

                </div>
            </div>

            {/* Top Menu */}
            <nav className="flex-1 px-4">

                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            mb-1
                            transition-all

                            ${isActive
                                ? 'bg-violet-100 text-violet-600'
                                : 'text-slate-700 hover:bg-slate-100'
                            }
                            `
                        }
                    >
                        <span className="text-lg">
                            {item.icon}
                        </span>

                        <span>
                            {item.label}
                        </span>
                    </NavLink>
                ))}

            </nav>

            {/* Bottom Menu */}
            <div className="px-4 border-t border-slate-200 pt-4">

                {/* <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        mb-1
                        transition-all

                        ${
                            isActive
                                ? 'bg-violet-100 text-violet-600'
                                : 'text-slate-700 hover:bg-slate-100'
                        }
                        `
                    }
                >
                    <FiSettings />
                    <span>Settings</span>
                </NavLink> */}

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        text-slate-700
                        hover:bg-slate-100
                        transition-all
                    "
                >
                    <FiLogOut />

                    <span>Logout</span>
                    
                </button>

            </div>

            {/* Mascot Card */}
            <div className="p-4">

                <div className="rounded-3xl bg-violet-50 p-5">

                    <div className="flex justify-center mb-4">
                        <div className="text-5xl">
                            ☁️
                        </div>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2">
                        Stay on track with gentle reminders
                    </h3>

                    <p className="text-sm text-slate-500 leading-6">
                        Small nudges help build positive changes.
                    </p>

                </div>

            </div>

        </aside>
    );
}