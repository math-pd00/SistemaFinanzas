import { skipToken, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/useSession';
import { supabase } from '@/lib/supabase';

// .single() turns zero or several memberships into an error instead of silently picking one.
export const useHousehold = () => {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['household', userId],
    queryFn:
      userId === undefined
        ? skipToken
        : async () => {
            const { data, error } = await supabase
              .from('household_members')
              .select('household_id')
              .eq('user_id', userId)
              .single();
            if (error) {
              throw error;
            }

            return data.household_id;
          },
  });
};
