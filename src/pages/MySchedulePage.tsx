import { Calendar, ChevronLeft, Trash2 } from "lucide-react";

const MySchedulePage = ({ navigate }: any) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex item-center h-14 px-4 border-b border-gary-200 bg-white shrink-0">
        <button
          onClick={() => navigate("detail")}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">내 여행 배낭</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-lg font-bold mb-4">
          찜한 장소 <span className="text-blue-500">2</span>
        </h2>
        <div className="flex flex-col gap-3">
          {/* 목업 데이터 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gary-100 p-4 flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
              🦆
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">수성못</h3>
              <p className="text-xs text-gray-500">대구광역시 수성구</p>
            </div>
            <button className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={18} />
            </button>
          </div>

          {/* 목업 데이터 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl">
              🎡
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">동성로 스파크랜드</h3>
              <p className="text-xs text-gray-500">대구광역시 중구</p>
            </div>
            <button className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6">
        <button
          onClick={() => navigate("editor")}
          className="w-full bg-gray-900 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98]"
        >
          <Calendar size={20} />이 장소들로 일정 짜기
        </button>
      </div>
    </div>
  );
};

export default MySchedulePage;
