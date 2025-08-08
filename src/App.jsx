import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import SurveyPage from './pages/SurveyPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';

export default function App() {
  return (
    <Routes>
      {/* 기본 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 페이지들 */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/support" element={<SupportPage />} />

      {/* 잘못된 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
