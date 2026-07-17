import MoodSummaryCard from "../components/journal/MoodSummaryCard";
import JournalStatsCard from "../components/journal/JournalStatsCard";
import EmotionDetails from "../components/journal/EmotionDetails";
import JournalCard from "../components/journal/JournalCard";
import CompletedQuestCard from "../components/journal/CompletedQuestCard";
import JournalHistoryHeader from "../components/journal/JournalHistoryHeader";
import EmotionChartCard from "../components/journal/EmotionChartCard";
import MemoryCard from "../components/journal/MemoryCard";
import NoteCard from "../components/journal/NoteCard";
import RelatedCard from "../components/journal/RelatedCard";
import { getJournalEntryById, deleteJournalEntry } from "../services/journalService";
import { getCurrentUser } from "../services/userService";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SquarePen, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function JournalHistoryPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [journal, setJournal] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpeningEdit, setIsOpeningEdit] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchJournal = async () => {
            try {
                setLoading(true);
                setError(null);

                const [journalResponse, userResponse] = await Promise.all([
                    getJournalEntryById(id),
                    getCurrentUser(),
                ]);

                if (!isMounted) return;

                setJournal(journalResponse.data.result);
                setCurrentUser(userResponse.data.result);
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchJournal();
        }

        return () => {
            isMounted = false;
        };
    }, [id, location.state?.refreshAt]);

    if (loading) {
        return <div className="p-8">Loading journal...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    if (!journal) {
        return <div className="p-8">Journal not found</div>;
    }

    const completedQuests = journal.sideQuests
        ?.filter(q => q.completed)
        ?.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            completedAt: q.completedDate ? new Date(q.completedDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
        })) || [];

    const journalOwnerId = journal.user?.id ?? journal.userId ?? journal.ownerId;
    const canModify =
        currentUser?.role === "ADMIN" ||
        (journalOwnerId !== undefined && currentUser?.id === journalOwnerId) ||
        (journalOwnerId === undefined && Boolean(currentUser?.id));
    const isActionProcessing = isDeleting || isOpeningEdit;

    const handleEdit = () => {
        if (isActionProcessing) return;
        setIsOpeningEdit(true);
        navigate(`/journal-history/${id}/edit`);
    };

    const handleDeleteClick = () => {
        if (isActionProcessing) return;
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            await deleteJournalEntry(id);
            toast.success("Journal deleted successfully.");
            navigate("/journal");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete journal.");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleBackToCalendar = () => {
        navigate("/calendar-tracker");
    };

    const wordCount =
        journal.journalContent.trim().split(/\s+/).length;

    const characterCount =
        journal.journalContent.length;

    const readingTime =
        Math.max(1, Math.ceil(wordCount / 200));

    const stats = {

        wordCount,

        characterCount,

        readingTime,

        createdAt: journal.createdAt,

        updatedAt: journal.updatedAt

    };

    const sortedEmotions =
        [...journal.emotions]
            .sort((a, b) => b.score - a.score);

    const top3Emotions =
        sortedEmotions.slice(0, 3);

    const top5Emotions =
        sortedEmotions.slice(0, 5);

    return (

        <div className="space-y-8">

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleBackToCalendar}
                    className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Calendar</span>
                </button>

                {canModify && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleEdit}
                            disabled={isActionProcessing}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SquarePen size={18} />
                            <span>Edit</span>
                        </button>

                        <button
                            onClick={handleDeleteClick}
                            disabled={isActionProcessing}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>

            <JournalHistoryHeader

                createdAt={journal.createdAt}

            />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">

                {/* LEFT */}

                <div className="min-w-0 space-y-8 xl:col-span-9">

                    {/* Journal + Memory */}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">

                        <div className="min-w-0 lg:col-span-6">

                            <JournalCard
                                journal={journal}
                            />

                        </div>

                        <div className="min-w-0 space-y-6 lg:col-span-3">

                            <MemoryCard
                                memoryPhoto={journal.memoryPhoto}
                                mode="view"
                            />

                            <NoteCard
                                note={journal.noteToSelf}
                                mode="view"
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">

                        <div className="min-w-0 lg:col-span-3">

                            <EmotionChartCard
                                emotions={journal.emotions}
                            />

                        </div>

                        <div className="min-w-0 lg:col-span-3">

                            <CompletedQuestCard
                                quests={completedQuests}
                            />

                        </div>

                    </div>

                    <EmotionDetails
                        emotions={top5Emotions}
                    />

                </div>

                {/* RIGHT */}

                <div className="min-w-0 space-y-8 xl:col-span-3">

                    <MoodSummaryCard
                        emotion={journal.primaryEmotion}
                        confidence={journal.confidence}
                        emotions={top3Emotions}
                    />

                    <RelatedCard />

                    <JournalStatsCard
                        stats={stats}
                    />

                </div>

            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Journal?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to permanently delete this journal?
                            <br />
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}
