
import { useState } from 'react';
import { SearchParams } from "@/types/motorcycle";

export const useSearchParamsStore = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    year: '',
    make: '',
    model: '',
    vin: ''
  });

  const [years] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  });

  return {
    searchParams,
    setSearchParams,
    years
  };
};
