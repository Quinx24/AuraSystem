import axiosInstance from "../api/axiosInstance";

export const getSideQuestByEmotion = async (emotion) => {
    return axiosInstance.get(`/side-quests/emotion/${emotion}`);
};

export const addSideQuest = async (sideQuestId) => {
    return axiosInstance.post(
        "/user-side-quests",
        {
            sideQuestId,
        }
    );
};

export const removeSideQuest = async (sideQuestId) => {
    return axiosInstance.delete(`/user-side-quests/my-quests/${sideQuestId}`);
};

export const getTodayQuest = async () => {
    return axiosInstance.get("/user-side-quests/today");
};

export const completeQuest = async (id) => {
    return axiosInstance.patch(
        `/user-side-quests/${id}/complete`
    );
};

export const getCompletedQuest = async () => {
    return axiosInstance.get("/user-side-quests/completed");
};
