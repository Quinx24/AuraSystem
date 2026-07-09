import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { logout as logoutService } from "../../services/authService";

function initials(name) {
    return name ? name.charAt(0).toUpperCase() : "A";
}

export default function UserMenu({ compact = false }) {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        getCurrentUser()
            .then((res) => {
                if (!mounted) return;
                setUser(res.data.result ?? null);
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };

        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("click", onDoc);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("click", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const handleLogout = () => {
        logoutService();
        navigate('/');
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-100"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-sm font-bold text-white">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                        <span>{initials(user?.fullName)}</span>
                    )}
                </div>

                {!compact && (
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[160px]">
                            {user?.fullName ?? "User"}
                        </p>
                        <p className="text-xs text-slate-500">Member</p>
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                    <button onClick={() => { navigate('/profile'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Profile</button>
                    <button onClick={() => { navigate('/settings'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Settings</button>
                    <div className="border-t my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50">Logout</button>
                </div>
            )}
        </div>
    );
}
