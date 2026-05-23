import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, userApi } from '../services/api';

const AppContext = createContext();

const STORAGE_KEY = 'exam-app-state';

const initialState = {
  isAuthenticated: !!localStorage.getItem('auth_token'),
  user: null, // From backend
  stats: null, // From backend
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

  // Initialize Telegram & Auth
  useEffect(() => {
    const initTelegram = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();

        const initData = tg.initData;
        if (initData) {
          try {
            const res = await authApi.loginWithTelegram(initData);
            localStorage.setItem('auth_token', res.data.access_token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
            fetchProfile();
          } catch (err) {
            console.error('Telegram Login Failed', err);
          }
        }
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        dispatch({ type: 'SET_USER', payload: res.data });
        const statsRes = await userApi.getStats();
        dispatch({ type: 'SET_STATS', payload: statsRes.data });
      } catch (err) {
        console.error('Fetch Profile Failed', err);
      }
    };

    initTelegram();

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
