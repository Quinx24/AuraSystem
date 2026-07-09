import {
    Activity,
    BookOpen,
    Briefcase,
    Heart,
    HeartHandshake,
    Lightbulb,
    Loader2,
    RefreshCw,
    Sparkles,
    Sun,
    Target
} from "lucide-react";

const CATEGORY_CONFIG = {
    GRATITUDE: {
        icon: Heart,
        iconClass: "bg-pink-100 text-pink-500"
    },
    SELF_REFLECTION: {
        icon: Lightbulb,
        iconClass: "bg-violet-100 text-violet-600"
    },
    GROWTH: {
        icon: Target,
        iconClass: "bg-sky-100 text-sky-500"
    },
    MINDFULNESS: {
        icon: Sun,
        iconClass: "bg-amber-100 text-amber-500"
    },
    RELATIONSHIP: {
        icon: HeartHandshake,
        iconClass: "bg-rose-100 text-rose-500"
    },
    CAREER: {
        icon: Briefcase,
        iconClass: "bg-indigo-100 text-indigo-500"
    },
    STUDY: {
        icon: BookOpen,
        iconClass: "bg-emerald-100 text-emerald-500"
    },
    HEALTH: {
        icon: Activity,
        iconClass: "bg-red-100 text-red-500"
    },
    SELF_CARE: {
        icon: Sparkles,
        iconClass: "bg-violet-100 text-violet-600"
    }
};

const DEFAULT_CATEGORY_CONFIG = {
    icon: Lightbulb,
    iconClass: "bg-violet-100 text-violet-600"
};

export default function InspirationCard({
    currentPrompts,
    loadingPrompt,
    onRefresh
}) {
    const prompts = Array.isArray(currentPrompts)
        ? currentPrompts
        : [currentPrompts].filter(Boolean);

    return (
        <div
            className="
                bg-white
                rounded-2xl
                p-5
                border
                border-violet-100
                shadow-sm
            "
        >
            <div className="flex items-center gap-2">
                <Lightbulb
                    size={18}
                    className="text-amber-400"
                />

                <h3 className="font-semibold text-slate-900">
                    Writing Inspiration
                </h3>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
                Choose a prompt below or refresh to discover new writing inspiration.
            </p>

            <div className="mt-5 space-y-2">
                {loadingPrompt ? (
                    <div
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-3
                            text-sm
                            text-violet-600
                        "
                    >
                        <Loader2 size={18} className="animate-spin" />
                        Loading inspiration...
                    </div>
                ) : (
                    prompts.map((prompt) => {
                        const categoryConfig =
                            CATEGORY_CONFIG[prompt.category] ??
                            DEFAULT_CATEGORY_CONFIG;
                        const PromptIcon = categoryConfig.icon;

                        return (
                            <button
                                key={prompt.id ?? prompt.title}
                                type="button"
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-3
                                    text-left
                                    transition
                                    hover:border-violet-200
                                    hover:bg-violet-50
                                "
                            >
                                <span
                                    className={`
                                        grid
                                        h-10
                                        w-10
                                        shrink-0
                                        place-items-center
                                        rounded-full
                                        ${categoryConfig.iconClass}
                                    `}
                                >
                                    <PromptIcon size={20} />
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold leading-5 text-slate-900">
                                        {prompt.title}
                                    </span>

                                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                                        {prompt.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })
                )}
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loadingPrompt}
                className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-violet-50
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-violet-700
                    transition
                    hover:bg-violet-100
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                "
            >
                <RefreshCw size={16} className={loadingPrompt ? "animate-spin" : ""} />
                Refresh Prompt
            </button>

            <div
                className="
                    mt-4
                    rounded-xl
                    bg-violet-50
                    p-4
                    text-sm
                    leading-6
                    text-slate-600
                "
            >
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Lightbulb
                        size={16}
                        className="text-amber-400"
                    />
                    Tip:
                </div>

                <p className="mt-2">
                    You don't have to write a lot. Just write honestly.
                    Every sentence is a small step toward understanding yourself better.
                </p>
            </div>
        </div>
    );
}
