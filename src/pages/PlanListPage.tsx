import {
  CalendarPlus,
  ChevronLeft,
  Plane,
  LogIn,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planApi } from "../api/planApi";
import { useState } from "react";

const PlanListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // 편집
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);

  // 로그아웃 핸들러 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  // 1. useQuery를 사용해서 사용자 여행 일정 가져오기
  const {
    data: plans = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPlans", user?.userid || user?.id],
    queryFn: () => planApi.getUserPlans(user!.userid || user!.id || 0),
    enabled: !!(user?.userid || user?.id),
  });

  // 단일 일정 삭제 Mutation
  const deleteSingleMutation = useMutation({
    mutationFn: (planId: number) => planApi.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
    },
    onError: (err) => {
      alert("일정 삭제에 실패했습니다: " + err);
    },
  });

  // 다중 일정 삭제 Mutation
  const deleteBatchMutation = useMutation({
    mutationFn: async (planIds: number[]) => {
      await Promise.all(planIds.map((id) => planApi.deletePlan(id)));
    },
    onSuccess: () => {
      alert(`${selectedPlanIds.length}개의 일정이 삭제되었습니다.`);
      setSelectedPlanIds([]);
      setIsEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
    },
    onError: (err) => {
      alert("선택 삭제 중 오류가 발생했습니다: " + err);
    },
  });

  // 단일 삭제 핸들러
  const handleDeleteSingle = (
    e: React.MouseEvent,
    planId: number,
    title: string,
  ) => {
    e.stopPropagation();
    if (window.confirm(`${title} 일정을 삭제하시겠습니까?`)) {
      deleteSingleMutation.mutate(planId);
    }
  };

  // 체크박스 선택/해제 토글
  const handleToggleSelect = (planId: number) => {
    setSelectedPlanIds((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId],
    );
  };

  // 전체 선택/해제 토글
  const handleToggleSelectAll = () => {
    if (selectedPlanIds.length === plans.length) {
      setSelectedPlanIds([]);
    } else {
      setSelectedPlanIds(plans.map((p) => p.id));
    }
  };

  // 선택 삭제 실행
  const handleDeleteSelected = () => {
    if (selectedPlanIds.length === 0) return;
    if (
      window.confirm(
        `선택한 ${selectedPlanIds.length}개의 일정을 모두 삭제하시겠습니까?`,
      )
    ) {
      deleteBatchMutation.mutate(selectedPlanIds);
    }
  };

  // 2. 얼리 리턴: user가 없으면(null이면) 로그인 안내 UI 반환
  if (!user) {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        {/* 상단 헤더 */}
        <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-base font-bold ml-2">내 일정</span>
        </div>

        {/* 비로그인용 UI */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-inner">
            <LogIn size={40} strokeWidth={1.5} className="ml-1" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            로그인이 필요한 서비스입니다
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            마이 플랜을 확인하고 관리하려면
            <br />
            로그인이 필요해요.
          </p>

          {/* 로그인 페이지로 이동하는 예쁜 버튼 */}
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white font-bold rounded-xl py-4 px-8 flex items-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-blue-500/30 hover:bg-blue-600"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  // 3. 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="text-base font-bold ml-2">내 일정</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 font-medium">
          로딩 중...
        </div>
      </div>
    );
  }

  // 4. 에러 발생 시 처리
  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="text-base font-bold ml-2">내 일정</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-500 font-medium">
          일정을 불러오는 중에 문제가 발생했어요 ㅠㅠ
        </div>
      </div>
    );
  }

  // 5. 로그인 상태에서 UI 렌더링
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-base font-bold ml-2">내 일정</span>
        </div>

        {/* 유저 닉네임 및 로그아웃 버튼 */}
        <div className="flex items-center gap-3">
          {plans.length > 0 && (
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedPlanIds([]);
              }}
              className={`text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                isEditMode
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isEditMode ? "완료" : "편집"}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1.5 active:scale-95 transition-all"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 일정 리스트 조건부 렌더링 */}
      {!plans || plans.length === 0 ? (
        /* Empty State UI */
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-inner">
            <Plane size={40} strokeWidth={1.5} className="ml-1" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            어디로 떠나시나요?
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            아직 만들어진 여행 일정이 없어요.
            <br />
            나만의 완벽한 여행을 계획해 보세요!
          </p>

          {/* 새 일정 만들기 버튼 -> 일정 생성 페이지로 이동 */}
          <button
            onClick={() => navigate("/create-plan")}
            className="bg-blue-500 text-white font-bold rounded-xl py-4 px-8 flex items-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-blue-500/30 hover:bg-blue-600"
          >
            <CalendarPlus size={20} />새 일정 만들기
          </button>
        </div>
      ) : (
        /* 카드 리스트 렌더링 */
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* 상단 컨트롤 바 */}
          <div className="flex justify-between items-center px-1">
            {isEditMode ? (
              <button
                onClick={handleToggleSelectAll}
                className="text-xs font-bold text-blue-600 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                {selectedPlanIds.length === plans.length ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
                전체 선택 ({selectedPlanIds.length}/{plans.length})
              </button>
            ) : (
              <span className="text-sm font-semibold text-gray-500">
                전체 일정 {plans.length}개
              </span>
            )}

            {!isEditMode && (
              <button
                onClick={() => navigate("/create-plan")}
                className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CalendarPlus size={14} /> 일정 추가
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const isSelected = selectedPlanIds.includes(plan.id);

              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    if (isEditMode) {
                      handleToggleSelect(plan.id);
                    } else {
                      navigate(`/planner/${plan.id}`);
                    }
                  }}
                  className={`bg-white rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/20"
                      : "border-gray-150 hover:shadow-md active:scale-[0.99]"
                  }`}
                >
                  {/* 편집 모드 체크박스 */}
                  {isEditMode && (
                    <div className="shrink-0 text-blue-600">
                      {isSelected ? (
                        <CheckSquare size={20} />
                      ) : (
                        <Square size={20} className="text-gray-300" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <h3 className="text-base font-bold text-gray-900 truncate tracking-tight">
                      {plan.title}
                    </h3>
                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <span>{plan.startDate}</span>
                      <span>~</span>
                      <span>{plan.endDate}</span>
                    </div>
                  </div>

                  {/* 삭제 휴지통 */}
                  {!isEditMode && (
                    <button
                      onClick={(e) =>
                        handleDeleteSingle(e, plan.id, plan.title)
                      }
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                      title="일정 삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isEditMode && selectedPlanIds.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <button
            onClick={handleDeleteSelected}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-2xl shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 size={18} />
            선택한 {selectedPlanIds.length}개 일정 삭제하기
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanListPage;
