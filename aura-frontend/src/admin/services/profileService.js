import axiosInstance from "../../api/axiosInstance";

function normalizeProfile(profile) {
    return {
        id: profile.id ?? null,
        fullName: profile.fullName ?? "",
        email: profile.email ?? "",
        avatarUrl: profile.avatarUrl ?? null,
        role: profile.role ?? "USER",
        level: profile.level ?? 1,
        xp: profile.xp ?? 0,
        createdAt: profile.createdAt ?? null,
    };
}

function unwrapResult(response) {
    if (!response.data || response.data.result == null) {
        throw new Error("Invalid profile response.");
    }

    return response.data.result;
}

export async function getCurrentProfile(signal) {
    const response = await axiosInstance.get("/users/me", { signal });

    return normalizeProfile(unwrapResult(response));
}

export async function updateProfile(data, signal) {
    const response = await axiosInstance.put("/users/me", data, { signal });

    return normalizeProfile(unwrapResult(response));
}
