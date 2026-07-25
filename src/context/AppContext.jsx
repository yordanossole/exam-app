import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Mock user and stats — replace with real API data when auth is re-enabled
const MOCK_USER = {
  display_name: 'Test User',
  role: 'Free',
  avatar_url: null,
  active_subscription: null,
};

const MOCK_STATS = {
  // Fields used by HomeScreen streak strip
  streak: 0,
  points: 0,
  accuracy: 0,
  // Fields used by TopicStatsPage
  overall_accuracy: 0,
  subject_stats: [],
};

const initialState = {
  isAuthenticated: true,
  user: MOCK_USER,
  stats: MOCK_STATS,
  recentActivity: [],
  subjectProgress: [],
  currentSession: null, // { examId, subjectId, currentIndex, answers: {qId: optionId}, submitted: bool, questions: [] }
  isOffline: !navigator.onLine,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, stats: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'START_EXAM':
      return {
        ...state,
        currentSession: {
          examId: action.payload.examId,
          subjectId: action.payload.subjectId,
          questions: action.payload.questions || [],
          currentIndex: 0,
          answers: {},
          submitted: false,
          startTime: new Date().toISOString(),
        },
      };
    case 'SET_ANSWER':
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          answers: {
            ...state.currentSession.answers,
            [action.payload.questionId]: {
              option: action.payload.optionId,
              isCorrect: action.payload.isCorrect,
              timeSpent: action.payload.timeSpent
            }
          },
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
        currentSession: {
          ...state.currentSession,
          submitted: true,
          endTime: new Date().toISOString()
        },
      };
    case 'END_EXAM':
      return { ...state, currentSession: null };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Online/offline detection (auth disabled — using mock user)
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_OFFLINE', payload: false });
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
