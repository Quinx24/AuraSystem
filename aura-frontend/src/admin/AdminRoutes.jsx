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
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="journals" element={<JournalManagementPage />} />
                <Route path="side-quests" element={<SideQuestManagementPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    );
}
