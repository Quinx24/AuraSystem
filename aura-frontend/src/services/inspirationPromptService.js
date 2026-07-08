import axiosInstance from "../api/axiosInstance";

const getRandomPromptWithParams = (params = {}) => {
    return axiosInstance.get("/inspiration-prompts/random", {
        params
    });
};

const getRandomPromptsWithParams = (params = {}) => {
    return axiosInstance.get("/inspiration-prompts/random-list", {
        params
    });
};

export const getRandomPrompt = (previousPromptId) => {
    return getRandomPromptWithParams({
        previousPromptId
    });
};

export const getRandomPromptByEmotion = (
    emotion,
    previousPromptId
) => {
    return getRandomPromptWithParams({
        emotion,
        previousPromptId
    });
};

export const getRandomPrompts = (limit = 3) => {
    return getRandomPromptsWithParams({
        limit
    });
};

export const getRandomPromptsByEmotion = (
    emotion,
    limit = 3
) => {
    return getRandomPromptsWithParams({
        emotion,
        limit
    });
};
