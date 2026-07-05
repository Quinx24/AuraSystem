import axiosInstance from "../api/axiosInstance";

export const getLevel = async () => {
    const response = await axiosInstance.get("/level");
    return response.data.result;
};