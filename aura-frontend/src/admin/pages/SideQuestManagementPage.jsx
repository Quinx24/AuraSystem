import {
    Eye,
    Filter,
    Pencil,
    Plus,
    Rocket,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import { emotionConfig } from "../../utils/emotionUtils";
import { categoryConfig } from "../../utils/sideQuestCategoryUtils";
import {
    createSideQuest,
    deleteSideQuest,
    getSideQuests,
    publishSideQuest,
    unpublishSideQuest,
    updateSideQuest,
} from "../services/sideQuestService";

const PAGE_SIZE = 10;
const tableColumns = [
    "Title",
    "Emotion",
    "Category",
    "Difficulty",
    "XP Reward",
    "Status",
    "Actions",
];
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
const categoryOptions = [
    "SELF_CARE",
    "EXERCISE",
    "SOCIAL",
    "MINDFULNESS",
    "PRODUCTIVITY",
    "CREATIVITY",
    "HEALTH",
];
const difficultyOptions = ["EASY", "MEDIUM", "DEEP"];
const emptyForm = {
    title: "",
    description: "",
    emotion: "HAPPY",
    category: "SELF_CARE",
    difficulty: "EASY",
    xpReward: 0,
    published: true,
};

function buildVisiblePages(currentPage, totalPages) {
    if (totalPages <= 0) {
        return [1];
    }

    const current = currentPage + 1;
    const start = Math.max(1, Math.min(current - 1, totalPages - 2));
    const end = Math.min(totalPages, start + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function formatEnumLabel(value) {
    if (!value) {
        return "N/A";
    }

    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function truncateText(value, maxLength = 80) {
    if (!value) {
        return "No description";
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
            {config?.label || formatEnumLabel(emotion)}
        </span>
    );
}

function CategoryBadge({ category }) {
    const config = categoryConfig[category];

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                config ? `${config.bg} ${config.text}` : "bg-slate-50 text-slate-500"
            }`}
        >
            {config?.label?.replace("_", " ") || formatEnumLabel(category)}
        </span>
    );
}

function DifficultyBadge({ difficulty }) {
    const classes = {
        EASY: "bg-emerald-50 text-emerald-600",
        MEDIUM: "bg-yellow-50 text-yellow-600",
        DEEP: "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                classes[difficulty] || "bg-slate-50 text-slate-500"
            }`}
        >
            {formatEnumLabel(difficulty)}
        </span>
    );
}

function StatusBadge({ published }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                published
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-50 text-slate-500"
            }`}
        >
            {published ? "Published" : "Unpublished"}
        </span>
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

function DetailItem({ label, children }) {
    return (
        <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-slate-400">{label}</p>
            <div className="text-sm font-medium text-slate-700">{children}</div>
        </div>
    );
}

export default function SideQuestManagementPage() {
    const { setPage } = usePageMeta();
    const [sideQuests, setSideQuests] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: PAGE_SIZE,
        totalPages: 0,
        totalElements: 0,
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [emotion, setEmotion] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [published, setPublished] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [rowLoading, setRowLoading] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setPage({
            title: "Side Quests",
            breadcrumb: ["Admin", "Side Quests"],
        });

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

        async function loadSideQuests() {
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

            if (category) {
                params.category = category;
            }

            if (difficulty) {
                params.difficulty = difficulty;
            }

            if (published !== "") {
                params.published = published;
            }

            try {
                setLoading(true);
                setError("");
                const data = await getSideQuests(params, controller.signal);

                if (isMounted) {
                    setSideQuests(data.sideQuests);
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
                            "Unable to load side quests."
                    );
                    setSideQuests([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadSideQuests();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [
        currentPage,
        debouncedSearch,
        emotion,
        category,
        difficulty,
        published,
        refreshKey,
    ]);

    const visiblePages = useMemo(
        () => buildVisiblePages(pageInfo.page, pageInfo.totalPages),
        [pageInfo.page, pageInfo.totalPages]
    );

    const hasSideQuests = sideQuests.length > 0;
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
        setSelectedQuest(null);
        setForm(emptyForm);
    }

    function openCreateDialog() {
        setSelectedQuest(null);
        setForm(emptyForm);
        setDialogMode("form");
    }

    function openEditDialog(sideQuest) {
        setSelectedQuest(sideQuest);
        setForm({
            title: sideQuest.title || "",
            description: sideQuest.description || "",
            emotion: sideQuest.emotion || "HAPPY",
            category: sideQuest.category || "SELF_CARE",
            difficulty: sideQuest.difficulty || "EASY",
            xpReward: sideQuest.xpReward ?? 0,
            published: sideQuest.published !== false,
        });
        setDialogMode("form");
    }

    function openViewDialog(sideQuest) {
        setSelectedQuest(sideQuest);
        setDialogMode("view");
    }

    function openDeleteDialog(sideQuest) {
        setSelectedQuest(sideQuest);
        setDialogMode("delete");
    }

    function refetchSideQuests() {
        setRefreshKey((current) => current + 1);
    }

    function replaceSideQuest(updatedSideQuest) {
        setSideQuests((currentQuests) =>
            currentQuests.map((sideQuest) =>
                sideQuest.id === updatedSideQuest.id ? updatedSideQuest : sideQuest
            )
        );
        setSelectedQuest((currentQuest) =>
            currentQuest?.id === updatedSideQuest.id ? updatedSideQuest : currentQuest
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            emotion: form.emotion,
            category: form.category,
            difficulty: form.difficulty,
            xpReward: Number(form.xpReward),
            published: form.published,
        };

        if (!payload.title || !payload.emotion || !payload.category) {
            setError("Please complete all required side quest fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (selectedQuest) {
                await updateSideQuest(selectedQuest.id, payload);
            } else {
                await createSideQuest(payload);
            }

            setDialogMode(null);
            setSelectedQuest(null);
            setForm(emptyForm);
            refetchSideQuests();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to save side quest."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleTogglePublish(sideQuest) {
        const action = sideQuest.published ? "unpublish" : "publish";

        try {
            setError("");
            setRowLoading((current) => ({ ...current, [sideQuest.id]: action }));
            const updatedSideQuest = sideQuest.published
                ? await unpublishSideQuest(sideQuest.id)
                : await publishSideQuest(sideQuest.id);
            replaceSideQuest(updatedSideQuest);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    `Unable to ${action} side quest.`
            );
        } finally {
            setRowLoading((current) => {
                const next = { ...current };
                delete next[sideQuest.id];
                return next;
            });
        }
    }

    async function handleDeleteSideQuest() {
        if (!selectedQuest) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            await deleteSideQuest(selectedQuest.id);
            setDialogMode(null);
            setSelectedQuest(null);
            setForm(emptyForm);
            refetchSideQuests();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete side quest."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <PageIntroduction
                actions={
                    <button
                        type="button"
                        onClick={openCreateDialog}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/60 transition hover:bg-violet-700"
                    >
                        <Plus size={18} />
                        Create Side Quest
                    </button>
                }
            />

            {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-6 flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search side quests..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <FilterSelect
                        icon={<Filter size={16} />}
                        label="Emotion"
                        value={emotion}
                        onChange={setEmotion}
                        options={emotionOptions.map((option) => ({
                            value: option,
                            label: emotionConfig[option]?.label || option,
                        }))}
                        onResetPage={() => setCurrentPage(0)}
                    />
                    <FilterSelect
                        label="Category"
                        value={category}
                        onChange={setCategory}
                        options={categoryOptions.map((option) => ({
                            value: option,
                            label:
                                categoryConfig[option]?.label?.replace("_", " ") ||
                                formatEnumLabel(option),
                        }))}
                        onResetPage={() => setCurrentPage(0)}
                    />
                    <FilterSelect
                        label="Difficulty"
                        value={difficulty}
                        onChange={setDifficulty}
                        options={difficultyOptions.map((option) => ({
                            value: option,
                            label: formatEnumLabel(option),
                        }))}
                        onResetPage={() => setCurrentPage(0)}
                    />
                    <FilterSelect
                        label="Status"
                        value={published}
                        onChange={setPublished}
                        options={[
                            { value: "true", label: "Published" },
                            { value: "false", label: "Unpublished" },
                        ]}
                        onResetPage={() => setCurrentPage(0)}
                    />
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
                            ) : hasSideQuests ? (
                                sideQuests.map((sideQuest) => {
                                    const rowAction = rowLoading[sideQuest.id];

                                    return (
                                        <tr
                                            key={sideQuest.id}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <td className="max-w-xs px-6 py-4">
                                                <p className="font-medium text-slate-800">
                                                    {sideQuest.title || "N/A"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {truncateText(
                                                        sideQuest.description,
                                                        70
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <EmotionBadge
                                                    emotion={sideQuest.emotion}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <CategoryBadge
                                                    category={sideQuest.category}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <DifficultyBadge
                                                    difficulty={
                                                        sideQuest.difficulty
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">
                                                +{sideQuest.xpReward ?? 0} XP
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    published={
                                                        sideQuest.published
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <IconButton
                                                        label="View side quest"
                                                        onClick={() =>
                                                            openViewDialog(
                                                                sideQuest
                                                            )
                                                        }
                                                    >
                                                        <Eye size={15} />
                                                    </IconButton>
                                                    <IconButton
                                                        label="Edit side quest"
                                                        onClick={() =>
                                                            openEditDialog(
                                                                sideQuest
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={15} />
                                                    </IconButton>
                                                    <IconButton
                                                        label={
                                                            sideQuest.published
                                                                ? "Unpublish side quest"
                                                                : "Publish side quest"
                                                        }
                                                        disabled={Boolean(
                                                            rowAction
                                                        )}
                                                        onClick={() =>
                                                            handleTogglePublish(
                                                                sideQuest
                                                            )
                                                        }
                                                    >
                                                        <Rocket size={15} />
                                                    </IconButton>
                                                    <IconButton
                                                        label="Delete side quest"
                                                        danger
                                                        onClick={() =>
                                                            openDeleteDialog(
                                                                sideQuest
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={15} />
                                                    </IconButton>
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
                                        No side quests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                loading={loading}
                pageInfo={pageInfo}
                visiblePages={visiblePages}
                isPreviousDisabled={isPreviousDisabled}
                isNextDisabled={isNextDisabled}
                onPageChange={setCurrentPage}
            />

            {!loading && (
                <p className="mt-3 text-center text-xs text-slate-400">
                    {pageInfo.totalElements} side quests total
                </p>
            )}

            {dialogMode === "view" && selectedQuest && (
                <DialogShell title="Side Quest Details" onClose={closeDialog}>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900">
                            {selectedQuest.title || "N/A"}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {selectedQuest.description || "No description"}
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailItem label="Emotion">
                            <EmotionBadge emotion={selectedQuest.emotion} />
                        </DetailItem>
                        <DetailItem label="Category">
                            <CategoryBadge category={selectedQuest.category} />
                        </DetailItem>
                        <DetailItem label="Difficulty">
                            <DifficultyBadge
                                difficulty={selectedQuest.difficulty}
                            />
                        </DetailItem>
                        <DetailItem label="XP Reward">
                            +{selectedQuest.xpReward ?? 0} XP
                        </DetailItem>
                        <DetailItem label="Status">
                            <StatusBadge published={selectedQuest.published} />
                        </DetailItem>
                    </div>
                </DialogShell>
            )}

            {dialogMode === "form" && (
                <DialogShell
                    title={selectedQuest ? "Edit Side Quest" : "Create Side Quest"}
                    onClose={closeDialog}
                >
                    <SideQuestForm
                        form={form}
                        saving={saving}
                        onChange={setForm}
                        onCancel={closeDialog}
                        onSubmit={handleSubmit}
                    />
                </DialogShell>
            )}

            {dialogMode === "delete" && selectedQuest && (
                <DialogShell title="Delete Side Quest" onClose={closeDialog}>
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-900">
                            {selectedQuest.title || "this side quest"}
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
                            onClick={handleDeleteSideQuest}
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

function FilterSelect({ icon, label, value, options, onChange, onResetPage }) {
    return (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            {icon}
            <select
                value={value}
                onChange={(event) => {
                    onResetPage();
                    onChange(event.target.value);
                }}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                aria-label={`Filter side quests by ${label.toLowerCase()}`}
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function IconButton({ label, children, danger = false, disabled = false, onClick }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`rounded-lg border border-gray-200 bg-white p-2 text-slate-500 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                danger
                    ? "hover:bg-red-50 hover:text-red-500"
                    : "hover:bg-slate-50 hover:text-violet-600"
            }`}
            aria-label={label}
        >
            {children}
        </button>
    );
}

function Pagination({
    loading,
    pageInfo,
    visiblePages,
    isPreviousDisabled,
    isNextDisabled,
    onPageChange,
}) {
    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                type="button"
                disabled={isPreviousDisabled}
                onClick={() => onPageChange((previous) => Math.max(previous - 1, 0))}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Prev
            </button>
            {visiblePages.map((page) => (
                <button
                    key={page}
                    type="button"
                    disabled={loading}
                    onClick={() => onPageChange(page - 1)}
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
                    onPageChange((previous) =>
                        Math.min(previous + 1, pageInfo.totalPages - 1)
                    )
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

function SideQuestForm({ form, saving, onChange, onCancel, onSubmit }) {
    function updateField(field, value) {
        onChange((current) => ({ ...current, [field]: value }));
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                    Title
                </label>
                <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(event) =>
                        updateField("description", event.target.value)
                    }
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormSelect
                    label="Emotion"
                    value={form.emotion}
                    options={emotionOptions.map((option) => ({
                        value: option,
                        label: emotionConfig[option]?.label || option,
                    }))}
                    onChange={(value) => updateField("emotion", value)}
                />
                <FormSelect
                    label="Category"
                    value={form.category}
                    options={categoryOptions.map((option) => ({
                        value: option,
                        label:
                            categoryConfig[option]?.label?.replace("_", " ") ||
                            formatEnumLabel(option),
                    }))}
                    onChange={(value) => updateField("category", value)}
                />
                <FormSelect
                    label="Difficulty"
                    value={form.difficulty}
                    options={difficultyOptions.map((option) => ({
                        value: option,
                        label: formatEnumLabel(option),
                    }))}
                    onChange={(value) => updateField("difficulty", value)}
                />
                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                        XP Reward
                    </label>
                    <input
                        type="number"
                        min="0"
                        required
                        value={form.xpReward}
                        onChange={(event) =>
                            updateField("xpReward", event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </div>
                <FormSelect
                    label="Status"
                    value={String(form.published)}
                    options={[
                        { value: "true", label: "Published" },
                        { value: "false", label: "Unpublished" },
                    ]}
                    onChange={(value) => updateField("published", value === "true")}
                />
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
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
    );
}

function FormSelect({ label, value, options, onChange }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
                {label}
            </label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
