import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import SurveyPage from './pages/SurveyPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="survey" element={<SurveyPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}