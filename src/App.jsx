import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import SurveyPage from './pages/SurveyPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import AuthPage from './pages/AuthPage';
import KakaoRedirect from './pages/KakaoRedirect';
import SupportDetail from './pages/SupportDetail';
import LocationChangePage from "./pages/LocationChangePage.jsx";
<<<<<<< HEAD
import ChatbotPage from "./pages/ChatbotPage.jsx";
import ChatbotMaltu from "./pages/ChatbotMaltu.jsx";
import ChatbotColor from "./pages/ChatbotColor.jsx";
import ToneList from "./components/ToneList.jsx";
=======
import ChatbotPage from './pages/ChatbotPage.jsx';
>>>>>>> dev

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
<<<<<<< HEAD
        <Route path="chatbotMaltu" element={<ChatbotMaltu />} />
        <Route path="chatbotColor" element={<ChatbotColor />} />
        <Route path="tone-list" element={<ToneList />} />

=======
        <Route path="chatbot" element={<ChatbotPage />} />
>>>>>>> dev
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
