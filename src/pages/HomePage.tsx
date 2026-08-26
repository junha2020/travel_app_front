import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "../api/planApi";
import {
  Bell,
  ChevronRight,
  Compass,
  Flag,
  Hotel,
  Menu,
  MessageSquare,
  Plane,
  Search,
  Sparkles,
  Ticket,
  Utensils,
} from "lucide-react";
import { AICustomizeModal } from "../components/AICustomizeModal";
import { getTravelStatusText, isActiveTravelPlan } from "../utils/travelUtils";
import { MenuDrawer } from "../components/MenuDrawer";
import { placeApi } from "../api/placeApi";
import { JAPAN_TOP_PASSES } from "../data/japanPassData";

// 7대 퀵 카테고리 칩 데이터
const HOME_QUICK_CHIPS = [
  {
    id: "flight",
    label: "항공",
    icon: Plane,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "hotel",
    label: "숙소",
    icon: Hotel,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "tour",
    label: "투어·티켓",
    icon: Ticket,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "food",
    label: "맛집",
    icon: Utensils,
    color: "text-rose-500 bg-rose-50",
  },
  {
    id: "places",
    label: "관광",
    icon: Flag,
    color: "text-purple-500 bg-purple-50",
  },
  {
    id: "pass",
    label: "교통패스",
    icon: Compass,
    color: "text-teal-500 bg-teal-50",
  },
  {
    id: "lounge",
    label: "라운지",
    icon: MessageSquare,
    color: "text-indigo-500 bg-indigo-50",
  },
];

