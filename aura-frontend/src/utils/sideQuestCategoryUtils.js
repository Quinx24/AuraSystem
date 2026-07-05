import {
    Heart,
    Dumbbell,
    Users,
    Brain,
    Target,
    Palette,
    Activity
} from "lucide-react";

export const categoryConfig = {
    SELF_CARE: {
        icon: Heart,
        label: "Self_care",
        bg: "bg-pink-100",
        text: "text-pink-600"
    },
    EXERCISE: {
        icon: Dumbbell,
        label: "Exercise",
        bg: "bg-orange-100",
        text: "text-orange-600"
    },
    SOCIAL: {
        icon: Users,
        label: "Social",
        bg: "bg-blue-100",
        text: "text-blue-600"
    },
    MINDFULNESS: {
        icon: Brain,
        label: "Mindfulness",
        bg: "bg-purple-100",
        text: "text-purple-600"
    },
    PRODUCTIVITY: {
        icon: Target,
        label: "Productivity",
        bg: "bg-emerald-100",
        text: "text-emerald-600"
    },
    CREATIVITY: {
        icon: Palette,
        label: "Creativity",
        bg: "bg-yellow-100",
        text: "text-yellow-600"
    },
    HEALTH: {
        icon: Activity,
        label: "Health",
        bg: "bg-red-100",
        text: "text-red-600"
    }
};