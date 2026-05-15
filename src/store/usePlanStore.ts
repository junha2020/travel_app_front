import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Place } from "../types/placeTypes";
import { type Plan } from "../types/planTypes";

export type PlanItem = Pick<Place, "id" | "name" | "category">;

interface PlanState {
  // 아이템 객체
  plans: Record<number, PlanItem[]>;
  // 배열 통째로 바꿀 때
  setPlanItems: (planId: number, items: PlanItem[]) => void;
  // 아이템 하나 추가할 때
  addPlanItem: (planId: number, item: PlanItem) => void;
  // 아이템 하나 삭제할 때
  removePlanItem: (planId: number, itemId: number) => void;
  // 특정 일정 완전히 비우가
  clearPlan: (planId: number) => void;
}

const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: {},

      setPlanItems: (planId, items) =>
        set((state) => ({
          plans: {
            ...state.plans,
            [planId]: items,
          },
        })),

      addPlanItem: (planId, item) =>
        set((state) => {
          // 해당 일정 없으면 빈 배열로 시작
          const currentPlanItems = state.plans[planId] || [];

          // 중복 검사
          const isAlreadyExist = currentPlanItems.find((p) => p.id === item.id);

          if (isAlreadyExist) {
            alert("이미 일정에 담긴 장소입니다!");
            return state;
          }

          // 기존 일정에 새 장소 추가
          const updatedPlanItems = [...currentPlanItems, item];

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlanItems,
            },
          };
        }),

      removePlanItem: (planId, itemId) =>
        set((state) => {
          const currentPlanItems = state.plans[planId] || [];

          return {
            plans: {
              ...state.plans,
              [planId]: currentPlanItems.filter((item) => item.id !== itemId),
            },
          };
        }),

      clearPlan: (planId) =>
        set((state) => {
          const newPlans = { ...state.plans };
          delete newPlans[planId];
          return { plans: newPlans };
        }),
    }),
    {
      name: "multi-plan-storage",
    },
  ),
);

export default usePlanStore;
