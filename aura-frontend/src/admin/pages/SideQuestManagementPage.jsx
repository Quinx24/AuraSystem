import { Plus } from "lucide-react";
import { useEffect } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";
import PageIntroduction from "../../components/PageIntroduction";
import TablePlaceholder from "../components/TablePlaceholder";

export default function SideQuestManagementPage() {
    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({
            title: "Side Quests",
            breadcrumb: ["Admin", "Side Quests"],
        });

        return () => setPage({});
    }, []);

    return (
        <div>
            <PageIntroduction
                actions={
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/60 transition hover:bg-violet-700"
                    >
                        <Plus size={18} />
                        Create Side Quest
                    </button>
                }
            />
            <TablePlaceholder
                columns={["Title", "Category", "Difficulty", "Status"]}
            />
        </div>
    );
}
