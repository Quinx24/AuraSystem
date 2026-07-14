import {
    Eye,
    Filter,
    Lock,
    Pencil,
    Search,
    Trash2,
    Unlock,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import {
    deleteUser,
    lockUser,
    unlockUser,
    updateUser,
    getUsers,
} from "../services/userService";

const PAGE_SIZE = 10;
const tableColumns = ["Name", "Email", "Role", "Status", "Joined", "Actions"];
const skeletonRows = Array.from({ length: 5 });

const emptyEditForm = {
    fullName: "",
    email: "",
    avatarUrl: "",
    role: "USER",
    locked: false,
};

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function buildVisiblePages(currentPage, totalPages) {
    if (totalPages <= 0) {
        return [1];
    }

    const current = currentPage + 1;
    const start = Math.max(1, Math.min(current - 1, totalPages - 2));
    const end = Math.min(totalPages, start + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getInitials(name, email) {
    const source = name || email || "A";
    const parts = source.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

function RoleBadge({ role }) {
    const isAdmin = role === "ADMIN";

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isAdmin
                    ? "bg-violet-50 text-violet-600"
                    : "bg-sky-50 text-sky-600"
            }`}
        >
            {role || "N/A"}
        </span>
    );
}

function StatusBadge({ locked }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                locked ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
            }`}
        >
            {locked ? "Locked" : "Active"}
        </span>
    );
}

function UserAvatar({ user, size = "h-10 w-10" }) {
    if (user?.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.fullName || "User avatar"}
                className={`${size} rounded-full object-cover`}
            />
        );
    }

    return (
        <div
            className={`${size} flex shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600`}
        >
            {getInitials(user?.fullName, user?.email)}
        </div>
    );
}

