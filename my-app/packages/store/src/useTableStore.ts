import { create } from "zustand"

type TableStore = {
  data: any[]
  setData: (data: any[]) => void
}

export const useTableStore = create<TableStore>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}))
