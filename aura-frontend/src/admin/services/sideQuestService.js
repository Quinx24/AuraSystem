import axiosInstance from "../../api/axiosInstance";

function normalizeSideQuestPage(page) {
    return {
        sideQuests: Array.isArray(page.content) ? page.content : [],
        page: page.number ?? 0,
        size: page.size ?? 10,
        totalPages: page.totalPages ?? 0,
        totalElements: page.totalElements ?? 0,
    };
}

function unwrapResult(response) {
    if (!response.data || response.data.result == null) {
        throw new Error("Invalid side quest response.");
    }

    return response.data.result;
}

export async function getSideQuests(params = {}, signal) {
    const response = await axiosInstance.get("/admin/side-quests", {
        params,
        signal,
    });

    return normalizeSideQuestPage(unwrapResult(response));
}

export async function getSideQuest(id, signal) {
    const response = await axiosInstance.get(`/admin/side-quests/${id}`, {
        signal,
    });

    return unwrapResult(response);
}

export async function createSideQuest(data) {
    const response = await axiosInstance.post("/admin/side-quests", data);

    return unwrapResult(response);
}

export async function updateSideQuest(id, data) {
    const response = await axiosInstance.put(`/admin/side-quests/${id}`, data);

    return unwrapResult(response);
}

export async function deleteSideQuest(id) {
    await axiosInstance.delete(`/admin/side-quests/${id}`);
}

export async function publishSideQuest(id) {
    const response = await axiosInstance.patch(`/admin/side-quests/${id}/publish`);

    return unwrapResult(response);
}

export async function unpublishSideQuest(id) {
    const response = await axiosInstance.patch(
        `/admin/side-quests/${id}/unpublish`
    );

    return unwrapResult(response);
}
