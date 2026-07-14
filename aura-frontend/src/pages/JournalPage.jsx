import { useEffect, useRef, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createJournalEntry, getJournalEntries } from "../services/journalService";
import { getRandomPrompts } from "../services/inspirationPromptService";
import { getStreak } from "../services/streakService";
import JournalEditor from "../components/journal/JournalEditor";
import MemoryCard from "../components/journal/MemoryCard";
import NoteCard from "../components/journal/NoteCard";
import RightPanel from "../components/journal/RightPanel";
import TagModal from "../components/journal/TagModal";
import TagSection from "../components/journal/TagSection";
import PageIntroduction from "../components/PageIntroduction";
import { getAllTags } from "../services/tagService";
import { usePageMeta } from "../contexts/PageMetaContext";

const MAX_SELECTED_TAGS = 10;
const PROMPT_LIMIT = 3;

export default function JournalPage() {
    const navigate = useNavigate();
    const [journalContent, setJournalContent] = useState("");
    const [noteToSelf, setNoteToSelf] = useState("");
    const [showTagModal, setShowTagModal] = useState(false);
    const [searchTag, setSearchTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadingPrompt, setLoadingPrompt] = useState(true);
    const [memoryPhotoPreview, setMemoryPhotoPreview] = useState(null);
    const [activePrompts, setActivePrompts] = useState([]);
    const memoryPhotoFileRef = useRef(null);
    const memoryPhotoPreviewRef = useRef(null);
    const isSavingRef = useRef(false);
    const promptRequestIdRef = useRef(0);

    const handleSelectTag = (tag = "") => {
        const normalizedTag = String(tag).trim();
        if (!normalizedTag) return;

        setSelectedTags((currentTags) => {
            const hasDuplicate = currentTags.some(
                (currentTag) => currentTag.toLowerCase() === normalizedTag.toLowerCase()
            );
            if (hasDuplicate) {
                toast.error("This tag is already selected.");
                return currentTags;
            }
            if (currentTags.length >= MAX_SELECTED_TAGS) {
                toast.error(`You can add up to ${MAX_SELECTED_TAGS} tags.`);
                return currentTags;
            }
            return [...currentTags, normalizedTag];
        });
    };

    const handleRemoveTag = (tagToRemove) =>
        setSelectedTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (memoryPhotoPreviewRef.current) URL.revokeObjectURL(memoryPhotoPreviewRef.current);

        const nextPreview = URL.createObjectURL(file);
        memoryPhotoFileRef.current = file;
        memoryPhotoPreviewRef.current = nextPreview;
        setMemoryPhotoPreview(nextPreview);
        e.target.value = "";
    };

    const clearMemoryPhoto = () => {
        if (memoryPhotoPreviewRef.current) URL.revokeObjectURL(memoryPhotoPreviewRef.current);
        memoryPhotoPreviewRef.current = null;
        memoryPhotoFileRef.current = null;
        setMemoryPhotoPreview(null);
    };

    useEffect(() => {
        let isMounted = true;

        Promise.allSettled([getAllTags(), getJournalEntries(), getStreak()])
            .then(([tagsResult, journalsResult, streakResult]) => {
                if (!isMounted) return;

                if (tagsResult.status === "fulfilled") {
                    const loadedTags = tagsResult.value.data?.result;
                    setSuggestedTags(Array.isArray(loadedTags) ? loadedTags.filter((tag) => tag?.name) : []);
                } else {
                    setSuggestedTags([]);
                }

                const failedRequest = [tagsResult, journalsResult, streakResult]
                    .find((result) => result.status === "rejected");
                if (failedRequest) {
                    toast.error(failedRequest.reason?.response?.data?.message ?? "Failed to load journal data.");
                }
            })
            .finally(() => {
                if (isMounted) setIsInitialLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({
            title: "Emotion Journal",
            description: "Write down today's thoughts and emotions.",
            breadcrumb: ["Home", "Emotion Journal"],
        });

        return () => setPage({});
    }, [setPage]);

    useEffect(() => () => {
        if (memoryPhotoPreviewRef.current) URL.revokeObjectURL(memoryPhotoPreviewRef.current);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const requestId = promptRequestIdRef.current + 1;
        promptRequestIdRef.current = requestId;

        getRandomPrompts(PROMPT_LIMIT)
            .then((response) => {
                if (isMounted && promptRequestIdRef.current === requestId) {
                    setActivePrompts(response.data?.result ?? []);
                }
            })
            .catch((error) => {
                if (isMounted && promptRequestIdRef.current === requestId) {
                    toast.error(error.response?.data?.message ?? "Failed to load inspiration prompt.");
                }
            })
            .finally(() => {
                if (isMounted && promptRequestIdRef.current === requestId) {
                    setLoadingPrompt(false);
                }
            });

        return () => { isMounted = false; };
    }, []);

    const handleRefreshPrompt = async () => {
        const requestId = promptRequestIdRef.current + 1;
        promptRequestIdRef.current = requestId;

        try {
            setLoadingPrompt(true);
            setActivePrompts([]);

            const response = await getRandomPrompts(PROMPT_LIMIT);

            if (promptRequestIdRef.current === requestId) {
                setActivePrompts(response.data?.result ?? []);
            }
        } catch (error) {
            if (promptRequestIdRef.current === requestId) {
                toast.error(error.response?.data?.message ?? "Failed to load inspiration prompt.");
            }
        } finally {
            if (promptRequestIdRef.current === requestId) {
                setLoadingPrompt(false);
            }
        }
    };

    const resetJournalForm = () => {
        setJournalContent(""); setNoteToSelf(""); setSelectedTags([]); setSearchTag("");
        clearMemoryPhoto();
    };

    const handleSaveJournal = async () => {
        if (isSavingRef.current) return;
        if (!journalContent.trim()) {
            toast.error("Journal content cannot be empty.");
            return;
        }

        try {
            isSavingRef.current = true;
            setIsSaving(true);

            const response = await createJournalEntry({ journalContent, noteToSelf, tags: selectedTags, memoryPhoto: memoryPhotoPreview });
            const journalId = response.data?.result?.id;

            if (journalId === null || journalId === undefined) {
                toast.error("Journal saved, but emotion analysis could not be opened.");
                return;
            }

            await getStreak();
            resetJournalForm();
            navigate(`/emotion-analysis/${journalId}`);
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Failed to save journal entry. Please try again.");
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="w-full pb-6 md:pb-8 xl:pb-10">
                <PageIntroduction
                    actions={
                        <button
                            onClick={handleSaveJournal}
                            disabled={isSaving || isInitialLoading}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-violet-700 hover:to-violet-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none shadow-md shadow-violet-200"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? "Analyzing Emotion..." : "Save Entry"}
                        </button>
                    }
                />
                <div className="mb-8">
                    {/* set page meta for header */}
                    {/* actions are re-set when isSaving/isInitialLoading changes */}
                </div>

                {isInitialLoading ? (
                    <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-violet-100 bg-white text-violet-600 shadow-sm md:min-h-[540px] xl:min-h-[620px]">
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                        <div className="min-w-0 space-y-8 xl:col-span-9">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
                                <div className="min-w-0 lg:col-span-6">
                                    <JournalEditor journalContent={journalContent} setJournalContent={setJournalContent} />
                                </div>

                                <div className="min-w-0 space-y-6 lg:col-span-3">
                                    <MemoryCard memoryPhoto={memoryPhotoPreview} mode="edit" onPhotoChange={handlePhotoChange} />
                                    <NoteCard note={noteToSelf} mode="edit" onChange={setNoteToSelf} />
                                </div>
                            </div>

                            <TagSection selectedTags={selectedTags} onRemoveTag={handleRemoveTag} onOpenModal={() => setShowTagModal(true)} />
                        </div>

                        <RightPanel currentPrompts={activePrompts} loadingPrompt={loadingPrompt} onRefresh={handleRefreshPrompt} />
                    </div>
                )}
            </div>

            {showTagModal && (
                <TagModal searchTag={searchTag} setSearchTag={setSearchTag} suggestedTags={suggestedTags} selectedTags={selectedTags} handleSelectTag={handleSelectTag} handleRemoveTag={handleRemoveTag} onClose={() => setShowTagModal(false)} onSave={() => setShowTagModal(false)} />
            )}
        </>
    );
}
