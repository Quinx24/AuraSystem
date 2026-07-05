import ProfileHeader from "../components/profile/ProfileHeader"

import ProfileCard from "../components/profile/ProfileCard";

import StatisticsCard from "../components/profile/StatisticsCard";

import JournalOverview from "../components/profile/JournalOverview";

import RecentJournalCard from "../components/profile/RecentJournalCard";

export default function ProfilePage() {

    return (

        <div className="space-y-6">

            <ProfileHeader />

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-4">

                    <ProfileCard />

                </div>

                <div className="col-span-8 space-y-6">

                    <StatisticsCard />

                    <RecentJournalCard />

                </div>

            </div>

            <JournalOverview />

        </div>

    );

}