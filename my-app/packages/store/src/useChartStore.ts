import { create } from "zustand";

type ChartStore = {
  timeRange: string;
  setTimeRange: (range: string) => void;
};

export const useChartStore = create<ChartStore>((set) => ({
  timeRange: "90d", 
  setTimeRange: (range) => set({ timeRange: range }),
}));
