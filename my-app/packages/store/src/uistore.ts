import { create } from "zustand";

export type Todo = {
  id: number;
  text: string;
  description: string;

  status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";

  startAt: string;
  endAt: string;
};


type UIStore = {
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  editTodo: Todo | null;
  setEditTodo: (todo: Todo) => void;
  clearEditTodo: () => void;


  expandedId: number | null;
  setExpandedId: (id: number | null) => void;

  confirm: {
    open: boolean;
    action: "add" | "edit" | "delete" | null;
    payload?: any;
  };

  openConfirm: (
    action: "add" | "edit" | "delete",
    payload?: any
  ) => void;

  closeConfirm: () => void;


  descOpen: boolean;
  activeTodo: Todo | null;

  openDesc: (todo: Todo) => void;
  closeDesc: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  

  sheetOpen: false,

  openSheet: () => set({ sheetOpen: true }),

  closeSheet: () => set({ sheetOpen: false }),

  

  editTodo: null,

  setEditTodo: (todo) =>
    set({
      editTodo: { ...todo },
      sheetOpen: true,
    }),

clearEditTodo: () =>
  set({
    editTodo: null,
    sheetOpen: false, // ✅ reset sheet also
  }),
  

  expandedId: null,

  setExpandedId: (id) =>
    set({ expandedId: id }),



  confirm: {
    open: false,
    action: null,
    payload: null,
  },

  openConfirm: (action, payload) =>
    set({
      confirm: {
        open: true,
        action,
        payload,
      },
    }),

  closeConfirm: () =>
    set({
      confirm: {
        open: false,
        action: null,
        payload: null,
      },
    }),


  descOpen: false,

  activeTodo: null,

  openDesc: (todo) =>
    set({
      descOpen: true,
      activeTodo: todo,
    }),

  closeDesc: () =>
    set({
      descOpen: false,
      activeTodo: null,
    }),
}));
