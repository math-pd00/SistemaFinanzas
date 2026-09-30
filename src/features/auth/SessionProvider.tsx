import type { Session } from '@supabase/supabase-js';
import { useEffect, useState, type ReactNode } from 'react';

import { SessionContext } from '@/features/auth/useSession';
import { supabase } from '@/lib/supabase';

// onAuthStateChange emits INITIAL_SESSION on subscribe, so no separate getSession() call is needed.
interface ISessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: ISessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return <SessionContext value={{ session, isLoading }}>{children}</SessionContext>;
};
