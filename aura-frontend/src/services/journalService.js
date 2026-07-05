import axiosInstance from "../api/axiosInstance";

export const createJournalEntry = async (entryData) => {
    return axiosInstance.post("/journal-entries", entryData);
}

export const getJournalEntries = async (
    page = 0,
    size = 100
) => {
    return axiosInstance.get(
        `/journal-entries?page=${page}&size=${size}`
    );
};

export const getJournalEntryById = async (entryId) => {
    return axiosInstance.get(`/journal-entries/${entryId}`);
}