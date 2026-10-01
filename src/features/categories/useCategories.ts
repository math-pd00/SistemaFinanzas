import { skipToken, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Enums } from '@/types/database.types';

export interface ICategory {
  id: string;
  name: string;
  type: Enums<'category_type'>;
}

export const useCategories = (householdId: string | undefined) =>
  useQuery({
    queryKey: ['categories', householdId],
    queryFn:
      householdId === undefined
        ? skipToken
        : async (): Promise<ICategory[]> => {
            const { data, error } = await supabase
              .from('categories')
              .select('id, name, type')
              .eq('household_id', householdId)
              .eq('is_active', true)
              .order('name');
            if (error) {
              throw error;
            }

            return data;
          },
  });
