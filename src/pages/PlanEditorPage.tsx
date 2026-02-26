import { ChevronLeft, GripVertical, MapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanEditorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0 z-20 shadow-sm">
        <button
          onClick={() => navigate("/schedule")}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">대구 1박 2일 여행</span>
      </div>

      {/* 지도 영역 */}
      <div className="h-[35%] bg-gray-200 relative shrink-0 border-b border-gray-300">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-bold text-sm bg-gray-100">
          <MapIcon size={32} className="mb-2 text-gray-300" />
          [카카오맵 렌더링 영역]
          <span className="text-xs font-normal mt-1">
            나중에 여기에 react-kakao-maps-sdk 붙이기
          </span>
        </div>
      </div>

      {/* 일정 편접 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Day */}
        <div className="flex bg-white border- border-gray-200 shrink-0 px2- pt-2">
          <button className="flex-1 pb-3 text-sm font-bold text-blue-500 border-b-2 border-blue-500">
            Day 1
          </button>
          <button className="flex-1 pb-3 text-sm font-bold text-gray-400">
            Day 2
          </button>
        </div>

        {/* 일정 리스트. 여기에 dnd-kit 들어감 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-20">
          {/* 타임라인 */}
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center w-6 shrink-0 mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <div className="w-0.5 bg-gray-200 h-full mt-1"></div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
              <GripVertical
                size={20}
                className="text-gray-300 cursor-grab active:cursor-grabbing"
              />
              <div>
                <h4 className="font-bold text-sm">수성못</h4>
                <p className="text-[10px] text-gray-400">관광지</p>
              </div>
            </div>
          </div>

          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center w-6 shrink-0 mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
              <GripVertical
                size={20}
                className="text-gray-300 cursor-grab active:cursor-grabbing"
              />
              <div>
                <h4 className="font-bold text-sm">동성로 스파크랜드</h4>
                <p className="text-[10px] text-gray-400">관광지</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEditorPage;
