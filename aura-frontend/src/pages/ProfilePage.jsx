import { useEffect } from "react";
import { usePageMeta } from "../contexts/PageMetaContext";
import PageIntroduction from "../components/PageIntroduction";
import ProfileCard from "../components/profile/ProfileCard";
import StatisticsCard from "../components/profile/StatisticsCard";
import JournalOverview from "../components/profile/JournalOverview";
import RecentJournalCard from "../components/profile/RecentJournalCard";

export default function ProfilePage() {

    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Profile", breadcrumb: ["Home", "Profile"] });
        return () => setPage({});
    }, [setPage]);

    return (

        <div className="space-y-8">
            <PageIntroduction />

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
