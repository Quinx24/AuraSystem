import { Bell } from "lucide-react";

export default function NotificationButton({ hasBadge = false, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
        >
            <Bell size={18} />
            {hasBadge && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
        </button>
    );
}
