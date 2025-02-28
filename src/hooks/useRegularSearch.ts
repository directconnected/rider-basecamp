
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';

type SearchParams = {
  keyword: string;
  type?: string;
  state?: string;
};

export const useRegularSearch = (
  setIsLoading: (isLoading: boolean) => void,
  setSearchResults: (results: CampgroundResult[]) => void
) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    type: '',
    state: '',
  });

  const handleSearch = async () => {
    if (!searchParams.keyword && !searchParams.type && !searchParams.state) {
      toast.error('Please enter at least one search parameter');
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

    try {
      let query = supabase
        .from('campgrounds')
        .select('*');

      // Apply filters
      if (searchParams.keyword) {
        query = query.or(`name.ilike.%${searchParams.keyword}%,address.ilike.%${searchParams.keyword}%`);
      }

      if (searchParams.type) {
        query = query.eq('type', searchParams.type);
      }

      if (searchParams.state) {
        query = query.eq('state', searchParams.state);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching campgrounds:', error);
        toast.error('Failed to search campgrounds');
        return;
      }

      if (data && data.length > 0) {
        setSearchResults(data as CampgroundResult[]);
        toast.success(`Found ${data.length} campgrounds`);
      } else {
        toast.info('No campgrounds found matching your search criteria');
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { searchParams, setSearchParams, handleSearch };
};
