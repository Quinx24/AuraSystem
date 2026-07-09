import { useLocation } from "react-router-dom";
import { usePageMeta } from "../contexts/PageMetaContext";

const routeIntroductionMap = {
    "/dashboard": {
        title: "Dashboard",
        description: "Overview of your emotional wellness.",
    },
    "/journal": {
        title: "Emotion Journal",
        description: "Write down today's thoughts and emotions.",
    },
    "/emotion-analysis": {
        title: "Emotion Analysis",
        description: "Review emotional insights generated from your journal entries.",
    },
    "/journal-history": {
        title: "Journal History",
        description: "Browse your previous journal entries.",
    },
    "/calendar": {
        title: "Calendar Tracker",
        description: "Track your emotional journey over time.",
    },
    "/quests": {
        title: "Side Quests",
        description: "Complete activities to improve your wellbeing.",
    },
    "/profile": {
        title: "Profile",
        description: "Manage your personal information and account settings.",
    },
    "/admin/dashboard": {
        title: "Dashboard",
        description: "Overview of the Aura platform",
    },
    "/admin/users": {
        title: "Users",
        description: "Manage all registered users on the platform.",
    },
    "/admin/journals": {
        title: "Journal Entries",
        description: "View and manage user journal entries.",
    },
    "/admin/side-quests": {
        title: "Side Quests",
        description: "Manage available side quests and activities.",
    },
    "/admin/statistics": {
        title: "Statistics",
        description: "Monitor platform statistics and analytics.",
    },
    "/admin/profile": {
        title: "Profile",
        description: "Manage administrator account information.",
    },
};

function getRouteIntroduction(pathname) {
    if (routeIntroductionMap[pathname]) {
        return routeIntroductionMap[pathname];
    }

    const sortedPaths = Object.keys(routeIntroductionMap).sort(
        (a, b) => b.length - a.length
    );

    const matchedPath = sortedPaths.find((routePath) =>
        pathname.startsWith(routePath)
    );

    return matchedPath ? routeIntroductionMap[matchedPath] : null;
}

export default function PageIntroduction({ actions }) {
    const { pathname } = useLocation();
    const { meta } = usePageMeta();
    const routeIntro = getRouteIntroduction(pathname);

    const title = meta.title ?? routeIntro?.title ?? "";
    const description = meta.description ?? routeIntro?.description ?? "";
    const pageActions = actions;

    if (!title) {
        return null;
    }

    return (
        <section className="mt-6 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    {description && (
                        <p className="mt-1 text-sm text-slate-500 max-w-3xl">{description}</p>
                    )}
                </div>
                {pageActions && (
                    <div
                        className="pt-2 sm:pt-0"
                    >
                        {pageActions}
                    </div>
                )}
            </div>
        </section>
    );
}
