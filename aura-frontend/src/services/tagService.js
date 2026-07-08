import axiosInstance from "../api/axiosInstance";

export const getAllTags = () => {

    return axiosInstance.get("/tags");

};