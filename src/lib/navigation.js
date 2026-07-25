'use client';

import {
  useParams as useNextParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

function routeStateKey(pathname) {
  return `nt-route-state:${pathname}`;
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (typeof to === 'number') {
      router.back();
      return;
    }

    if (options.state && typeof window !== 'undefined') {
      sessionStorage.setItem(routeStateKey(to), JSON.stringify(options.state));
    }

    if (options.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  const [state, setState] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(window.location.search);

    const stored = sessionStorage.getItem(routeStateKey(pathname));
    if (!stored) {
      setState(null);
      return;
    }

    try {
      setState(JSON.parse(stored));
    } catch {
      setState(null);
    }
  }, [pathname]);

  return useMemo(
    () => ({
      pathname,
      search,
      state,
    }),
    [pathname, search, state]
  );
}

export function useParams() {
  return useNextParams();
}
