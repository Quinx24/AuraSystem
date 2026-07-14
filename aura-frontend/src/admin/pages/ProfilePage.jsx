import { Mail, Pencil, Shield, X } from "lucide-react";
import PageIntroduction from "../../components/PageIntroduction";
import { useEffect, useState } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import { getCurrentProfile, updateProfile } from "../services/profileService";

export default function ProfilePage() {
    const { setPage } = usePageMeta();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: "", avatarUrl: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setPage({ title: "Profile", breadcrumb: ["Admin", "Profile"] });
        return () => setPage({});
    }, [setPage]);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCurrentProfile(abortController.signal);
                setProfile(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError("Failed to load profile. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            abortController.abort();
        };
    }, []);

    const handleEditClick = () => {
        setEditForm({
            fullName: profile.fullName,
            avatarUrl: profile.avatarUrl || ""
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        const abortController = new AbortController();
        try {
            setSaving(true);
            const updated = await updateProfile(editForm, abortController.signal);
            setProfile(updated);
            setIsEditing(false);
        } catch (err) {
            if (err.name !== "AbortError") {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleLabel = (role) => {
        const roleLabels = {
            ADMIN: "Administrator",
            USER: "User"
        };
        return roleLabels[role] || role;
    };

    if (loading) {
        return (
            <div>
                <PageIntroduction />
                <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-violet-100/50">
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                        <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageIntroduction />
                <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8">
                    <p className="text-center text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div>
                <PageIntroduction />
                <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-violet-100/50">
                    <p className="text-center text-slate-500">No profile data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageIntroduction />

            <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-violet-100/50">
                <div className="flex flex-col items-center text-center">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-3xl font-bold text-white">
                            {getInitials(profile.fullName)}
                        </div>
                    )}

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        {profile.fullName}
                    </h2>

                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                        <Shield size={12} />
                        {getRoleLabel(profile.role)}
                    </span>

                    <div className="mt-6 flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <Mail className="shrink-0 text-slate-400" size={18} />
                        <span className="text-sm text-slate-600">
                            {profile.email}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleEditClick}
                        className="mt-6 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-6 py-2.5 text-sm font-semibold text-violet-600 transition hover:bg-violet-100"
                    >
                        <Pencil size={16} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-600">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-600">
                                    Avatar URL
                                </label>
                                <input
                                    type="text"
                                    value={editForm.avatarUrl}
                                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="rounded-xl border border-slate-300 px-6 py-2.5 font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-2.5 font-semibold text-white hover:shadow-xl disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
