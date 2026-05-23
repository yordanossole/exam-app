import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import ExamListPage from './pages/ExamListPage';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import ProfilePage from './pages/ProfilePage';
import UpgradePage from './pages/UpgradePage';
import PaymentPage from './pages/PaymentPage';
import TopicStatsPage from './pages/TopicStatsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<ExamListPage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/results/:examId" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/stats" element={<TopicStatsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
