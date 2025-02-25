
import { create } from "zustand";

interface CampsiteSearchParams {
  state: string;
  city: string;
  zipCode: string;
  radius?: number;
}

interface CampsiteSearchStore {
  searchParams: CampsiteSearchParams;
  setSearchParams: (params: Partial<CampsiteSearchParams>) => void;
}

export const useCampsiteSearchStore = create<CampsiteSearchStore>((set) => ({
  searchParams: {
    state: "",
    city: "",
    zipCode: "",
    radius: 25,
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
}));
