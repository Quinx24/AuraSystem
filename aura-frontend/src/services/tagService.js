import axiosInstance from "../utils/axiosInstance";

export const getAllTags = () => {

    return axiosInstance.get("/tags");

};