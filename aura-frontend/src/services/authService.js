import axiosInstance from "../api/axiosInstance";

export const login = async (data) => {
    return axiosInstance.post("/auth/login", data);
};

export const register = async (data) => {
    return axiosInstance.post("/auth/register", data);
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};