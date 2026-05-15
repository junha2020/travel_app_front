import { Calendar, ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import usePlanStore from "../store/usePlanStore";

const BackpackPage = () => {
  const navigate = useNavigate();

  const { planId } = useParams();
  const currentPlanId = Number(planId) || 1;

  const plans = usePlanStore((state) => state.plans);
  const removePlanItem = usePlanStore((state) => state.removePlanItem);

  const planItems = useMemo(() => {
    return plans[currentPlanId] || [];
  }, [plans, currentPlanId]);

  const handleDelete = (itemId: number) => {
    if (window.confirm("이 장소를 찜에서 해제할까요?")) {
      removePlanItem(currentPlanId, itemId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => navigate(`/schedule/${planId}`)}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">
          내 여행 배낭 (ID: {currentPlanId})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-lg font-bold mb-4">
          찜한 장소 <span className="text-blue-500">{planItems.length}</span>
        </h2>

        <div className="flex flex-col gap-3">
          {planItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm font-bold">
              아직 찜해둔 장소가 없어요 ㅠㅠ
            </div>
          ) : (
            planItems.map((item) => (
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
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6">
        <button
          onClick={() => navigate("/planner/1")}
          className="w-full bg-gray-900 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98]"
        >
          <Calendar size={20} />이 장소들로 일정 짜기
        </button>
      </div>
    </div>
  );
};

export default BackpackPage;
