import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Place } from "../types/placeTypes";
import { type Plan } from "../types/planTypes";

type PlanItem = Pick<Place, "id" | "name" | "category">;

interface PlanState {
  // 아이템 객체
  plans: Record<number, PlanItem[]>;
  // 배열 통째로 바꿀 때
  setPlanItems: (id: Plan["id"], items: PlanItem[]) => void;
  // 아이템 하나 추가할 때
  addPlanItem: (item: PlanItem) => void;
  // 아이템 하나 삭제할 때
  removePlanItem: (id: Plan["id"]) => void;
}

const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: [],
      setPlanItems: (id, items) =>
        set((state) => ({
          plans: {
            ...state.plans,
            [id]: items,
          },
        })),
      addPlanItem: (item) =>
        set((state) => {
          const isAlreadyExist = state.plans[id].find;

          if (isAlreadyExist) {
            return state;
          }

          return { plans: [...state.plans, item] };
        }),
      removePlanItem: (id) =>
        set((state) => ({
          plans: state.plans.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "plan-storage",
    },
  ),
);

export default usePlanStore;
