import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import EmotionAnalysisPage from "./pages/EmotionAnalysisPage";
import CalendarTrackerPage from "./pages/CalendarTrackerPage";
import SideQuestPage from "./pages/SideQuestPage";
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Routes>

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