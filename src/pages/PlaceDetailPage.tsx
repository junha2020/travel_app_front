import { ChevronLeft, MapPin, Plus, Star } from "lucide-react";
import usePlanStore from "../store/usePlanStore";
import { useNavigate } from "react-router-dom";

const MOCK_PLACE = {
  id: 1,
  name: "수성못",
  category: "관광지",
  rating: 4.8,
  reviews: 1024,
  address: "대구광역시 수성구 두산동",
  desc: "대구 시민들의 영원한 휴식처. 오리배 타면서 힐링하기 좋고 야경이 미쳤음. 벚꽃 필 때 가면 사람 터짐.",
};

const PlaceDetailPage = () => {
  const navigate = useNavigate();
  const planItems = usePlanStore((state) => state.planItems);
  const addPlanItem = usePlanStore((state) => state.addPlanItem);

  const handleAddPlace = () => {
    const isAlreadyExist = planItems.find((p) => p.id === MOCK_PLACE.id);

    if (isAlreadyExist) {
      alert("이미 담겨있습니다!");
      return;
    }

    addPlanItem({
      id: MOCK_PLACE.id,
      name: MOCK_PLACE.name,
      category: MOCK_PLACE.category,
    });
    alert("추가되었습니다.");
    navigate("/schedule");
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>
      {/* 이미지 영역 */}
      <div className="h-64 bg-blue-100 flex items-center justify-center shrink-0">
        <span className="text-6xl"></span>
      </div>
      {/* 상세 정보 */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
            {MOCK_PLACE.category}
          </span>
          <div className="flex items-center text-sm font-bold text-gray-700">
            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
            {MOCK_PLACE.rating}{" "}
            <span className="text-gray-400 font-normal ml-1">
              ({MOCK_PLACE.reviews})
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {MOCK_PLACE.name}
        </h1>
        <p className="flex items-center text-sm text-gray-500 mb-6">
          <MapPin size={16} className="mr-1" /> {MOCK_PLACE.address}
        </p>
        <div className="h-px bg-gray-100 w-full mb-6"></div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">장소 소개</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {MOCK_PLACE.desc}
        </p>
      </div>

      {/* 하단 찜하기 버튼 */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-10px_20px_rgba(0, 0, 0, 0.05">
        <button
          onClick={handleAddPlace}
          className="w-full bg-blue-500 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Plus size={20} />내 일정에 담기
        </button>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
