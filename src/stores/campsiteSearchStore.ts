
import { create } from "zustand";

interface CampsiteSearchParams {
  state: string;
}

interface CampsiteSearchStore {
  searchParams: CampsiteSearchParams;
  setSearchParams: (params: Partial<CampsiteSearchParams>) => void;
}

export const useCampsiteSearchStore = create<CampsiteSearchStore>((set) => ({
  searchParams: {
    state: "",
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
}));
