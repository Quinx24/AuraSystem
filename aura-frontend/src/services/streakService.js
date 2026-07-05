import axiosInstance from "../api/axiosInstance";

export const getStreak = async () => {
    const response = await axiosInstance.get("/streak");
    return response.data.result;
};