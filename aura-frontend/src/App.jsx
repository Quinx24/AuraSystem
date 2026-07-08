import { Routes, Route } from "react-router-dom";

import AdminRoutes from "./admin/AdminRoutes";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import EmotionAnalysisPage from "./pages/EmotionAnalysisPage";
import JournalHistoryPage from "./pages/JournalHistoryPage";
import CalendarTrackerPage from "./pages/CalendarTrackerPage";
import SideQuestPage from "./pages/SideQuestPage";
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Routes>

      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Không có Sidebar */}
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Có Sidebar */}
      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/journal"
          element={<JournalPage />}
        />

        <Route
          path="/emotion-analysis/:id"
          element={<EmotionAnalysisPage />}
        />

        <Route
          path="/journal-history/:id"
          element={<JournalHistoryPage />}
        />

        <Route
          path="/calendar"
          element={<CalendarTrackerPage />}
        />

        <Route
          path="/quests"
          element={<SideQuestPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

      </Route>

    </Routes>
  );
}

export default App;