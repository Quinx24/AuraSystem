import ProfileHeader from "../components/profile/ProfileHeader"
import ProfileCard from "../components/profile/ProfileCard";
import StatisticsCard from "../components/profile/StatisticsCard";
import JournalOverview from "../components/profile/JournalOverview";
import RecentJournalCard from "../components/profile/RecentJournalCard";

export default function ProfilePage() {

    return (

        <div className="space-y-8">

            <ProfileHeader />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">

                <div className="min-w-0 xl:col-span-4">

                    <ProfileCard />

                </div>

                <div className="min-w-0 space-y-8 xl:col-span-8">

                    <StatisticsCard />

                    <RecentJournalCard />

                </div>

            </div>

            <JournalOverview />

        </div>

    );

}
