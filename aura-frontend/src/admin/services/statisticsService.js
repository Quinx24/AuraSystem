import axiosInstance from "../../api/axiosInstance";

function formatMonthLabel(value) {
    if (!value) {
        return "N/A";
    }

    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatDayLabel(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    }).format(date);
}

function normalizeTimeSeries(items = [], labelFormatter = (label) => label) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map((item) => ({
        label: labelFormatter(item.label),
        value: item.count ?? 0,
    }));
}

function normalizeEmotionDistribution(items = []) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map((item) => ({
        emotion: item.emotion,
        label: item.emotion,
        value: item.count ?? 0,
    }));
}

function sumValues(items) {
    return items.reduce((total, item) => total + (item.value ?? 0), 0);
}

function normalizeStatistics(statistics) {
    const usersByMonth = normalizeTimeSeries(
        statistics.usersByMonth,
        formatMonthLabel
    );
    const journalsByMonth = normalizeTimeSeries(
        statistics.journalsByMonth,
        formatMonthLabel
    );
    const journalsByDay = normalizeTimeSeries(
        statistics.journalsByDay,
        formatDayLabel
    );
    const emotionDistribution = normalizeEmotionDistribution(
        statistics.emotionDistribution
    );

    return {
        overview: {
            totalUsers: sumValues(usersByMonth),
            totalJournals: sumValues(journalsByMonth),
            completedQuests: statistics.completedQuests ?? 0,
            topEmotion: statistics.topEmotion || "N/A",
            activeUsers: statistics.activeUsers ?? 0,
        },
        usersByMonth,
        journalsByMonth,
        journalsByDay,
        emotionDistribution,
        completedQuestChart: [
            {
                label: "Completed",
                value: statistics.completedQuests ?? 0,
            },
        ],
        activeUsers: statistics.activeUsers ?? 0,
        completedQuests: statistics.completedQuests ?? 0,
        topEmotion: statistics.topEmotion || "N/A",
    };
}

export async function getStatistics(signal) {
    const response = await axiosInstance.get("/admin/statistics", { signal });

    if (!response.data || response.data.result == null) {
        throw new Error("Invalid statistics response.");
    }

    return normalizeStatistics(response.data.result);
}
