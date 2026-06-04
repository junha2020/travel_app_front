import { CalendarPlus, ChevronLeft, Plane, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "../api/planApi";

const MyPlansPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // 로그아웃 핸들러 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  // 1. useQuery를 사용해서 사용자 여행 일정 가져오기
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["userPlans", user?.id],
    queryFn: () => planApi.getUserPlans(user!.id!),
    enabled: !!user?.id,
  });

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
          <span className="text-sm font-semibold text-gray-700">
            {user.nickName}님
          </span>
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
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-semibold text-gray-500">전체 일정 {plans.length}개</span>
            <button
              onClick={() => navigate("/create-plan")}
              className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
            >
              <CalendarPlus size={14} /> 일정 추가
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/planner/${plan.id}`)}
                className="bg-white rounded-2xl p-4 border border-gray-150 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99] flex flex-col gap-1.5"
              >
                <h3 className="text-base font-bold text-gray-900 tracking-tight">{plan.title}</h3>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <span>{plan.startDate}</span>
                  <span>~</span>
                  <span>{plan.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlansPage;
