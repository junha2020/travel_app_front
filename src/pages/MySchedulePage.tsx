import { Calendar, ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePlanStore from "../store/usePlanStore";

const MySchedulePage = () => {
  const navigate = useNavigate();
  const planItems = usePlanStore((state) => state.planItems);

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex items-center h-14 px-4 border-b border-gary-200 bg-white shrink-0">
        <button
          onClick={() => navigate("/detail")}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">내 여행 배낭</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-lg font-bold mb-4">
          찜한 장소 <span className="text-blue-500">{planItems.length}</span>
        </h2>
        {/* Zustand에 담겨 있을 때 */}
        {planItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
              📍
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
            <button className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {/* 아무것도 없을 때 */}
        {planItems.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            텅 비어있어요. 장소를 담아보세요!
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6">
        <button
          onClick={() => navigate("/editor")}
          className="w-full bg-gray-900 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98]"
        >
          <Calendar size={20} />이 장소들로 일정 짜기
        </button>
      </div>
    </div>
  );
};

export default MySchedulePage;
