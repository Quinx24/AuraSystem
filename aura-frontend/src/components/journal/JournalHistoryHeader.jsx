import { formatDate } from "../../utils/dateUtils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";

export default function JournalHistoryHeader({ createdAt }) {
    const navigate = useNavigate();
    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Journal History", breadcrumb: ["Home", "Journal History"] });
        return () => setPage({});
    }, [createdAt]);

    return (
        <div className="mb-6">
            <div className="mb-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-700 hover:text-violet-600 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Calendar</span>
                </button>
            </div>

            {/* Title is provided by shared Header via PageMeta */}
        </div>
    );
}
