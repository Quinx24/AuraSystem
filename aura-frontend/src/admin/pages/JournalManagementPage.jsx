import { Calendar, Eye, Filter, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import { emotionConfig } from "../../utils/emotionUtils";
import {
    deleteJournalEntry,
    getJournalEntries,
} from "../services/journalService";

const PAGE_SIZE = 10;
const tableColumns = ["User", "Journal", "Emotion", "Date", "Actions"];
const skeletonRows = Array.from({ length: 5 });
const emotionOptions = [
    "HAPPY",
    "SAD",
    "ANGRY",
    "STRESS",
    "ANXIETY",
    "NEUTRAL",
    "EXCITED",
];

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

function truncateText(value, maxLength = 90) {
    if (!value) {
        return "No content";
    }

    return value.length > maxLength
        ? `${value.slice(0, maxLength).trim()}...`
        : value;
}

function EmotionBadge({ emotion }) {
    const config = emotionConfig[emotion];

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                config ? `${config.bg} ${config.text}` : "bg-slate-50 text-slate-500"
            }`}
        >
            {config?.label || emotion || "N/A"}
        </span>
    );
}

function UserAvatar({ journal, size = "h-10 w-10" }) {
    return (
        <div
            className={`${size} flex shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600`}
        >
            {getInitials(journal?.userFullName, journal?.userEmail)}
        </div>
    );
}

function DialogShell({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-violet-100/60">
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

function TagList({ tags }) {
    const normalizedTags = Array.isArray(tags) ? tags : [];

    if (normalizedTags.length === 0) {
        return <span className="text-sm text-slate-400">No tags</span>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {normalizedTags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

export default function JournalManagementPage() {
    const { setPage } = usePageMeta();
    const [journals, setJournals] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: PAGE_SIZE,
        totalPages: 0,
        totalElements: 0,
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [emotion, setEmotion] = useState("");
    const [date, setDate] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setPage({
            title: "Journal Entries",
            breadcrumb: ["Admin", "Journal Entries"],
        });
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

        async function loadJournals() {
            const params = {
                page: currentPage,
                size: PAGE_SIZE,
            };

            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            if (emotion) {
                params.emotion = emotion;
            }

            if (date) {
                params.date = date;
            }

            try {
                setLoading(true);
                setError("");
                const data = await getJournalEntries(params, controller.signal);

                if (isMounted) {
                    setJournals(data.journals);
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
                            "Unable to load journal entries."
                    );
                    setJournals([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadJournals();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPage, debouncedSearch, emotion, date, refreshKey]);

    const visiblePages = useMemo(
        () => buildVisiblePages(pageInfo.page, pageInfo.totalPages),
        [pageInfo.page, pageInfo.totalPages]
    );

    const hasJournals = journals.length > 0;
    const isPreviousDisabled = loading || pageInfo.page <= 0;
    const isNextDisabled =
        loading ||
        pageInfo.totalPages <= 0 ||
        pageInfo.page >= pageInfo.totalPages - 1;

    function closeDialog() {
        if (deleteLoadingId) {
            return;
        }

        setDialogMode(null);
        setSelectedJournal(null);
    }

    function openViewDialog(journal) {
        setSelectedJournal(journal);
        setDialogMode("view");
    }

    function openDeleteDialog(journal) {
        setSelectedJournal(journal);
        setDialogMode("delete");
    }

    async function handleDeleteJournal() {
        if (!selectedJournal) {
            return;
        }

        try {
            setError("");
            setDeleteLoadingId(selectedJournal.id);
            await deleteJournalEntry(selectedJournal.id);
            setDialogMode(null);
            setSelectedJournal(null);
            setJournals((currentJournals) =>
                currentJournals.filter((journal) => journal.id !== selectedJournal.id)
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
                    "Unable to delete journal entry."
            );
        } finally {
            setDeleteLoadingId(null);
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
                        placeholder="Search journals..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                        <Filter size={16} />
                        <select
                            value={emotion}
                            onChange={(event) => {
                                setCurrentPage(0);
                                setEmotion(event.target.value);
                            }}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                            aria-label="Filter journals by emotion"
                        >
                            <option value="">Emotion</option>
                            {emotionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {emotionConfig[option]?.label || option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                        <Calendar size={16} />
                        <input
                            type="date"
                            value={date}
                            onChange={(event) => {
                                setCurrentPage(0);
                                setDate(event.target.value);
                            }}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                            aria-label="Filter journals by date"
                        />
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
                            ) : hasJournals ? (
                                journals.map((journal) => (
                                    <tr
                                        key={journal.id}
                                        className="border-b border-slate-50 last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex min-w-48 items-center gap-3">
                                                <UserAvatar journal={journal} />
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-slate-800">
                                                        {journal.userFullName || "N/A"}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-400">
                                                        {journal.userEmail || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="max-w-sm px-6 py-4 text-slate-600">
                                            {truncateText(journal.journalContent)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <EmotionBadge
                                                emotion={journal.primaryEmotion}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(journal.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openViewDialog(journal)
                                                    }
                                                    className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-violet-600"
                                                    aria-label="View journal"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={
                                                        deleteLoadingId ===
                                                        journal.id
                                                    }
                                                    onClick={() =>
                                                        openDeleteDialog(journal)
                                                    }
                                                    className="rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Delete journal"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-6 py-10 text-center text-sm font-medium text-slate-400"
                                    >
                                        No journal entries found.
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
                    {pageInfo.totalElements} journal entries total
                </p>
            )}

            {dialogMode === "view" && selectedJournal && (
                <DialogShell title="Journal Details" onClose={closeDialog}>
                    <div className="flex items-center gap-4">
                        <UserAvatar journal={selectedJournal} size="h-16 w-16" />
                        <div className="min-w-0">
                            <h4 className="truncate text-lg font-bold text-slate-900">
                                {selectedJournal.userFullName || "N/A"}
                            </h4>
                            <p className="truncate text-sm text-slate-500">
                                {selectedJournal.userEmail || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailItem label="Emotion">
                            <EmotionBadge emotion={selectedJournal.primaryEmotion} />
                        </DetailItem>
                        <DetailItem label="Created">
                            {formatDate(selectedJournal.createdAt)}
                        </DetailItem>
                        <DetailItem label="Confidence">
                            {selectedJournal.confidence ?? "N/A"}
                        </DetailItem>
                        <DetailItem label="Tags">
                            <TagList tags={selectedJournal.tags} />
                        </DetailItem>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                        <p className="mb-2 text-xs font-semibold text-slate-400">
                            Journal Content
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {selectedJournal.journalContent || "No content"}
                        </p>
                    </div>
                </DialogShell>
            )}

            {dialogMode === "delete" && selectedJournal && (
                <DialogShell title="Delete Journal" onClose={closeDialog}>
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete this journal entry from{" "}
                        <span className="font-semibold text-slate-900">
                            {selectedJournal.userFullName ||
                                selectedJournal.userEmail ||
                                "this user"}
                        </span>
                        ?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDialog}
                            disabled={Boolean(deleteLoadingId)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteJournal}
                            disabled={Boolean(deleteLoadingId)}
                            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-100 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deleteLoadingId ? "Deleting..." : "Delete"}
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
