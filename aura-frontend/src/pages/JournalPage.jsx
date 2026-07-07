import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";

import {
    Plus,
    X,
    Save,
    Loader2,
    Camera,
    Upload
} from "lucide-react"

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { getJournalEntries } from "../services/journalService";
import { createJournalEntry } from "../services/journalService";
import { getStreak } from "../services/streakService";
import MemoryCard from "../components/journal/MemoryCard";
import NoteCard from "../components/journal/NoteCard";
import { suggestedTags } from "../utils/tagData";
import TagModal from "../components/journal/TagModal";

export default function JournalPage() {

    const [journalContent, setJournalContent] = useState("");
    const [noteToSelf, setNoteToSelf] = useState("");

    const [showTagModal, setShowTagModal] = useState(false);
    const [searchTag, setSearchTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSelectTag = (tag) => {

        if (selectedTags.includes(tag)) {
            return;
        }

        setSelectedTags([
            ...selectedTags,
            tag
        ]);

    };

    const [tags, setTags] = useState(["happy", "study", "growth"]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [memoryPhoto, setMemoryPhoto] = useState(null);
    const [journals, setJournals] = useState([]);

    const [streak, setStreak] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIn: 0
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setMemoryPhoto(URL.createObjectURL(file));
        }
    };

    const loadJournals = async () => {
        try {
            const response = await getJournalEntries();
            console.log("Journal Entries:", response.data);
            setJournals(response.data.result.content);
        } catch (error) {
            console.error("Error fetching journal entries:", error);
        }
    };

    const loadStreak = async () => {
        try {

            const data = await getStreak();

            setStreak(data);

        } catch (error) {

            console.error("Error fetching streak:", error);

        }
    };

    useEffect(() => {
        loadJournals();

        loadStreak();
    }, []);

    console.log("Journals state:", journals);

    const questions = [
        "What made you smile today?",
        "What did you learn today?",
        "What are you grateful for?",
        "What do you want to improve tomorrow?"
    ];

    const handleSaveJournal = async () => {
        if (!journalContent.trim()) {
            alert("Journal content cannot be empty");
            return;
        }

        try {
            setLoading(true);

            const response = await createJournalEntry({
                journalContent,
                noteToSelf,
                tags,
                memoryPhoto
            });

            await loadStreak();

            const result = response.data;

            console.log(result);

            const journalId = result.result.id;

            navigate(`/emotion-analysis/${journalId}`);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ??
                "Failed to save journal entry. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="px-8 pb-8">
                <div className="flex justify-between items-center mb-7">
                    <div className="-mt-2">
                        <h1 className="text-4xl font-bold text-slate-900">
                            Emotion Journal
                        </h1>

                        <p className="mt-3 text-xl text-slate-500">
                            Write freely. Reflect deepy. Grow mindfully.
                        </p>
                    </div>

                    <button
                        onClick={handleSaveJournal}
                        disabled={loading}
                        className="
                            flex items-center gap-2
                            px-5 py-2.5
                            bg-[#A78BFA]
                            text-white
                            rounded-lg
                            font-medium
                            hover:bg-[#9575F5]
                            transition
                        "
                    >
                        {
                            loading
                                ? <Loader2 size={18} className="animate-spin" />
                                : <Save size={18} />
                        }

                        {
                            loading
                                ? "Analyzing Emotion..."
                                : "Save Entry"
                        }
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* TODAY JOURNAL */}
                    <div className="col-span-6">

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                border
                                border-violet-100
                                p-6
                                shadow-sm
                            "
                        >
                            <h2 className="text-2xl font-semibold mb-6">
                                Today's Journal
                            </h2>

                            <textarea
                                value={journalContent}
                                onChange={(e) =>
                                    setJournalContent(e.target.value)
                                }
                                placeholder="Write about your day..."
                                className="
                                    w-full
                                    h-[500px]
                                    resize-none
                                    outline-none
                                    overflow-y-auto
                                    leading-10
                                    font-serif
                                    text-lg
                                    text-slate-700
                                "
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(transparent, transparent 38px, #E9D5FF 39px)"
                                }}
                            />

                        </div>

                    </div>

                    {/* MEMORY + NOTE */}

                    <div className="col-span-3 space-y-6">

                        <MemoryCard

                            memoryPhoto={memoryPhoto}

                            mode="edit"

                            onPhotoChange={handlePhotoChange}

                        />

                        <NoteCard

                            note={noteToSelf}

                            mode="edit"

                            onChange={setNoteToSelf}

                        />

                    </div>

                    {/* RIGHT PANEL */}
                    <div className="col-span-3 space-y-6">

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                p-6
                                border
                                border-violet-100
                            "
                        >
                            <h3 className="font-semibold mb-4">
                                AI Emotion Analysis
                            </h3>

                            <div className="text-center">
                                😊 Happy
                            </div>
                        </div>

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                p-6
                                border
                                border-violet-100
                            "
                        >
                            <h3 className="font-semibold mb-4">
                                Reflection Questions
                            </h3>

                            <ul className="space-y-3">

                                {questions.map((question) => (

                                    <li key={question}>
                                        • {question}
                                    </li>

                                ))}

                            </ul>
                        </div>

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                p-6
                                border
                                border-violet-100
                            "
                        >
                            <h3 className="font-semibold">
                                Daily Streak
                            </h3>

                            <div className="mt-4">

                                <div className="text-4xl font-bold">
                                    {streak.currentStreak}
                                </div>

                                <div className="text-slate-500">
                                    {streak.currentStreak === 1 ? "day" : "days"}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    <div
                        className="
                        col-span-9
                        bg-white
                        rounded-3xl
                        border
                        border-violet-100
                        p-6
                        shadow-sm
                        mt-5
                    "
                    >

                        <h3 className="font-semibold mb-4 text-lg">
                            Tags
                        </h3>

                        <div className="flex flex-wrap gap-3">

                            {tags.map((tag) => (

                                <div
                                    key={tag}
                                    className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-violet-100
                                    text-violet-700
                                    font-medium
                                "
                                >

                                    <span>
                                        # {tag}
                                    </span>

                                    <X
                                        size={14}
                                        className="
                                        cursor-pointer
                                        hover:text-red-500
                                    "
                                        onClick={() =>
                                            setTags(
                                                tags.filter(
                                                    t => t !== tag
                                                )
                                            )
                                        }
                                    />

                                </div>

                            ))}

                            <button
                                onClick={() =>
                                    setShowTagModal(true)
                                }
                                className="
                                px-5
                                py-2
                                rounded-full
                                border
                                border-violet-200
                                text-violet-600
                                hover:bg-violet-50
                                transition
                            "
                            >
                                + Add Tag
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            {
                showTagModal && (

                    <TagModal

                        searchTag={searchTag}

                        setSearchTag={setSearchTag}

                        suggestedTags={suggestedTags}

                        selectedTags={selectedTags}

                        handleSelectTag={handleSelectTag}
                        
                        onClose={() =>
                            setShowTagModal(false)
                        }

                        onSave={() => {

                        }}

                    />

                )
            }
        </>
    );
}