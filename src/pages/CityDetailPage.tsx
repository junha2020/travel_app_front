import { useQuery } from "@tanstack/react-query";
import { Heart, Info, Map, Menu, Plus, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { planApi } from "../api/planApi";
import {
  getCityInfo,
  getTravelStatusText,
  isActiveTravelPlan,
} from "../utils/travelUtils";
import { placeApi } from "../api/placeApi";
import { MenuDrawer } from "../components/MenuDrawer";

const CITY_NAV_CHIPS = [
  { id: "항공", label: "항공" },
  { id: "숙소", label: "숙소" },
  { id: "관광", label: "관광" },
  { id: "맛집", label: "맛집" },
  { id: "가이드", label: "가이드" },
  { id: "투어·티켓", label: "투어·티켓" },
  { id: "라운지", label: "라운지" },
];

const CityDetailPage = () => {
  const { cityName: citySlug } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userName = user?.userName || "여행자";
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuDrawerOpen, setISMenuDrawerOpen] = useState(false);

  // 영문 슬러그 한글로 변환
  const cityInfo = getCityInfo(citySlug);
  const targetCityName = cityInfo.title;
  const slug = cityInfo.slug || citySlug || "tokyo";

  // 유저 일정 조회
  const userId = user?.userid || user?.id || 0;
  const { data: userPlans = [] } = useQuery({
    queryKey: ["cityPlans", userId],
    queryFn: () => planApi.getUserPlans(userId),
    enabled: !!userId,
  });

  // 해당 도시 활성 일정 매칭
  const matchedPlan = userPlans.find((p) => {
    const isCityMatch =
      p.title?.includes(targetCityName) ||
      targetCityName.includes(p.title || "");
    return isCityMatch && isActiveTravelPlan(p.endDate);
  });

  const headerStatusText = matchedPlan
    ? getTravelStatusText(matchedPlan.startDate, matchedPlan.endDate)
    : `${targetCityName} 여행`;

  // 해당 장소 DB에서 장소 목록 조회
  const { data: dbPlaces = [] } = useQuery({
    queryKey: ["cityPlaces", targetCityName],
    queryFn: () => placeApi.searchPlacesByName(targetCityName),
  });

  // 추천 1순위 대표 장소 동적 할당
  const mainPlace = dbPlaces[0] || {
    id: 0,
    name: `${cityInfo.title} 핵심 투어`,
    description: cityInfo.description,
    imageUrl: cityInfo.imageUrl,
    category: "관광지",
  };

  // 서브 추천 장소들
  const subPlaces = dbPlaces.slice(1, 5);

  // 칩 클릭 시 독립 페이지로 이동
  const handleChipClick = (chipId: string) => {
    switch (chipId) {
      case "가이드":
        navigate(`/city/${slug}/guide`);
        break;
      case "관광":
        navigate(`/city/${slug}/places?type=tour`);
        break;
      case "맛집":
        navigate(`/city/${slug}/places?type=restaurant`);
        break;
      case "투어·티켓":
        navigate(`/city/${slug}/lounge`);
        break;
      case "라운지":
        navigate(`/city/${slug}/lounge`);
        break;
      case "항공":
        alert(`${targetCityName} 행 항공권 최저가 검색 (준비 중)`);
        break;
      case "숙소":
        alert(`${targetCityName} 호텔 최저가 비교 (준비 중)`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white select-none pb-10">
      {/* 상단 헤더 */}
      <header className="bg-teal-500 text-white sticky top-0 z-40 shadow-xs">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-teal-600 rounded-full transition-colors"
            >
              <X size={22} />
            </button>
            <h1 className="text-base font-extrabold tracking-tight">
              {headerStatusText}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(`/places?search=${encodeURIComponent(targetCityName)}`)
              }
              className="p-1 hover:bg-teal-600 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => navigate(`/city/${slug}/map`)}
              className="p-1 hover:bg-teal-600 rounded-full transition-colors"
            >
              <Map size={20} />
            </button>
            <button
              onClick={() => setISMenuDrawerOpen(true)}
              className="p-1 hover:bg-teal-600 rounded-full transition-colors relative"
            >
              <Menu size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-teal-500"></span>
            </button>
          </div>
        </div>

        {/* 가로 바로가기 칩 바 */}
        <nav className="flex items-center overflow-x-auto scrollbar-hide px-4 gap-4 text-sm font-bold border-t border-teal-400/40 py-2.5">
          {CITY_NAV_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip.id)}
              className="text-teal-100 hover:text-white shrink-0 font-bold active:scale-95 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 메인 본문 영역 */}
      <main className="p-5 flex flex-col gap-6">
        {/* AI 맞춤 추천 대형 카드 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <h2 className="text-base font-black text-gray-900">
              {userName}님을 위한 트리플 AI 추천
            </h2>
            <Info size={16} className="text-gray-400 cursor-pointer" />
          </div>

          <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xs">
            <div className="h-[280px] relative overflow-hidden bg-gray-100">
              <img
                src={mainPlace.imageUrl || cityInfo.imageUrl}
                alt={mainPlace.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white active:scale-90 transition-all"
              >
                <Heart
                  size={22}
                  className={
                    isLiked ? "fill-rose-500 text-rose-500" : "text-white"
                  }
                />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div>
                <h3 className="tex-xl font-black text-gray-900">
                  {mainPlace.name}
                </h3>
                <p className="text-xs text-gray-600 font-bold mt-0.5 line-clamp-1">
                  {mainPlace.description}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">
                  {mainPlace.category || "관광지"} · {targetCityName} · 실시간
                  평점 ★ 4.8
                </p>
              </div>

              <div className="bg-blue-50/80 rounded-xl p-2.5">
                <p className="text-xs font-black text-blue-600">
                  {targetCityName} 여행자들이 가장 많이 찾는 인기 장소 랭킹 1위!
                </p>
              </div>

              <button
                onClick={() =>
                  alert(`[${mainPlace.name}] 일정이 추가되었습니다!`)
                }
                className="w-full py-3 bg-white border border-gray-250 hover:bg-gray-50 text-gray-800 font-extrabold text-xs rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus size={16} />
                <span>내 일정에 담기</span>
              </button>
            </div>
          </div>
        </div>

        {/* 최근 본 여행 정보 */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-black text-gray-900 px-1">
            {targetCityName} 추천 명소 & 티켓
          </h3>

          <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-2">
            {subPlaces.length > 0 ? (
              subPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => navigate(`/places/${place.id}`)}
                  className="min-w-[180px] bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xs shrink-0 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <img
                    src={place.imageUrl || cityInfo.imageUrl}
                    alt={place.name}
                    className="w-full h-[120px] object-cover bg-gray-100"
                  />
                  <div className="p-3.5 flex flex-col gap-1">
                    <h4 className="font-black text-xs text-gray-900 truncate">
                      {place.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight font-medium">
                      {place.description}
                    </p>
                    <span className="text-[10px] text-gray-400 font-bold mt-1">
                      {place.category} · {targetCityName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400 py-4 px-2">
                등록된 추가 명소가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 전역 공통 사이드 메뉴 드로어 렌더링 */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setISMenuDrawerOpen(false)}
      />
    </div>
  );
};

export default CityDetailPage;
