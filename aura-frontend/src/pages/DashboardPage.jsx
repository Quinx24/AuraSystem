import TodayMoodCard from "../components/dashboard/TodayMoodCard";
import MoodSummaryChart from "../components/dashboard/MoodSummaryChart";
import CalendarPreview from "../components/dashboard/CalendarPreview";
import SideQuestPreview from "../components/dashboard/SideQuestPreview";

export default function DashboardPage() {

    return (

        <div className="space-y-8">
            <div>

                <h1
                    className="
                        text-4xl
                        font-bold
                        text-slate-900
                    "
                >
                    Good Evening 👋
                </h1>

                <p
                    className="
                        text-gray-500
                        mt-2
                    "
                >
                    Welcome back. Let's check your emotional journey today.
                </p>

            </div>

            <div
                className="
                    grid
                    grid-cols-12
                    gap-6
                "
            >
                <div className="col-span-4">

                    <TodayMoodCard />

                </div>

                <div className="col-span-8">

                    <MoodSummaryChart />

                </div>

                <div className="col-span-7">

                    <CalendarPreview />

                </div>

                <div className="col-span-5">

                    <SideQuestPreview />

                </div>
            </div>
        </div>

    );

}