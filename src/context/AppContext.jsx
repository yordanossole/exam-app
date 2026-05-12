import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'exam-app-state';

const initialState = {
  user: { name: 'Alex Johnson', email: 'alex.johnson@email.com', avatar: 'A' },
  stats: { examsCompleted: 24, avgScore: 87, streak: 12, studyTime: '6h' },
  recentActivity: [
    { id: 1, subject: 'Biology', exam: 'Biology Exam 3', score: 92, time: '2 hours ago', icon: '✓', color: '#e6f4ea' },
    { id: 2, subject: 'History', exam: 'World History Exam 5', score: 85, time: 'yesterday', icon: '📘', color: '#e3f2fd' },
    { id: 3, subject: 'Calculus', exam: 'Calculus Exam 2', score: 78, time: '2 days ago', icon: '📐', color: '#fff3e0' },
  ],
  subjectProgress: [
    { subject: 'Biology', progress: 92 },
    { subject: 'History', progress: 85 },
    { subject: 'Calculus', progress: 78 },
    { subject: 'Literature', progress: 60 },
  ],
  currentSession: null, // { examId, subjectId, currentIndex, answers: {qId: optionId}, submitted: bool }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'START_EXAM':
      return {
        ...state,
        currentSession: {
          examId: action.payload.examId,
          subjectId: action.payload.subjectId,
          currentIndex: 0,
          answers: {},
          submitted: false,
        },
      };
    case 'SET_ANSWER':
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          answers: { ...state.currentSession.answers, [action.payload.questionId]: action.payload.optionId },
        },
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentSession: { ...state.currentSession, currentIndex: state.currentSession.currentIndex + 1 },
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentSession: { ...state.currentSession, currentIndex: Math.max(0, state.currentSession.currentIndex - 1) },
      };
    case 'SUBMIT_EXAM':
      return {
        ...state,
        currentSession: { ...state.currentSession, submitted: true },
      };
    case 'END_EXAM':
      return { ...state, currentSession: null };
    case 'RESTORE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...init, ...JSON.parse(stored) } : init;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentSession: state.currentSession }));
  }, [state.currentSession]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
