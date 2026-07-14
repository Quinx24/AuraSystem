import axiosInstance from "../../api/axiosInstance";

function normalizeUserPage(page) {
    return {
        users: Array.isArray(page.content) ? page.content : [],
        page: page.number ?? 0,
        size: page.size ?? 10,
        totalPages: page.totalPages ?? 0,
        totalElements: page.totalElements ?? 0,
    };
}

function unwrapResult(response) {
    if (!response.data || response.data.result == null) {
        throw new Error("Invalid users response.");
    }

    return response.data.result;
}

export async function getUsers(params = {}, signal) {
    const response = await axiosInstance.get("/admin/users", {
        params,
        signal,
    });

    return normalizeUserPage(unwrapResult(response));
}

export async function getUser(id, signal) {
    const response = await axiosInstance.get(`/admin/users/${id}`, { signal });

    return unwrapResult(response);
}

export async function updateUser(id, data) {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);

    return unwrapResult(response);
}

export async function lockUser(id) {
    const response = await axiosInstance.patch(`/admin/users/${id}/lock`);

    return unwrapResult(response);
}

export async function unlockUser(id) {
    const response = await axiosInstance.patch(`/admin/users/${id}/unlock`);

    return unwrapResult(response);
}

export async function deleteUser(id) {
    await axiosInstance.delete(`/admin/users/${id}`);
}
