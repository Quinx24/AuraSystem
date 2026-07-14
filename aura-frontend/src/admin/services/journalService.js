import axiosInstance from "../../api/axiosInstance";

function normalizeJournalPage(page) {
    return {
        journals: Array.isArray(page.content) ? page.content : [],
        page: page.number ?? 0,
        size: page.size ?? 10,
        totalPages: page.totalPages ?? 0,
        totalElements: page.totalElements ?? 0,
    };
}

function unwrapResult(response) {
    if (!response.data || response.data.result == null) {
        throw new Error("Invalid journal response.");
    }

    return response.data.result;
}

export async function getJournalEntries(params = {}, signal) {
    const response = await axiosInstance.get("/admin/journal-entries", {
        params,
        signal,
    });

    return normalizeJournalPage(unwrapResult(response));
}

export async function getJournalEntry(id, signal) {
    const response = await axiosInstance.get(`/admin/journal-entries/${id}`, {
        signal,
    });

    return unwrapResult(response);
}

export async function deleteJournalEntry(id) {
    await axiosInstance.delete(`/admin/journal-entries/${id}`);
}