function DialogShell({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-violet-100/60">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-slate-900">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function UsersPage() {
    const { setPage } = usePageMeta();
    const [users, setUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: PAGE_SIZE,
        totalPages: 0,
        totalElements: 0,
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [role, setRole] = useState("");
    const [locked, setLocked] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [editForm, setEditForm] = useState(emptyEditForm);
    const [rowLoading, setRowLoading] = useState({});
    const [saving, setSaving] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setPage({ title: "Users", breadcrumb: ["Admin", "Users"] });
        return () => setPage({});
    }, [setPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(0);
            setDebouncedSearch(search.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function loadUsers() {
            const params = {
                page: currentPage,
                size: PAGE_SIZE,
            };

            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            if (role) {
                params.role = role;
            }

            if (locked !== "") {
                params.locked = locked;
            }

            try {
                setLoading(true);
                setError("");
                const data = await getUsers(params, controller.signal);

                if (isMounted) {
                    setUsers(data.users);
                    setPageInfo({
                        page: data.page,
                        size: data.size,
                        totalPages: data.totalPages,
                        totalElements: data.totalElements,
                    });
                }
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    return;
                }

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                            err.message ||
                            "Unable to load users."
                    );
                    setUsers([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPage, debouncedSearch, role, locked, refreshKey]);

    const visiblePages = useMemo(
        () => buildVisiblePages(pageInfo.page, pageInfo.totalPages),
        [pageInfo.page, pageInfo.totalPages]
    );

    const hasUsers = users.length > 0;
    const isPreviousDisabled = loading || pageInfo.page <= 0;
    const isNextDisabled =
        loading ||
        pageInfo.totalPages <= 0 ||
        pageInfo.page >= pageInfo.totalPages - 1;

    function closeDialog() {
        if (saving) {
            return;
        }

        setDialogMode(null);
        setSelectedUser(null);
        setEditForm(emptyEditForm);
    }

    function replaceUser(updatedUser) {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
        setSelectedUser((currentUser) =>
            currentUser?.id === updatedUser.id ? updatedUser : currentUser
        );
    }

    function openViewDialog(user) {
        setSelectedUser(user);
        setDialogMode("view");
    }

    function openEditDialog(user) {
        setSelectedUser(user);
        setEditForm({
            fullName: user.fullName || "",
            email: user.email || "",
            avatarUrl: user.avatarUrl || "",
            role: user.role || "USER",
            locked: Boolean(user.locked),
        });
        setDialogMode("edit");
    }

    function openDeleteDialog(user) {
        setSelectedUser(user);
        setDialogMode("delete");
    }

    async function handleToggleLock(user) {
        const action = user.locked ? "unlock" : "lock";

        try {
            setError("");
            setRowLoading((current) => ({ ...current, [user.id]: action }));
            const updatedUser = user.locked
                ? await unlockUser(user.id)
                : await lockUser(user.id);
            replaceUser(updatedUser);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    `Unable to ${action} user.`
            );
        } finally {
            setRowLoading((current) => {
                const next = { ...current };
                delete next[user.id];
                return next;
            });
        }
    }

    async function handleSaveUser(event) {
        event.preventDefault();

        if (!selectedUser) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            const updatedUser = await updateUser(selectedUser.id, {
                fullName: editForm.fullName.trim(),
                email: editForm.email.trim(),
                avatarUrl: editForm.avatarUrl.trim() || null,
                role: editForm.role,
                locked: editForm.locked,
            });
            replaceUser(updatedUser);
            closeDialog();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to update user."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteUser() {
        if (!selectedUser) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            await deleteUser(selectedUser.id);
            setDialogMode(null);
            setSelectedUser(null);
            setUsers((currentUsers) =>
                currentUsers.filter((user) => user.id !== selectedUser.id)
            );
            setPageInfo((current) => ({
                ...current,
                totalElements: Math.max(current.totalElements - 1, 0),
            }));
            setRefreshKey((current) => current + 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete user."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <PageIntroduction />

            {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search users..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                        <Filter size={16} />
                        <select
                            value={role}
                            onChange={(event) => {
                                setCurrentPage(0);
                                setRole(event.target.value);
                            }}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                            aria-label="Filter users by role"
                        >
                            <option value="">Role</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                        <select
                            value={locked}
                            onChange={(event) => {
                                setCurrentPage(0);
                                setLocked(event.target.value);
                            }}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                            aria-label="Filter users by status"
                        >
                            <option value="">Status</option>
                            <option value="false">Active</option>
                            <option value="true">Locked</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-violet-100/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                {tableColumns.map((column) => (
                                    <th
                                        key={column}
                                        className="px-6 py-4 font-semibold text-slate-600"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                skeletonRows.map((_, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b border-slate-50 last:border-0"
                                    >
                                        {tableColumns.map((column) => (
                                            <td
                                                key={column}
                                                className="px-6 py-4"
                                            >
                                                <div className="h-4 animate-pulse rounded-lg bg-slate-100" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : hasUsers ? (
                                users.map((user) => {
                                    const userAction = rowLoading[user.id];

                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex min-w-48 items-center gap-3">
                                                    <UserAvatar user={user} />
                                                    <span className="font-medium text-slate-800">
                                                        {user.fullName || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {user.email || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge locked={user.locked} />
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openViewDialog(user)
                                                        }
                                                        className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-violet-600"
                                                        aria-label="View user"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditDialog(user)
                                                        }
                                                        className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-violet-600"
                                                        aria-label="Edit user"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={Boolean(userAction)}
                                                        onClick={() =>
                                                            handleToggleLock(user)
                                                        }
                                                        className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={
                                                            user.locked
                                                                ? "Unlock user"
                                                                : "Lock user"
                                                        }
                                                    >
                                                        {user.locked ? (
                                                            <Unlock size={15} />
                                                        ) : (
                                                            <Lock size={15} />
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteDialog(user)
                                                        }
                                                        className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                                                        aria-label="Delete user"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-6 py-10 text-center text-sm font-medium text-slate-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={isPreviousDisabled}
                    onClick={() =>
                        setCurrentPage((previous) => Math.max(previous - 1, 0))
                    }
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Prev
                </button>
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        disabled={loading}
                        onClick={() => setCurrentPage(page - 1)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            pageInfo.page === page - 1
                                ? "bg-violet-600 text-white"
                                : "border border-gray-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={isNextDisabled}
                    onClick={() =>
                        setCurrentPage((previous) =>
                            Math.min(previous + 1, pageInfo.totalPages - 1)
                        )
                    }
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {!loading && (
                <p className="mt-3 text-center text-xs text-slate-400">
                    {pageInfo.totalElements} users total
                </p>
            )}

            {dialogMode === "view" && selectedUser && (
                <DialogShell title="User Details" onClose={closeDialog}>
                    <div className="flex items-center gap-4">
                        <UserAvatar user={selectedUser} size="h-16 w-16" />
                        <div className="min-w-0">
                            <h4 className="truncate text-lg font-bold text-slate-900">
                                {selectedUser.fullName || "N/A"}
                            </h4>
                            <p className="truncate text-sm text-slate-500">
                                {selectedUser.email || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailItem label="Role">
                            <RoleBadge role={selectedUser.role} />
                        </DetailItem>
                        <DetailItem label="Status">
                            <StatusBadge locked={selectedUser.locked} />
                        </DetailItem>
                        <DetailItem label="Level">
                            {selectedUser.level ?? "N/A"}
                        </DetailItem>
                        <DetailItem label="XP">{selectedUser.xp ?? "N/A"}</DetailItem>
                        <DetailItem label="Created">
                            {formatDate(selectedUser.createdAt)}
                        </DetailItem>
                        <DetailItem label="Updated">
                            {formatDate(selectedUser.updatedAt)}
                        </DetailItem>
                    </div>
                </DialogShell>
            )}

            {dialogMode === "edit" && selectedUser && (
                <DialogShell title="Edit User" onClose={closeDialog}>
                    <form onSubmit={handleSaveUser} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-500">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={editForm.fullName}
                                onChange={(event) =>
                                    setEditForm((current) => ({
                                        ...current,
                                        fullName: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-500">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={editForm.email}
                                onChange={(event) =>
                                    setEditForm((current) => ({
                                        ...current,
                                        email: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-500">
                                Avatar URL
                            </label>
                            <input
                                type="text"
                                value={editForm.avatarUrl}
                                onChange={(event) =>
                                    setEditForm((current) => ({
                                        ...current,
                                        avatarUrl: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-500">
                                    Role
                                </label>
                                <select
                                    value={editForm.role}
                                    onChange={(event) =>
                                        setEditForm((current) => ({
                                            ...current,
                                            role: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-500">
                                    Status
                                </label>
                                <select
                                    value={String(editForm.locked)}
                                    onChange={(event) =>
                                        setEditForm((current) => ({
                                            ...current,
                                            locked: event.target.value === "true",
                                        }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                                >
                                    <option value="false">Active</option>
                                    <option value="true">Locked</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={saving}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </DialogShell>
            )}

            {dialogMode === "delete" && selectedUser && (
                <DialogShell title="Delete User" onClose={closeDialog}>
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-900">
                            {selectedUser.fullName || selectedUser.email}
                        </span>
                        ?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDialog}
                            disabled={saving}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteUser}
                            disabled={saving}
                            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-100 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </DialogShell>
            )}
        </div>
    );
}

function DetailItem({ label, children }) {
    return (
        <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-slate-400">{label}</p>
            <div className="text-sm font-medium text-slate-700">{children}</div>
        </div>
    );
}
