import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlanItem {
  id: string;
  name: string;
  category: string;
}

interface PlanState {
  // 아이템 배열
  planItems: PlanItem[];
  // 배열 통째로 바꿀 때
  setPlanItems: (items: PlanItem[]) => void;
  // 아이템 하나 추가할 때
  addPlanItem: (item: PlanItem) => void;
}

const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      planItems: [],
      setPlanItems: (items) => set({ planItems: items }),
      addPlanItem: (item) =>
        set((state) => ({ planItems: [...state.planItems, item] })),
    }),
    {
      name: "plan-storage",
    },
  ),
);

export default usePlanStore;
