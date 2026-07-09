import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import JournalManagementPage from "./pages/JournalManagementPage";
import SideQuestManagementPage from "./pages/SideQuestManagementPage";
import StatisticsPage from "./pages/StatisticsPage";
import ProfilePage from "./pages/ProfilePage";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} handle={{ title: "Dashboard", breadcrumb: ["Admin", "Dashboard"] }} />
                <Route path="users" element={<UsersPage />} handle={{ title: "Users", breadcrumb: ["Admin", "Users"] }} />
                <Route path="journals" element={<JournalManagementPage />} handle={{ title: "Journal Entries", breadcrumb: ["Admin", "Journal Entries"] }} />
                <Route path="side-quests" element={<SideQuestManagementPage />} handle={{ title: "Side Quests", breadcrumb: ["Admin", "Side Quests"] }} />
                <Route path="statistics" element={<StatisticsPage />} handle={{ title: "Statistics", breadcrumb: ["Admin", "Statistics"] }} />
                <Route path="profile" element={<ProfilePage />} handle={{ title: "Profile", breadcrumb: ["Admin", "Profile"] }} />
            </Route>
        </Routes>
    );
}
