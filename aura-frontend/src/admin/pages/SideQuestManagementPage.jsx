import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import TablePlaceholder from "../components/TablePlaceholder";

export default function SideQuestManagementPage() {
    return (
        <div>
            <PageHeader
                title="Side Quests"
                description="Create and manage side quests"
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
