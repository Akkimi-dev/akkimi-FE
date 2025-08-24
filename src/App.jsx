import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import SurveyPage from './pages/user/SurveyPage';
import SettingsPage from './pages/user/SettingsPage';
import SupportPage from './pages/support/SupportPage';
import AuthPage from './pages/auth/AuthPage';
import KakaoRedirect from './pages/auth/KakaoRedirect';
import SupportDetail from './pages/support/SupportDetail';
import LocationChangePage from "./pages/user/LocationChangePage.jsx";
import ChatbotPage from "./pages/chatbot/ChatbotPage.jsx";
import ChatbotMaltu from "./pages/chatbot/ChatbotMaltu.jsx";
import ToneList from "./pages/chatbot/ToneCreatePage.jsx";
import ConsumptionCreatePage from './pages/consumption/ConsumptionCreatePage.jsx';
import GoalCreatePage from './pages/goal/GoalCreatePage';
import ConsumptionEditPage from './pages/consumption/ConsumptionEditPage.jsx';
import GoalEditPage from './pages/goal/GoalEditPage.jsx';
import ToneDetailPage from "./pages/chatbot/ToneDetailPage";
import UserNamePage from './pages/user/userNamePage.jsx';
import { PublicOnlyRoute, ProtectedRoute } from './router.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route
          path="auth"
          element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/auth/callback" element={<KakaoRedirect />} />
        <Route path="calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="survey" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="support-detail" element={<ProtectedRoute><SupportDetail /></ProtectedRoute>} />
        <Route path="location-change" element={<ProtectedRoute><LocationChangePage /></ProtectedRoute>} />
        <Route path="chatbotMaltu" element={<ProtectedRoute><ChatbotMaltu /></ProtectedRoute>} />
        <Route path="user/userName" element={<ProtectedRoute><UserNamePage /></ProtectedRoute>} />
        <Route path="tone-list" element={<ProtectedRoute><ToneList /></ProtectedRoute>} />
        <Route path="tone/:toneId" element={<ProtectedRoute><ToneDetailPage /></ProtectedRoute>} />
        <Route path="chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="consumption/create/:goalId" element={<ProtectedRoute><ConsumptionCreatePage /></ProtectedRoute>} />
        <Route path="consumption/edit/:id" element={<ProtectedRoute><ConsumptionEditPage /></ProtectedRoute>} />
        <Route path="goal/create" element={<ProtectedRoute><GoalCreatePage /></ProtectedRoute>} />
        <Route path="goal/edit/:id" element={<ProtectedRoute><GoalEditPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
