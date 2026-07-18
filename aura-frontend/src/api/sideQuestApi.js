import axiosInstance from "./axiosInstance";

export const getAllSideQuests = async (filters = {}) => {

    const params = {};

    if (filters.mood && filters.mood !== "All") {
        params.mood = filters.mood;
    }

    if (filters.category && filters.category !== "All") {
        params.category = filters.category;
    }

    if (filters.sort && filters.sort !== "newest") {
        params.sort = filters.sort;
    }

    const response = await axiosInstance.get(
        "/side-quests",
        { params }
    );

    return response.data.result;
};

export const getSideQuestByEmotion = async (
    emotion
) => {

    const response = await axiosInstance.get(
        `/side-quests/emotion/${emotion}`
    );

    return response.data.result;
};

export const getRecommendedSideQuests = async ({ emotion, limit = 3 } = {}) => {

    const params = { limit };

    if (emotion && emotion !== "All") {
        params.emotion = emotion;
    }

    const response = await axiosInstance.get(
        "/side-quests/recommendations",
        { params }
    );

    return response.data.result;
};
