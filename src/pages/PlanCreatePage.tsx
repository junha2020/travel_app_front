import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, Compass, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { planApi } from "../api/planApi";

const PlanCreatePage = () => {
  const Maps = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      Maps("/login");
      return;
    }

    setIsLoading(true);

    try {
      // 폼 제출 시 title, startDate, endDate, userId: user.id 조합
      const userId = user.id || user.userid;

      const data = await planApi.createPlan({
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: userId,
      });

      console.log("새 일정 생성 완료:", data);
      alert("여행 일정이 생성되었습니다! 플래너로 이동합니다.");
      
      // API 호출 성공 시 반환받은 data.id를 이용해 Maps('/planner/' + data.id)로 리다이렉트
      Maps('/planner/' + data.id);
    } catch (error) {
      console.error("일정 생성 에러:", error);
      alert("일정 생성 중 문제가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* 상단 헤더 */}
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
        <button
          onClick={() => Maps(-1)}
          className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2 text-gray-900">새 일정 만들기</span>
      </div>

      {/* 입력 폼 콘텐트 */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center my-6 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 text-white">
            <Compass size={32} className="animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">새로운 모험의 시작</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            어디로, 언제 떠나시나요?
            <br />
            나만의 완벽한 여행 계획을 만들어보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-4">
          {/* 여행지 이름 입력 필드 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <MapPin size={14} className="text-blue-500" />
              여행지 이름 (일정 제목)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 제주도 여행, 도쿄 3박4일, 파리 한 달 살기"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* 여행 기간 입력 필드 (시작일 / 종료일) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Calendar size={14} className="text-blue-500" />
              여행 기간
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400">가는 날</span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400">오는 날</span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate} // 시작일보다 이전 날짜 선택 불가
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* 일정 시작하기 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold rounded-xl py-4 mt-6 hover:bg-blue-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-500/30 text-sm disabled:bg-gray-400 disabled:shadow-none"
          >
            <Send size={16} />
            {isLoading ? "일정 생성 중..." : "일정 시작하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanCreatePage;
