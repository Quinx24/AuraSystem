import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import { getUsers } from "../services/userService";

const PAGE_SIZE = 10;
const tableColumns = ["Name", "Email", "Role", "Status", "Joined"];
const skeletonRows = Array.from({ length: 5 });

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
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

    useEffect(() => {
        setPage({ title: "Users", breadcrumb: ["Admin", "Users"] });
        return () => setPage({});
        // Page meta follows the existing admin page pattern; setPage is not stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    }, [currentPage, debouncedSearch, role, locked]);

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
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-50 last:border-0"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {user.fullName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.email || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.role || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    user.locked
                                                        ? "bg-red-50 text-red-500"
                                                        : "bg-emerald-50 text-emerald-500"
                                                }`}
                                            >
                                                {user.locked
                                                    ? "Locked"
                                                    : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(user.createdAt)}
                                        </td>
                                    </tr>
                                ))
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
        </div>
    );
}
