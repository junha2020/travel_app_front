import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlanItem {
  id: number;
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
  // 아이템 하나 삭제할 때
  removePlanItem: (id: number) => void;
}

const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      planItems: [],
      setPlanItems: (items) => set({ planItems: items }),
      addPlanItem: (item) =>
        set((state) => {
          const isAlreadyExist = state.planItems.find((p) => p.id === item.id);

          if (isAlreadyExist) {
            return state;
          }

          return { planItems: [...state.planItems, item] };
        }),
      removePlanItem: (id) =>
        set((state) => ({
          planItems: state.planItems.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "plan-storage",
    },
  ),
);

export default usePlanStore;
