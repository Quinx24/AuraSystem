import { Routes, Route } from "react-router-dom";

import AdminRoutes from "./admin/AdminRoutes";
import MainLayout from "./layouts/MainLayout";
import RouteGuard from "./components/auth/RouteGuard";

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

      <Route path="/admin/*" element={
        <RouteGuard requireAdmin={true}>
          <AdminRoutes />
        </RouteGuard>
      } />

      {/* Không có Sidebar */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Có Sidebar */}
      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={<DashboardPage />}
          handle={{ title: "Dashboard", breadcrumb: ["Home", "Dashboard"] }}
        />

        <Route
          path="/journal"
          element={<JournalPage />}
          handle={{ title: "Emotion Journal", breadcrumb: ["Home", "Emotion Journal"] }}
        />

        <Route
          path="/emotion-analysis/:id"
          element={<EmotionAnalysisPage />}
          handle={{ title: "Emotion Analysis", breadcrumb: ["Home", "Emotion Analysis"] }}
        />

        <Route
          path="/journal-history/:id"
          element={<JournalHistoryPage />}
          handle={{ title: "Journal History", breadcrumb: ["Home", "Journal History"] }}
        />

        <Route
          path="/calendar"
          element={<CalendarTrackerPage />}
          handle={{ title: "Calendar Tracker", breadcrumb: ["Home", "Calendar Tracker"] }}
        />

        <Route
          path="/quests"
          element={<SideQuestPage />}
          handle={{ title: "Side Quests", breadcrumb: ["Home", "Side Quests"] }}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
          handle={{ title: "Profile", breadcrumb: ["Home", "Profile"] }}
        />

      </Route>

    </Routes>
  );
}

export default App;