// 3단 메인 추천 도시
const FEATURED_CITIES = [
  {
    name: "도쿄",
    slug: "tokyo",
    subText: "화려한 도심과 트렌드의 중심",
    tag: "인기 1위 🔥",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "오사카",
    slug: "osaka",
    subText: "맛있는 먹거리와 활기찬 거리",
    tag: "미식 천국 🍜",
    imageUrl:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "후쿠오카",
    slug: "fukuoka",
    subText: "가장 가까운 온천 & 힐링 여행",
    tag: "가성비 최고 ✈️",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // 내 일정 도회
  const userId = user?.id || user?.userid || 0;
  const { data: userPlans = [] } = useQuery({
    queryKey: ["userPlans", userId],
    queryFn: () => planApi.getUserPlans(userId),
    enabled: !!userId && isLoggedIn,
  });

  // 가장 가까운 유효 일정 찾기
  const activePlan = userPlans.find((p: any) => isActiveTravelPlan(p.endDate));

  // 인기 추천 장소 조회
  const { data: popularPlaces = [] } = useQuery({
    queryKey: ["popularPlaces"],
    queryFn: () => placeApi.searchPlacesByName("도쿄"),
  });

  const topPasses = JAPAN_TOP_PASSES.slice(0, 3);
  const activeCity = FEATURED_CITIES[currentCityIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none pb-24 max-w-md mx-auto relative">
      {/* 최상단 통합 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-150 flex items-center gap-3 shadow-2xs">
        {/* 검색 버튼 */}
        <div
          onClick={() => navigate("/search")}
          className="flex-1 bg-gray-100 hover:bg-gray-150 px-4 py-2.5 rounded-full flex items-center justify-between cursor-pointer transition-colors"
        >
          <span className="text-xs font-black text-gray-400">
            여행, 어디로 떠나시나요?
          </span>
          <Search size={16} className="text-gray-500" />
        </div>

        {/* 알림 아이콘 */}
        <button
          onClick={() => alert("새로운 알림이 없습니다.")}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 relative"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* 햄버거 메뉴 */}
        <button
          onClick={() => setIsMenuDrawerOpen(true)}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700"
        >
          <Menu size={22} />
        </button>
      </header>

      <main className="flex flex-col gap-6 p-4">
        {/* D-Day 플로팅 플래너 배너 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
              {isLoggedIn
                ? `${user?.userName}님의 여행`
                : "트리플 스마트 플래너"}
            </span>
            <h2 className="text-base font-black truncate">
              {activePlan
                ? `${activePlan.title} (${getTravelStatusText(activePlan.startDate, activePlan.endDate)})`
                : "설레는 일본 여행을 시작해보세요"}
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              {activePlan
                ? `${activePlan.startDate} ~ ${activePlan.endDate}`
                : "나만의 맞춤 일정을 3단계로 간편하게 등록"}
            </p>
          </div>

          <button
            onClick={() =>
              activePlan
                ? navigate(`/planner/${activePlan.id}`)
                : navigate("/create-plan")
            }
            className="ml-3 px-4 py-2.5 bg-white text-blue-600 rounded-2xl text-xs font-black shrink-0 hover:bg-blue-50 active:scale-95 transition-all shadow-xs"
          >
            {activePlan ? "일정 보기" : "새 일정 만들기"}
          </button>
        </div>

        {/* 카테고리 7개 칩 바 */}
        <div className="grid grid-cols-4 gap-2.5 py-1">
          {HOME_QUICK_CHIPS.map((chip) => (
            <div
              key={chip.id}
              onClick={() => {
                if (chip.id === "tour" || chip.id === "pass") {
                  navigate("/city/tokyo.tours");
                } else if (chip.id === "lounge") {
                  navigate("/city/tokyo/lounge");
                } else if (chip.id === "places") {
                  navigate("/city/tokyo/places?type=tour");
                } else if (chip.id === "food") {
                  navigate("/city/tokyo/places?type=restaurant");
                } else {
                  alert(`[${chip.label}] 서비스 준비 중입니다.`);
                }
              }}
              className="bg-white p-3 rounded-2xl border border-gray-150 flex flex-col items-center gap-1.5 cursor-pointer hover:shadow-xs active:scale-95 transition-all"
            >
              <div className={`p-2 rounded-xl ${chip.color}`}>
                <chip.icon size={18} />
              </div>
              <span className="text-[11px] font-black text-gray-800">
                {chip.label}
              </span>
            </div>
          ))}

          {/* AI 생성 퀵 카드 */}
          <div
            onClick={() => setIsAIModalOpen(true)}
            className="bg-gradient-to-tr from-teal-50 to-cyan-50 p-3 rounded-2xl border border-teal-200 flex flex-col items-center gap-1.5 cursor-pointer hover:shadow-xs active:scale-95 transition-all"
          >
            <div className="p-2 rounded-xl text-teal-600 bg-teal-100/70">
              <Sparkles size={18} />
            </div>
            <span className="text-[11px] font-black text-teal-800">
              AI 일정
            </span>
          </div>
        </div>

        {/* 3단 메인 도시 슬라이더 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-gray-900">
              어디로 떠나시나요?
            </h3>
            <div className="flex gap-1.5">
              {FEATURED_CITIES.map((c, idx) => (
                <button
                  key={c.slug}
                  onClick={() => setCurrentCityIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentCityIndex === idx ? "w-5 bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            onClick={() => navigate(`/city/${activeCity.slug}`)}
            className="relative h-[240px] rounded-3xl overflow-hidden shadow-md cursor-pointer group"
          >
            <img
              src={activeCity.imageUrl}
              alt={activeCity.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <div className="flex flex-col text-white">
                <span className="text-[10px] font-black bg-blue-600 px-2.5 py-1 rounded-full w-fit mb-1.5 shadow-xs">
                  {activeCity.tag}
                </span>
                <h4 className="text-2xl font-black">{activeCity.name}</h4>
                <p className="text-xs text-gray-200 font-medium mt-0.5">
                  {activeCity.subText}
                </p>
              </div>

              <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-white group-hover:text-gray-900 transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* 클룩 패스 큐레이션 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-gray-900">
              일본 필수 교통패스 (최대 15% 할인)
            </h3>
            <button
              onClick={() => navigate("/city/tokyo/tours")}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center"
            >
              전체보기 <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex flex-col divide-y divide-gray-100 bg-white rounded-3xl p-4 border border-gray-150 shadow-2xs">
            {topPasses.map((pass) => (
              <div
                key={pass.id}
                onClick={() => window.open(pass.bookingUrl, "_blank")}
                className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1.5 transition-colors"
              >
                <img
                  src={pass.imageUrl}
                  alt={pass.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-gray-100"
                />
                <div className="flex- min-w-0">
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    {pass.discountRate} 할인
                  </span>
                  <h4 className="text-xs font-black text-gray-900 truncate mt-1">
                    {pass.name}
                  </h4>
                  <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                    {pass.price.toLocaleString()}원 · ★ {pass.rating} (
                    {pass.reviewCount})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 실시간 인기 명소 피드 */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-black text-gray-900 px-1">
            여행자들이 가장 많이 찾는 명소
          </h3>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {popularPlaces.slice(0, 5).map((place: any) => (
              <div
                key={place.id}
                onClick={() => navigate(`/places/${place.id}`)}
                className="min-w-[160px] w-[160px] bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-2xs shrink-0 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                <img
                  src={place.imageUrl || activeCity.imageUrl}
                  alt={place.name}
                  className="w-full h-[110px] object-cover bg-gray-100"
                />
                <div className="p-3 flex flex-col gap-1">
                  <h4 className="font-black text-xs text-gray-900 truncate">
                    {place.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold truncate">
                    {place.create || "관광지"} · 도쿄
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI 맞춤 일정 모달 */}
      <AICustomizeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* 메뉴 모달 */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
      />
    </div>
  );
};

export default HomePage;
