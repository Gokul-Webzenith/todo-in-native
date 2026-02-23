import { create } from "zustand";

type TimeStore = {
  showStartDate: boolean;
  showStartTime: boolean;
  showEndDate: boolean;
  showEndTime: boolean;

  openStartDate: () => void;
  closeStartDate: () => void;

  openStartTime: () => void;
  closeStartTime: () => void;

  openEndDate: () => void;
  closeEndDate: () => void;

  openEndTime: () => void;
  closeEndTime: () => void;

  closeAll: () => void;
};

export const useTimeStore = create<TimeStore>((set) => ({
  showStartDate: false,
  showStartTime: false,
  showEndDate: false,
  showEndTime: false,

  closeAll: () =>
    set({
      showStartDate: false,
      showStartTime: false,
      showEndDate: false,
      showEndTime: false,
    }),

  openStartDate: () =>
    set({
      showStartDate: true,
      showStartTime: false,
      showEndDate: false,
      showEndTime: false,
    }),

  closeStartDate: () =>
    set({ showStartDate: false }),

  openStartTime: () =>
    set({
      showStartDate: false,
      showStartTime: true,
      showEndDate: false,
      showEndTime: false,
    }),

  closeStartTime: () =>
    set({ showStartTime: false }),

  openEndDate: () =>
    set({
      showStartDate: false,
      showStartTime: false,
      showEndDate: true,
      showEndTime: false,
    }),

  closeEndDate: () =>
    set({ showEndDate: false }),

  openEndTime: () =>
    set({
      showStartDate: false,
      showStartTime: false,
      showEndDate: false,
      showEndTime: true,
    }),

  closeEndTime: () =>
    set({ showEndTime: false }),
}));