import axiosInstance from "./axiosInstance";

export const getAllSideQuests = async () => {

    const response = await axiosInstance.get(
        "/side-quests"
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