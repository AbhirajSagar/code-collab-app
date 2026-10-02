'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';

/**
 * Handles client-side initialization delay or asset loading.
 */
export default function ClientLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = process.env.NEXT_PUBLIC_FAKE_LOADING === 'true' ? 2000 : 0;
    const timer = setTimeout(() => setIsLoading(false), delay);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
