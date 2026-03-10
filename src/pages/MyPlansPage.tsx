import { CalendarPlus, ChevronLeft, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyPlansPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* 상단 헤더 */}
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">내 일정</span>
      </div>

      {/* Empty State UI */}
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

        {/* 새 일정 만들기 버튼 -> 홈 또는 장소 리스트로 이동 */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white font-bold rounded-xl py-4 px-8 flex items-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-blue-500/30 hover:bg-blue-600"
        >
          <CalendarPlus size={20} />새 일정 만들기
        </button>
      </div>
    </div>
  );
};

export default MyPlansPage;
