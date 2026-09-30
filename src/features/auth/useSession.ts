import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

// Context lives here so SessionProvider.tsx only exports a component (keeps Fast Refresh working).
export interface ISessionContext {
  session: Session | null;
  isLoading: boolean;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const useSession = (): ISessionContext => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }

  return context;
};
