import { useLocation } from "react-router-dom";
import SearchBar from "./header/SearchBar";
import NotificationButton from "./header/NotificationButton";
import UserMenu from "./header/UserMenu";
import AdminBreadcrumb from "../admin/components/AdminBreadcrumb";
import { usePageMeta } from "../contexts/PageMetaContext";

const routeMeta = {
    "/dashboard": { breadcrumb: ["Home", "Dashboard"] },
    "/journal": { breadcrumb: ["Home", "Emotion Journal"] },
    "/emotion-analysis": { breadcrumb: ["Home", "Emotion Analysis"] },
    "/journal-history": { breadcrumb: ["Home", "Journal History"] },
    "/calendar": { breadcrumb: ["Home", "Calendar Tracker"] },
    "/quests": { breadcrumb: ["Home", "Side Quests"] },
    "/profile": { breadcrumb: ["Home", "Profile"] },
    // admin
    "/admin/dashboard": { breadcrumb: ["Admin", "Dashboard"] },
    "/admin/users": { breadcrumb: ["Admin", "Users"] },
    "/admin/journals": { breadcrumb: ["Admin", "Journal Entries"] },
    "/admin/side-quests": { breadcrumb: ["Admin", "Side Quests"] },
    "/admin/statistics": { breadcrumb: ["Admin", "Statistics"] },
    "/admin/profile": { breadcrumb: ["Admin", "Profile"] },
};

export default function Header({ showSearch = true, showNotification = true, showUserMenu = true }) {
    const { pathname } = useLocation();
    const { meta } = usePageMeta();

    // Match exact or prefix paths (for dynamic segments like /emotion-analysis/:id)
    const findMeta = () => {
        if (routeMeta[pathname]) return routeMeta[pathname];
        // try prefix match
        const found = Object.keys(routeMeta).find((p) => pathname.startsWith(p));
        return found ? routeMeta[found] : {};
    };

    const auto = findMeta();

    // Prefer route metadata so breadcrumb updates immediately on navigation.
    const breadcrumb = auto.breadcrumb ?? meta.breadcrumb ?? null;

    return (
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
            <div>
                {breadcrumb && (
                    <AdminBreadcrumb items={breadcrumb} />
                )}
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                {showSearch && <SearchBar />}
                {showNotification && <NotificationButton hasBadge />}
                {showUserMenu && <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-5"><UserMenu /></div>}
            </div>
        </header>
    );
}
