'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { userApi } from '../services/api';

const AppContext = createContext();

const initialState = {
  isAuthenticated: true,
  user: {
    display_name: 'Test User',
    role: 'Paid',
    avatar_url: null,
    active_subscription: {
      status: 'active',
      grade: 6,
    },
  },
  currentSession: null, // { examId, subjectId, currentIndex, answers: {qId: optionId}, submitted: bool, questions: [] }
  isOffline: false,
  authSource: 'browser',
  authStatus: 'authenticated',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'TELEGRAM_AUTH_START':
      return { ...state, isAuthenticated: false, user: null, authSource: 'telegram', authStatus: 'authenticating' };
    case 'TELEGRAM_AUTH_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload, authSource: 'telegram', authStatus: 'authenticated' };
    case 'TELEGRAM_AUTH_FAILED':
      return { ...state, isAuthenticated: false, user: null, authSource: 'telegram', authStatus: 'error' };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_USER':
      // A legacy token response must never replace a server-verified Telegram identity.
      if (state.authSource === 'telegram') return state;
      return { ...state, user: action.payload };
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

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_OFFLINE', payload: false });
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true });

    dispatch({ type: 'SET_OFFLINE', payload: !navigator.onLine });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) return undefined;

    let active = true;
    userApi.getProfile()
      .then(profile => {
        if (active) {
          dispatch({ type: 'SET_USER', payload: profile.data?.data ?? profile.data });
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
