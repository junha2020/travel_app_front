import { useQuery, useMutation } from "@tanstack/react-query";
import usePlanStore, { type PlanItem } from "../store/usePlanStore";
import { fetchPlaceDetail } from "../api/placeApi";
import { type Place } from "../types/placeTypes";

// 상세 조회 훅
export const usePlaceDetail = (id: number | undefined) => {
  return useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceDetail(Number(id)), // api 호출
    enabled: !!id, // id 존재시에만 쿼리 실행
  });
};

const usePlaces = () => {
  // 전역 스토어 (Zustand)에서 상태와 액션 가져오기
  const planItems = usePlanStore((state) => state.planItems);
  const addPlanItem = usePlanStore((state) => state.addPlanItem);
  const removePlanItem = usePlanStore((state) => state.removePlanItem);

  // 장소를 내 일정에 추가하는 함수
  const addPlaceToPlan = (place: Place) => {
    const newItem: PlanItem = {
      id: Number(place.id),
      name: place.name,
      category: place.category,
    };
    addPlanItem(newItem);
  };

  // 내 전체 일정 목록 조회 (React Query)
  const { data: serverPlans, isLoading } = useQuery({
    queryKey: ["myPlans"],
    queryFn: async () => {
      // return await fetchPlans();
      return []; // 임시
    },
  });

  // 일정을 DB에 최종 저장하는 뮤테이션 (React Query)
  const saveMutation = useMutation({
    mutationFn: async () => {
      // return await savePlanToDB(planItems);
      console.log("DB에 저장할 데이터:", planItems);
    },
    onSuccess: () => {
      alert("일정이 정상적으로 저장되었습니다.");
    },
  });

  return {
    planItems,
    serverPlans,
    isLoading,
    addPlanItem: addPlaceToPlan,
    removePlanItem,
    saveFinalPlan: saveMutation.mutate,
  };
};

export default usePlaces;
