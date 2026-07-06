import axiosInstance from "../api/axiosInstance";

export const getCurrentUser = async () => {
    return axiosInstance.get("/users/me");
};

export const updateCurrentUser = (data) => {
    return axiosInstance.put("/users/me", data);
};

export async function changePassword(data) {

    const response = await axiosInstance.put(
        "/users/change-password",
        data
    );

    return response.data;
}