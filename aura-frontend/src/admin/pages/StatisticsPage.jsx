import { BookOpen, Smile, Target, Users } from "lucide-react";
import StatCard from "../components/StatCard";
import ChartPlaceholder from "../components/ChartPlaceholder";
import PageHeader from "../components/PageHeader";

export default function StatisticsPage() {
    return (
        <div>
            <PageHeader
                title="Statistics"
                description="Platform analytics and insights"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} label="Total Users" value="—" />
                <StatCard icon={BookOpen} label="Total Journals" value="—" />
                <StatCard icon={Target} label="Quests Completed" value="—" />
                <StatCard icon={Smile} label="Avg. Mood Score" value="—" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartPlaceholder title="User Growth" />
                <ChartPlaceholder title="Emotion Trends" />
            </div>
        </div>
    );
}
