import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "../api/planApi";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Compass,
  Flag,
  Hotel,
  Menu,
  MessageSquare,
  Plane,
  Plus,
  Search,
  Sparkles,
  Ticket,
  Utensils,
} from "lucide-react";
import { AICustomizeModal } from "../components/AICustomizeModal";
import {
  calculateDDay,
  formatTravelDates,
  getCityInfo,
  SUPPORTED_JAPAN_CITIES,
} from "../utils/travelUtils";
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

// '지금 주목할 만한 도시' 큐레이션 데이터 (HomePage6, 6_2, 6_3 싱크)
const CURATED_CITIES = [
  {
    name: "도쿄",
    slug: "tokyo",
    subTitle: "역사 속 여행이 시작되는 도시",
    travellerCount: 222,
    heroImage:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    description:
      "고대의 숨결과 현대의 활기가 공존하는 메가시티, 도쿄. 아사쿠사의 전통 사찰부터 시부야 스카이의 파노라마 야경까지, 골목마다 새로운 이야기가 펼쳐집니다.",
    tags: [
      "직항 2시간 20분",
      "온화한 해양성 기후",
      "도심 골목 산책",
      "스시 & 라멘 미식",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1554797589-7241bb375673?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    ],
    tips: [
      {
        title: "도쿄를 왔다면 어디를 가야 할까?",
        desc: "이곳만큼은 반드시! 시부야 스카이와 센소지 대표 명소 모음",
        img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
      },
      {
        title: "도쿄 3박 4일 황금 추천 코스",
        desc: "초보 여행자도 후회 없이 알차게 즐기는 지하철 동선 완벽 가이드",
        img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80",
      },
      {
        title: "도쿄에서 꼭 먹어야 할 대표 음식",
        desc: "미쉐린 라멘부터 츠키지 장외시장 신선한 카이센동 총정리",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
      },
      {
        title: "낭만이 있는 도쿄 야경 명소 BEST 3",
        desc: "롯폰기 힐즈와 도쿄타워를 바라보는 감성 스팟",
        img: "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    name: "오사카",
    slug: "osaka",
    subTitle: "맛있는 먹거리와 활기찬 미식의 도시",
    travellerCount: 318,
    heroImage:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=600&q=80",
    description:
      "쿠이다오레(먹다가 망한다)의 고향, 오사카! 글리코상이 반겨주는 도톤보리부터 유니버셜 스튜디오 재팬의 짜릿한 어트랙션까지 오감을 만족시킵니다.",
    tags: [
      "직항 1시간 40분",
      "타코야키 원조",
      "교토·고베 근교",
      "USJ 어트랙션",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80",
    ],
    tips: [
      {
        title: "오사카 필수 코스 USJ 100% 즐기기",
        desc: "익스프레스 패스 예약 팁과 닌텐도 월드 입장 방법",
        img: "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=200&q=80",
      },
      {
        title: "도톤보리 5대 로컬 맛집 정복기",
        desc: "웨이팅 없이 즐기는 현지인 야키니쿠와 오코노미야키",
        img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

// 도시명 동적 추출 헬퍼
const extractCityNameFromPlan = (planTitle?: string): string => {
  if (!planTitle) return "도쿄";
  const matchedCity = SUPPORTED_JAPAN_CITIES.find((city) =>
    planTitle.includes(city),
  );
  return matchedCity || "도쿄";
};

// 도시 대표 이미지 동적 추출 헬퍼
const getCityImageFromPlan = (planTitle?: string): string => {
  const cityName = extractCityNameFromPlan(planTitle);
  const info = getCityInfo(cityName);
  return (
    info?.imageUrl ||
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80"
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // 다중 일정 스와이프 관리 상태
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  // 스크롤 감지 및 플로팅 버블 위젯 상태
  const [isCollapsedToBubble, setIsCollapsedToBubble] = useState(false);

  // 주목할 도시 큐레이션 인덱스
  const [curatedCityIndex, setCuratedCityIndex] = useState(0);

  // 추천 상품 탭 상세
  const [recommendTab, setRecommendTab] = useState<
    "hotel" | "tour" | "food" | "places"
  >("hotel");

  // 내 일정 조회
  const userId = user?.id || user?.userid || 0;
  const { data: userPlans = [] } = useQuery({
    queryKey: ["userPlans", userId],
    queryFn: () => planApi.getUserPlans(userId),
    enabled: !!userId && isLoggedIn,
  });

  // 가장 가까운 일정 자동 정렬
  const sortedPlans = useMemo(() => {
    if (!userPlans || userPlans.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...userPlans].sort((a: any, b: any) => {
      const timeA = new Date(a.startDate).getTime();
      const timeB = new Date(b.startDate).getTime();
      const isPastA = new Date(a.endDate).getTime() < today.getTime();
      const isPastB = new Date(b.endDate).getTime() < today.getTime();

      if (isPastA && !isPastB) return 1;
      if (!isPastA && isPastB) return -1;

      return timeA - timeB;
    });
  }, [userPlans]);

  // 현재 활성화된 일정
  const currentPlan = sortedPlans[selectedPlanIndex] || sortedPlans[0];
  const dDayText = currentPlan
    ? calculateDDay(currentPlan.startDate)
    : "설레는";

  // 현재 선택된 일정 도시 이름 동적 추출
  const activeCityName = extractCityNameFromPlan(currentPlan?.title);

  // 현재 일정에 따른 추천 장소 조회
  const { data: recommendedPlaces = [] } = useQuery({
    queryKey: ["recommendedPlaces", activeCityName],
    queryFn: () => placeApi.searchPlacesByName(activeCityName),
  });

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsCollapsedToBubble(scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topPasses = JAPAN_TOP_PASSES.slice(0, 3);
  const curatedCity = CURATED_CITIES[curatedCityIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] select-none pb-32 max-w-md mx-auto relative">
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
        {/* 카테고리 7개 칩 바 */}
        <div className="grid grid-cols-4 gap-2 py-1">
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

        {/* D-Day 연동 헤더 & 생성 여행 스토리 피드 */}
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-blue-600 font-black text-base">
              {dDayText}
            </span>
            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
              여행이 더 즐겁고 알차도록
              <br />
              생생한 소식을 모아왔어요
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
            <div
              onClick={() => navigate("/city/tokyo")}
              className="relative min-w-[200px] h-[280px] rounded-3xl overflow-hidden shadow-md shrink-0 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1715607817921-aa6417a19dbd?q=80&w=1287&auto=format&fit=crop&w=400&q=80"
                alt="시부야"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blue-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span> 도쿄
                방랑자
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-black text-sm line-clamp-2">
                  '시부야 스크램블 교차로' 리얼 리뷰
                </h4>
                <p className="text-[11px] text-gray-300 font-bold mt-1">도쿄</p>
              </div>
            </div>

            <div
              onClick={() => navigate("/city/osaka")}
              className="relative min-w-[200px] h-[280px] rounded-3xl overflow-hidden shadow-md shrink-0 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1769504557586-00fa83a2604f?q=80&w=1287&auto=format&fit=crop&w=400&q=80"
                alt="오사카"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-50-5 from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blue-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>{" "}
                오사카 아줌마
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-black text-sm line-clamp-2">
                  도쿄, 오사카, 교토 완전정복
                </h4>
                <p className="text-[11px] text-gray-300 font-bold mt-1">
                  오사카 외 2
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 일정에 어울리는 추천 상품 및 장소 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-gray-900">
              내 일정에 어울리는 추천 상품 및 장소
            </h3>
            <span className="text-[11px] font-bold text-teal-600">
              {activeCityName} 맞춤
            </span>
          </div>

          {/* 칩 4개 */}
          <div className="flex gap-2">
            {[
              { id: "hotel", label: "숙소" },
              { id: "tour", label: "투어·티켓" },
              { id: "food", label: "맛집" },
              { id: "places", label: "관광지" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRecommendTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                  recommendTab === tab.id
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 추천 장소 리스트 */}
          <div className="flex flex-col divide-y divide-gray-100 bg-white rounded-3xl p-4 border border-gray-150 shadow-2xs">
            {recommendedPlaces.slice(0, 3).map((place: any) => (
              <div
                key={place.id}
                onClick={() => navigate(`/places/${place.id}`)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={
                      place.imageUrl ||
                      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={place.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-gray-100 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-gray-900 truncate">
                      {place.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                      {place.category || "관광지"} · ★ 4.8 (1.240)
                    </p>
                    <p className="text-[11px] text-blue-600 font-black mt-0.5">
                      148,000원~
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 주목할만한 도시 */}
        <div className="flex flex-col gap-3 pt-2">
          {/* 아코디언 드롭다운 헤더 */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <img
                src={curatedCity.heroImage}
                alt={curatedCity.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="text-[10px] font-bold text-gray-400 leading-tight">
                  {curatedCity.subTitle}
                </p>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1">
                  {curatedCity.name}
                  <button
                    onClick={() =>
                      setCuratedCityIndex((prev) => (prev === 0 ? 1 : 0))
                    }
                    className="p-0.5 text-gray-400 hover:text-gray-700"
                  >
                    <ChevronDown size={16} />
                  </button>
                </h3>
              </div>
            </div>
            <span className="text-xs font-black text-blue-600">
              지금 주목할 만한 도시
            </span>
          </div>

          {/* 3단 가로 카드 스와이프 */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
            {/* 메인 소개 카드 */}
            <div className="snap-start min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col shrink-0">
              <div className="relative h-44">
                <img
                  src={curatedCity.heroImage}
                  alt={curatedCity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                  현재 {curatedCity.travellerCount}명 여행 준비중
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text0sm font-black text-gray-900">
                    {curatedCity.subTitle}
                  </h4>
                  <button
                    onClick={() => navigate(`/city/${curatedCity.slug}/lounge`)}
                    className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 pt-1 rounded-full"
                  >
                    배낭톡 ➔
                  </button>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {curatedCity.description}
                </p>
                <div className="flex flex-warp gap-1.5 mt-1">
                  {curatedCity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 사진 갤러리 */}
            <div className="snap-start min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3 shrink-0">
              <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                {curatedCity.name} 주요 명소 만나보기
              </h4>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
                {curatedCity.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="관광지"
                    className="w-full h-20 object-cover bg-gray-100 hover:scale-105 transition-transform"
                  />
                ))}
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-center">
                여행자들이 직접 찍은 생생한 도심 사진
              </p>
            </div>

            {/* 여행 꿀팁 리스트 */}
            <div className="snap-start min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3 shrink-0">
              <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                {curatedCity.name} 여행 꿀팁
              </h4>
              <div className="flex flex-col divide-y divide-gray-100">
                {curatedCity.tips.map((tip, idx) => (
                  <div key={idx} className="py-2 flex items-center gap-3">
                    <img
                      src={tip.img}
                      alt="꿀팁"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-gray-900 truncate">
                        {tip.title}
                      </h5>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 풀 와이드 버튼 */}
          <button
            onClick={() => navigate(`/city/${curatedCity.slug}`)}
            className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-xs font-black text-gray-900 rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>{curatedCity.name} 여행정보 더 보기</span>
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>
        {/* 필수 교통패스 큐레이션 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="txt-base font-black text-gray-900">
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
                <div className="flex-1 min-w-0">
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
      </main>

      {/* 플로팅 독 및 스크롤 다운 시 나타나는 플로팅 원형 위젯 */}
      {sortedPlans.length > 0 && (
        <>
          {!isCollapsedToBubble ? (
            /* 기본 하단 플로팅 독 */
            <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-fade-in">
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
                {sortedPlans.map((plan: any, idx: number) => {
                  const isSelected = selectedPlanIndex === idx;
                  const dateRange = formatTravelDates(
                    plan.startDate,
                    plan.endDate,
                  );
                  const planDDay = calculateDDay(plan.startDate);
                  const cityImg = getCityImageFromPlan(plan.title);

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanIndex(idx)}
                      className={`snap-start min-w-[285px] max-w-[285px] rounded-3xl p-3 flex items-center justify-between cursor-pointer shadow-xl backdrop-blur-md transition-all ${
                        isSelected
                          ? "bg-[#20C997] text-white ring-2 ring-white/60"
                          : "bg-white/95 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cityImg}
                          alt="도시"
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <h4 className="font-black text-xs truncate">
                            {plan.title}
                          </h4>
                          <p
                            className={`text-[11px] font-bold mt-0.5 truncate ${
                              isSelected ? "text-teal-100" : "text-gray-500"
                            }`}
                          >
                            {planDDay} | {dateRange}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/planner/${plan.id}`);
                        }}
                        className={`ml-2 px-3 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all ${
                          isSelected
                            ? "bg-white/20 hover:bg-white text-white hover:text-teal-700 backdrop-blur-md"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        내 일정
                      </button>
                    </div>
                  );
                })}

                {/* 마지막 여행 일정 만들기 카드 */}
                <div
                  onClick={() => navigate("/create-plan")}
                  className="snap-start min-w-[210px] bg-white/95 border border-teal-200 rounded-3xl p-3 flex items-center gap-2.5 cursor-pointer shadow-xl shrink-0 hover:bg-teal-50/60 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-black shrink-0">
                    <Plus size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-gray-900">
                      여행 일정 만들기
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      새 여행지 추가
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 스크롤하면 축소되는 미니 원형 버블 위젯 */
            <div
              onClick={() => {
                setIsCollapsedToBubble(false);
              }}
              className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-white shadow-2xl border-2 border-white overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition0all flex items-center justify-center group"
            >
              <img
                src={getCityImageFromPlan(currentPlan?.title)}
                alt="플로팅 위젯"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <span className="absolute bottom-1 bg-[#20C997] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                {dDayText}
              </span>
            </div>
          )}
        </>
      )}

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
