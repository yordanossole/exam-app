import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Chess.com-style screens
import HomeScreen    from './pages/HomeScreen';
import QuizScreen    from './pages/QuizScreen';
import ResultsScreen from './pages/ResultsScreen';

// Existing functional pages (kept as-is)
import SubjectsPage    from './pages/SubjectsPage';
import ExamListPage    from './pages/ExamListPage';
import ExamPage        from './pages/ExamPage';
import ResultsPage     from './pages/ResultsPage';
import ProfilePage     from './pages/ProfilePage';
import UpgradePage     from './pages/UpgradePage';
import PaymentPage     from './pages/PaymentPage';
import TopicStatsPage  from './pages/TopicStatsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Chess.com-style quiz flow */}
            <Route path="/"                         element={<HomeScreen />} />
            <Route path="/quiz/daily"               element={<QuizScreen />} />
            <Route path="/quiz/category/:categoryId" element={<QuizScreen />} />
            <Route path="/results/:examId"          element={<ResultsScreen />} />

            {/* Existing backend-connected pages */}
            <Route path="/subjects"                 element={<SubjectsPage />} />
            <Route path="/subjects/:subjectId"      element={<ExamListPage />} />
            <Route path="/exam/:examId"             element={<ExamPage />} />
            <Route path="/results-legacy/:examId"   element={<ResultsPage />} />
            <Route path="/profile"                  element={<ProfilePage />} />
            <Route path="/upgrade"                  element={<UpgradePage />} />
            <Route path="/payment"                  element={<PaymentPage />} />
            <Route path="/stats"                    element={<TopicStatsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
