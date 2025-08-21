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
import ChatbotColor from "./pages/chatbot/ChatbotColor.jsx";
import ToneList from "./components/ToneList.jsx";
import ConsumptionCreatePage from './pages/Consumption/ConsumptionCreatePage.jsx';
import GoalCreatePage from './pages/goal/GoalCreatePage';
import ConsumptionEditPage from './pages/Consumption/ConsumptionEditPage.jsx';
import GoalEditPage from './pages/goal/GoalEditPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="survey" element={<SurveyPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<KakaoRedirect/>} />
        <Route path="/support-detail" element={<SupportDetail />} />
        <Route path="location-change" element={<LocationChangePage />} />
        <Route path="chatbotMaltu" element={<ChatbotMaltu />} />
        <Route path="chatbotColor" element={<ChatbotColor />} />
        <Route path="tone-list" element={<ToneList />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="consumption/create" element={<ConsumptionCreatePage />} />
        <Route path="consumption/edit/:id" element={<ConsumptionEditPage />} />
        <Route path="/goal/create" element={<GoalCreatePage />} />
        <Route path="/goal/edit/:id" element={<GoalEditPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
