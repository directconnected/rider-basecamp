
import { toast } from 'sonner';
import { CampgroundResult } from '@/hooks/camping/types';

type AddressSearchParams = {
  searchParams: {
    city: string;
    state: string;
    zipCode: string;
    radius: number;
  };
  setSearchResults: (results: CampgroundResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
};

export const useAddressSearch = ({
  searchParams,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
}: AddressSearchParams) => {
  
  // Function to handle search based on address
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);

    try {
      // Construct the address string based on provided parameters
      const addressParts = [];
      if (searchParams.city) addressParts.push(searchParams.city);
      if (searchParams.state) addressParts.push(searchParams.state);
      if (searchParams.zipCode) addressParts.push(searchParams.zipCode);
      const addressString = addressParts.join(', ');

      if (!addressString) {
        toast.error('Please enter a city, state, or zip code to search');
        setIsSearching(false);
        return;
      }

      console.log(`Address search: ${addressString}, radius: ${searchParams.radius}mi`);
      
      // Return empty results
      setSearchResults([]);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An unexpected error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  return { handleSearch };
};
