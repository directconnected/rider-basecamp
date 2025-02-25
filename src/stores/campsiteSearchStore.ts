
import { create } from "zustand";

interface CampsiteSearchParams {
  state: string;
  nforg: string;
  town: string;
}

interface CampsiteSearchStore {
  searchParams: CampsiteSearchParams;
  setSearchParams: (params: Partial<CampsiteSearchParams>) => void;
}

export const useCampsiteSearchStore = create<CampsiteSearchStore>((set) => ({
  searchParams: {
    state: "",
    nforg: "",
    town: "",
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
}));
