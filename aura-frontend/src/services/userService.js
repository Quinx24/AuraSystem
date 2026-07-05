import axiosInstance from "../api/axiosInstance";

export const getCurrentUser = async () => {
    return axiosInstance.get("/users/me");
};