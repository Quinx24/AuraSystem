import axiosInstance from "../api/axiosInstance";

export async function uploadImage(file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosInstance.post(
        "/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.result;
}