import axiosInstance from "../../api/axiosInstance";

function normalizeDashboard(dashboard) {
    return {
        totalUsers: dashboard.totalUsers ?? 0,
        totalJournals: dashboard.totalJournals ?? 0,
        totalSideQuests: dashboard.totalSideQuests ?? 0,
        averageMood: dashboard.averageMood || "N/A",
        journalsToday: dashboard.journalsToday ?? 0,
        newUsersThisWeek: dashboard.newUsersThisWeek ?? 0,
        newJournalsThisWeek: dashboard.newJournalsThisWeek ?? 0,
        topEmotion: dashboard.topEmotion || "N/A",
        recentActivities: Array.isArray(dashboard.recentActivities)
            ? dashboard.recentActivities
            : [],
    };
}

export async function getDashboard(signal) {
    const response = await axiosInstance.get("/admin/dashboard", { signal });

    if (!response.data || response.data.result == null) {
        throw new Error("Invalid dashboard response.");
    }

    return normalizeDashboard(response.data.result);
}
