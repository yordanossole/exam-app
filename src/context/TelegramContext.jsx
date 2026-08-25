'use client';

import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  expandViewport,
  init,
  isTMA,
  mainButton,
  miniAppReady,
  mountBackButton,
  mountMainButton,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
  onBackButtonClick,
  onMainButtonClick,
  restoreInitData,
  retrieveRawInitData,
  requestFullscreen,
  isFullscreen,
  setMainButtonParams,
  showBackButton,
  hideBackButton,
  isThemeParamsDark,
  unmountBackButton,
  unmountMiniApp,
  unmountThemeParams,
  unmountViewport,
  viewportContentSafeAreaInsets,
  viewportHeight,
  viewportSafeAreaInsets,
} from '@telegram-apps/sdk-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from './AppContext';

const TelegramContext = createContext(null);

function valueFromSafeCall(result) {
  return result?.[0] ? result[1] : undefined;
}

function telegramParentRoute(pathname) {
  if (pathname === '/payment') return '/upgrade';
  if (['/settings', '/notifications', '/help', '/upgrade'].includes(pathname)) return '/profile';
  if (pathname === '/practice/results' || pathname.startsWith('/practice/exam/')) return '/practice';

  const subjectMatch = pathname.match(/^\/practice\/grade\/([^/]+)\/subject\//);
  if (subjectMatch) return `/practice/grade/${subjectMatch[1]}`;
  if (/^\/practice\/grade\/[^/]+$/.test(pathname)) return '/practice';

  if (pathname.startsWith('/subjects/')) return '/subjects';
  return '/';
}

export function TelegramProvider({ children }) {
  const { dispatch } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const [isTelegram, setIsTelegram] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle');
  const [authError, setAuthError] = useState('');
  const [telegramTheme, setTelegramTheme] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let inTelegram;
    try {
      inTelegram = isTMA();
    } catch {
      // Normal browser visits do not contain Telegram launch parameters.
      return undefined;
    }
    if (!inTelegram) return undefined;

    let active = true;
    const root = document.documentElement;
    const cleanupSdk = init();
    const cleanups = [];

    setIsTelegram(true);
    root.dataset.telegramMiniApp = 'true';
    root.style.setProperty('--app-viewport-height', `${window.innerHeight}px`);

    // Restore launch data only after SDK initialization; it remains untrusted
    // until /api/auth/telegram verifies its signature.
    restoreInitData();
    mountThemeParamsSync.ifAvailable();
    mountMiniAppSync.ifAvailable();
    mountBackButton.ifAvailable();

    const unbindTheme = valueFromSafeCall(bindThemeParamsCssVars.ifAvailable());
    const unbindMiniApp = valueFromSafeCall(bindMiniAppCssVars.ifAvailable());
    if (unbindTheme) cleanups.push(unbindTheme);
    if (unbindMiniApp) cleanups.push(unbindMiniApp);

    const applyTelegramTheme = () => {
      const nextTheme = isThemeParamsDark() ? 'dark' : 'light';
      root.dataset.telegramTheme = nextTheme;
      setTelegramTheme(nextTheme);
    };
    applyTelegramTheme();
    cleanups.push(isThemeParamsDark.sub(applyTelegramTheme));

    // These correspond to Telegram.WebApp.ready() and expand(). Calling them
    // early removes Telegram's loader and requests the largest available view.
    miniAppReady.ifAvailable();
    expandViewport.ifAvailable();
    setIsReady(true);

    const viewportMountPromise = valueFromSafeCall(mountViewport.ifAvailable());
    viewportMountPromise?.then(() => {
      if (!active) return;
      const unbindViewport = valueFromSafeCall(bindViewportCssVars.ifAvailable());
      if (unbindViewport) cleanups.push(unbindViewport);

      // viewportHeight is a reactive SDK signal. Updating this app-level token
      // makes existing layouts respond as the Telegram sheet is resized.
      const syncViewportHeight = () => {
        root.style.setProperty('--app-viewport-height', `${viewportHeight()}px`);
      };
      syncViewportHeight();
      cleanups.push(viewportHeight.sub(syncViewportHeight));

      // Some Android Telegram versions expose the inset values through SDK
      // events before/without injecting Telegram's CSS variables. Mirror the
      // reactive signals into stable app tokens and use the larger of device
      // and Telegram-content insets—never their sum—to avoid both overlap and
      // an unnecessarily large top gap.
      const syncSafeAreas = () => {
        const safe = viewportSafeAreaInsets();
        const content = viewportContentSafeAreaInsets();
        for (const side of ['top', 'right', 'bottom', 'left']) {
          root.style.setProperty(`--app-safe-area-${side}`, `${safe[side]}px`);
          root.style.setProperty(`--app-content-safe-area-${side}`, `${Math.max(safe[side], content[side])}px`);
        }
      };
      syncSafeAreas();
      cleanups.push(viewportSafeAreaInsets.sub(syncSafeAreas));
      cleanups.push(viewportContentSafeAreaInsets.sub(syncSafeAreas));
      expandViewport.ifAvailable();

      // Bot API 8.0+: expand() only maximizes the sheet, while this requests
      // true edge-to-edge display underneath the device status bar. Calling it
      // for every mount keeps bot/menu/direct-link launches consistent.
      const syncFullscreenState = () => {
        root.dataset.telegramFullscreen = String(isFullscreen());
      };
      syncFullscreenState();
      cleanups.push(isFullscreen.sub(syncFullscreenState));
      const fullscreenPromise = valueFromSafeCall(requestFullscreen.ifAvailable());
      fullscreenPromise?.catch(() => {
        // Telegram clients before 8.0 continue in expanded, non-fullscreen mode.
      });
    }).catch(() => {
      // Older clients still get a useful window.innerHeight fallback above.
    });

    const rawInitData = retrieveRawInitData();
    setAuthStatus('authenticating');
    dispatch({ type: 'TELEGRAM_AUTH_START' });

    fetch('/api/auth/telegram', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: rawInitData ?? '' }),
    })
      .then(async response => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Telegram authentication failed.');
        return payload;
      })
      .then(payload => {
        if (!active) return;
        dispatch({ type: 'TELEGRAM_AUTH_SUCCESS', payload: payload.user });
        setAuthStatus('authenticated');
      })
      .catch(error => {
        if (!active) return;
        dispatch({ type: 'TELEGRAM_AUTH_FAILED' });
        setAuthStatus('error');
        setAuthError(error instanceof Error ? error.message : 'Telegram authentication failed.');
      });

    return () => {
      active = false;
      hideBackButton.ifAvailable();
      cleanups.reverse().forEach(cleanup => cleanup());
      unmountBackButton();
      unmountViewport();
      unmountMiniApp();
      unmountThemeParams();
      cleanupSdk();
      delete root.dataset.telegramMiniApp;
      delete root.dataset.telegramTheme;
      delete root.dataset.telegramFullscreen;
      root.style.removeProperty('--app-viewport-height');
      for (const side of ['top', 'right', 'bottom', 'left']) {
        root.style.removeProperty(`--app-safe-area-${side}`);
        root.style.removeProperty(`--app-content-safe-area-${side}`);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isTelegram || !isReady) return undefined;

    const show = pathname !== '/' && !pathname.startsWith('/admin');
    if (!show) {
      hideBackButton.ifAvailable();
      return undefined;
    }

    const handleBack = () => router.replace(telegramParentRoute(pathname));
    showBackButton.ifAvailable();
    const unsubscribe = valueFromSafeCall(onBackButtonClick.ifAvailable(handleBack));

    return () => {
      unsubscribe?.();
      hideBackButton.ifAvailable();
    };
  }, [isReady, isTelegram, pathname, router]);

  return (
    <TelegramContext.Provider value={{ isTelegram, isReady, authStatus, telegramTheme }}>
      {children}
      {isTelegram && authStatus === 'error' && (
        <div className="telegram-auth-error" role="alert">
          Telegram sign-in failed: {authError}
        </div>
      )}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) throw new Error('useTelegram must be used within TelegramProvider');
  return context;
}

/**
 * Drives Telegram's native Main Button from a screen while retaining the
 * regular HTML button for visits in a normal browser.
 */
export function useTelegramMainButton({ text, onClick, disabled = false, loading = false, visible = true }) {
  const { isTelegram, isReady } = useTelegram();
  const callbackRef = useRef(onClick);

  useEffect(() => {
    callbackRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!isTelegram || !isReady || !visible) return undefined;

    mountMainButton.ifAvailable();
    setMainButtonParams.ifAvailable({
      text,
      isVisible: true,
      isEnabled: !disabled,
      isLoaderVisible: loading,
    });
    const unsubscribe = valueFromSafeCall(onMainButtonClick.ifAvailable(() => callbackRef.current?.()));

    return () => {
      unsubscribe?.();
      if (mainButton.isMounted()) setMainButtonParams.ifAvailable({ isVisible: false });
    };
  }, [disabled, isReady, isTelegram, loading, text, visible]);

  return isTelegram && isReady && visible;
}
