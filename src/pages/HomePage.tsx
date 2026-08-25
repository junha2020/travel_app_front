import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "../api/planApi";
import {
  Bell,
  Building2,
  Calendar,
  CalendarPlus,
  Car,
  ChevronRight,
  Compass,
  FileText,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Plane,
  Search,
  Settings,
  Sparkles,
  Ticket,
  TrendingDown,
  X,
} from "lucide-react";
import { AICustomizeModal } from "../components/AICustomizeModal";
import {
  getTravelStatusText,
  POPULAR_SEARCH_KEYWORDS,
  SUPPORTED_JAPAN_CITIES,
} from "../utils/travelUtils";
import { MenuDrawer } from "../components/MenuDrawer";

// 7개 퀵 카테고리 데이터
const QUICK_CATEGORIES = [
  {
    id: "flight",
    label: "항공권",
    icon: Plane,
    color: "text-sky-500 bg-sky-50",
    badge: null,
  },
  {
    id: "hotel",
    label: "숙소",
    icon: Building2,
    color: "text-teal-500 bg-teal-50",
    badge: null,
  },
  {
    id: "tour",
    label: "투어·티켓",
    icon: Ticket,
    color: "text-rose-500 bg-rose-50",
    badge: null,
  },
  {
    id: "car",
    label: "렌터카·보험",
    icon: Car,
    color: "text-purple-500 bg-purple-50",
    badge: "무료 데이터",
  },
  {
    id: "ai",
    label: "AI일정추천",
    icon: Compass,
    color: "text-blue-500 bg-blue-50",
    badge: null,
  },
  {
    id: "price",
    label: "항공 시세",
    icon: TrendingDown,
    color: "text-red-500 bg-red-50",
    badge: "최저가 알림",
  },
  {
    id: "talk",
    label: "배낭톡",
    icon: MessageCircle,
    color: "text-emerald-500 bg-emerald-50",
    badge: null,
  },
];

// 마우스/터치 드래그 스와이프 커스텀 훅
const useDragToScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      setHasMoved(true); // 5px 이상 이동 시 드래그로 판정
    }
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    ref,
    isDragging,
    hasMoved,
    events: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
    },
  };
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  // 3대 모달/드로어 상태
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  const planSectionRef = useRef<HTMLDivElement>(null);
  const [showFloatingPlan, setShowFloatingPlan] = useState(false);

  const [activeProductTab, setActivePProductTab] = useState<
    "숙소" | "투어·티켓" | "맛집" | "관광지"
  >("숙소");

  const [expandedCity, setExpandedCity] = useState<string>("tokyo");

  const quickDrag = useDragToScroll();
  const storyDrag = useDragToScroll();
  const planDrag = useDragToScroll();
  const cityPrefDrag = useDragToScroll();

  // 비로그인 유저 가드 함수
  const handleCreatePlanClick = () => {
    if (!isLoggedIn) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
        )
      ) {
        navigate("/login");
      }
      return;
    }
    setIsCalendarModalOpen(true);
  };

  useEffect(() => {
    const isAnyModalOpen =
      isCalendarModalOpen ||
      isSearchModalOpen ||
      isMenuDrawerOpen ||
      isAIModalOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCalendarModalOpen, isSearchModalOpen, isMenuDrawerOpen, isAIModalOpen]);

  // 사용자 일정 목록 조회
  const userId = user?.userid || user?.id || 0;
  const { data: userPlans = [] } = useQuery({
    queryKey: ["userPlans", userId],
    queryFn: () => planApi.getUserPlans(userId),
    enabled: !!userId,
  });

  // 종료된 여행은 홈 활성 배너에서 자동 제외
  const activePlans = userPlans.filter((p) => {
    if (!p.endDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(p.endDate);
    end.setHours(0, 0, 0, 0);
    return end >= today;
  });

  // 검색 키워드 필터링
  const filteredKeywords = searchKeyword.trim()
    ? POPULAR_SEARCH_KEYWORDS.filter((k) =>
        k.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
    : POPULAR_SEARCH_KEYWORDS;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;
    setIsSearchModalOpen(false);
    navigate(`/places?search=${encodeURIComponent(searchKeyword.trim())}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-12 select-none">
      {/* 상단 액션 바 */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <h1
            onClick={() => navigate("/")}
            className="text-lg font-black tracking-tight text-blue-600 cursor-pointer flex items-center gap-1"
          >
            TRIPLE{" "}
            <span className="text-gray-900 font-extrabold text-xs">JAPAN</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            title="검색"
          >
            <Search size={22} />
          </button>
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            title="내 여행 캘린더"
          >
            <Calendar size={22} />
          </button>
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            title="메뉴"
          >
            <Menu size={22} />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* 5대 퀵 카테고리 아이콘 그리드 */}
      <section className="px-5 pt-4 pb-2">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div
            onClick={() => alert("일본 항공권 특가 예매 서비스 준비 중입니다!")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:scale-105 transition-transform shadow-2xs">
              <Plane size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-700">항공권</span>
          </div>

          <div
            onClick={() => navigate("/places?category=숙소")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 group-hover:scale-105 transition-transform shadow-2xs">
              <Building2 size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-700">숙소</span>
          </div>

          <div
            onClick={() => navigate("/places?category=관광지")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform shadow-2xs">
              <Ticket size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-700">
              투어·티켓
            </span>
          </div>

          <div
            onClick={() => alert("일본 렌터카 & 교통패스 예약 준비 중입니다!")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group relative"
          >
            <span className="absolute -top-1 bg-purple-500 text-white text-[8px] font-extrabold px-1 rounded-full scale-90">
              교통패스
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform shadow-2xs">
              <Car size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-700">
              렌터카·교통
            </span>
          </div>

          <div
            onClick={() => setIsAIModalOpen(true)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-2xs">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-blue-600">AI일정</span>
          </div>
        </div>
      </section>

      {/* 생생 소식 스토리 피드 카드 */}
      <section className="px-5 pt-4">
        <div className="mb-3">
          <span className="text-xs font-bold text-blue-600">
            {activePlans.length > 0
              ? `${getTravelStatusText(activePlans[0]?.startDate, activePlans[0]?.endDate)} 뒤 일본 여행이 더 알차도록!`
              : "설레는 일본 여행 준비를 시작해보세요!"}
          </span>
          <h2 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">
            생생한 일본 소식을 모아왔어요
          </h2>
        </div>

        <div
          ref={storyDrag.ref}
          {...storyDrag.events}
          className="flex gap-3.5 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x min-h-[255px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* 도쿄 스토리 */}
          <div
            onClick={() => {
              if (!storyDrag.hasMoved) navigate("/city/tokyo");
            }}
            className="min-w-[170px] w-[170px] h-[240px] rounded-3xl overflow-hidden relative shadow-md shrink-0 cursor-pointer snap-start group"
          >
            <img
              src="https://images.unsplash.com/photo-1573456373835-579c408de263?q=80&w=1840&auto=format&fit=crop&w=600&q=80"
              alt="도쿄 시부야"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-between text-white">
              <div className="flex items-center gap-1.5. bg-black/30 backdrop-blur-xs rounded-full px-2. py-0.5. self-start text-[10px]">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>도쿄 에디터</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-snug">
                  '시부야 스크램블 교차로' 리뷰
                </h3>
                <p className="text-[10px] text-gray-300 mt-1">도쿄</p>
              </div>
            </div>
          </div>

          {/* 오사카 스토리 */}
          <div
            onClick={() => {
              if (!storyDrag.hasMoved) navigate("/city/osaka");
            }}
            className="min-w-[170px] w-[170px] h-[240px] rounded-3xl overflow-hidden relative shadow-md shrink-0 cursor-pointer. snap-start group"
          >
            <img
              src="https://images.unsplash.com/photo-1749498693255-f01404fe0b51?q=80&w=1285&auto=format&fit=crop&w=600&q=80"
              alt="오사카 도톤보리"
              className="w-full h-full. object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-between text-white">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs rounded-full. px-2.5 py-0.5 self-start text-[10px]">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>오사카 맛잘알</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-snug">
                  오사카 & 교토 먹방 코스
                </h3>
                <p className="text-[10px] text-gray-300 mt-1">오사카 외 1</p>
              </div>
            </div>
          </div>

          {/* 후쿠오카 스토리 */}
          <div
            onClick={() => {
              if (!storyDrag.hasMoved) navigate("/city/fukuoka");
            }}
            className="min-w-[170px] w-[170px] h-[240px] rounded-3xl overflow-hidden relative shadow-md shrink-0 cursor-pointer snap-start group"
          >
            <img
              src="https://images.unsplash.com/photo-1701819313872-fd59bad7acfa?q=80&w=987&auto=format&fit=crop&w=600&q=80"
              alt="후쿠오카"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-between text-white">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs rounded-full px-2.5 py-0.5 self-start text-[10px]">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>후쿠오카 요정</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-snug">
                  하카타 감성 라멘 투어
                </h3>
                <p className="text-[10px] text-gray-300 mt-1">후쿠오카</p>
              </div>
            </div>
          </div>

          {/* 삿포로 스토리 */}
          <div
            onClick={() => {
              if (!storyDrag.hasMoved) navigate("/city/sapporo");
            }}
            className="min-w-[170px] w-[170px] h-[240px] rounded-3xl overflow-hidden relative shadow-md shrink-0 cursor-pointer snap-start group"
          >
            <img
              src="https://images.unsplash.com/photo-1671616771884-43ace9cbe2bf?q=80&w=987&auto=format&fit=crop&w=600&q=80"
              alt="삿포로"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-between text-white">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs rounded-full px-2.5 py-0.5 self-start text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>삿포로 스노우</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-snug">
                  삿포로 & 비에이 겨울 설경
                </h3>
                <p className="text-[10px] text-gray-300 mt-1">삿포로</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 일본 8대 도시 바로가기 탭 */}
      <section className="px-5 pt-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-black text-gray-900">
            🇯🇵 떠나고 싶은 일본 도시
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {SUPPORTED_JAPAN_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => navigate(`/city/${city}`)}
              className="py-3 px-2 rounded-2xl bg-gray-50 hover:bg-blue-50/60 border border-gray-150 text-center font-extrabold text-xs text-gray-800 active:scale-95 transition-all shadow-2xs hover:text-blue-600 hover:border-blue-200"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* 다중 일정 스와이프 캐러셀 배너 */}
      <section className="px-5 pt-5">
        {userPlans.length === 0 ? (
          <div
            onClick={() => setIsCalendarModalOpen(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl p-5 text-white flex items-center justify-between cursor-pointer shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                신규 여행 준비
              </span>
              <h3 className="text-base font-extrabold mt-1">
                아직 등록된 일정이 없어요
              </h3>
              <p className="text-xs text-tea-100 mt-0.5">
                탭해서 나만의 첫 일본 여행 일정을 만들어보세요!
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <CalendarPlus size={20} />
            </div>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x">
            {/* 기존 등록된 내 일정들 중 활성화 된 일정만 */}
            {activePlans.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/planner/${p.id}`)}
                className="min-w-[90%] sm:min-w-[340px] bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 rounded-3xl p-4 text-white flex items-center justify-between cursor-pointer shadow-md shadow-teal-500/15 active:scale-[0.99] transition-all snap-center shrink-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 overflow-hidden shrink-0 border border-white/30 flex items-center justify-center font-bold text-lg">
                    ✈️
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-teal-100 font-semibold mt-0.5">
                      <span className="font-black text-white mr-1.5">
                        {getTravelStatusText(p.startDate, p.endDate)}
                      </span>
                      {p.startDate} - {p.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pl-2 border-l border-white/20 shrink-0">
                  <Calendar size={18} />
                  <span className="text-[10px] font-bold mt-0.5">내 일정</span>
                </div>
              </div>
            ))}

            {/* 맨 끝까지 스와이프하면 나타나는 신규 일정 추가 카드 */}
            <div
              onClick={() => setIsCalendarModalOpen(true)}
              className="min-w-[280px] bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-3xl p-4 flex items-center gap-3.5 cursor-pointer active:scale-95 transition-all snap-center shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
                <CalendarPlus size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-800">
                  여행 일정 만들기
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  새로운 여행지의 일정을 추가하세요
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* AI 추천 코스 목록 */}
      <section className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
            AI 추천 인기 코스
          </h2>
          <span
            onClick={() => setIsAIModalOpen(true)}
            className="text-xs font-bold text-blue-600 cursor-pointer hover:underline"
          >
            전체보기
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              id: 9999,
              title: "도쿄 3박 4일 필수 명소 코스",
              desc: "초보 여행자에게 추천하는 최적의 동선",
              img: "https://images.unsplash.com/photo-1578215560516-474d84f62ec3?q=80&w=2070&auto=format&fit=crop&w=400&q=80",
              count: 12061,
            },
            {
              id: 9998,
              title: "오사카 먹방 2박 3일 힐링 코스",
              desc: "도톤보리와 난바 맛집을 정복하는 식도록 루트",
              img: "https://images.unsplash.com/photo-1629569320448-a5504a24d384?q=80&w=2129&auto=format&fit=crop&w=400&q=80",
              count: 7421,
            },
          ].map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/recommend/${course.id}`)}
              className="bg-white rounded-2xl border border-gray-150 p-3.5 flex justify-between items-center cursor-pointer hover:shadow-xs transition-all active:scale-[0.99] gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-gray-900 truncate">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {course.desc}
                </p>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md mt-2 inline-block">
                  저장 {course.count.toLocaleString()}
                </span>
              </div>
              <img
                src={course.img}
                alt={course.title}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 여기서부터 모달 */}
      {/* 일정 생성 바텀시트 모달 */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-2xs animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up flex flex-col gap-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">일정 생성</h3>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                setIsCalendarModalOpen(false);
                navigate("/create-plan");
              }}
              className="w-full text-left py-3.5 px-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-gray-800 flex items-center justify-between transition-colors"
            >
              <span>직접 일정 만들기</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              onClick={() => {
                setIsCalendarModalOpen(false);
                setIsAIModalOpen(true);
              }}
              className="w-full text-left py-3.5 px-3 rounded-2xl hover:bg-blue-50 text-sm font-bold text-blue-600 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>AI 일정 추천받기</span>
                <Sparkles size={14} className="text-blue-500" />
              </div>
              <ChevronRight size={18} className="text-blue-400" />
            </button>
          </div>
        </div>
      )}

      {/* 전면 검색 모달 */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="p-1 text-gray-700 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="일본 도시, 명소, 숙소 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-gray-100 rounded-full py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSearchSubmit()}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3 flex-1 overflow-y-auto">
            <h4 className="text-xs font-black text-gray-500">
              🇯🇵 일본 인기 검색지
            </h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCH_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => handleSearchSubmit(kw)}
                  className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-800 rounded-full px-4 py-2 text-xs font-bold transition-colors active:scale-95 border border-gray-150"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 햄버거 메뉴 프로필 드로어 */}
      {isMenuDrawerOpen && (
        <div
          onClick={() => setIsMenuDrawerOpen(false)}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-2xs flex justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto animate-slide-left"
          >
            {/* 드로어 상단 바 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <button
                onClick={() => setIsMenuDrawerOpen(false)}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 text-gray-600">
                <button
                  onClick={() => {
                    setHasUnreadNotifications(false);
                    alert("새로운 알림이 없습니다.");
                  }}
                  className="p-1 hover:text-gray-900 relative"
                >
                  <Bell size={20} />
                  {hasUnreadNotifications && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1"></span>
                  )}
                </button>
                <button
                  onClick={() => alert("설정 페이지 준비 중입니다.")}
                  className="p-1 hover:text-gray-900"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* 사용자 프로필 섹션 */}
            <div className="py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {isLoggedIn && user ? user.nickName : "게스트"}
                </h3>
                <span
                  onClick={() => navigate("/my")}
                  className="text-xs font-semibold text-gray-400 hover:text-blue-500 cursor-pointer mt-0.5 inline-flex items-center"
                >
                  프로필 편집 <ChevronRight size={12} />
                </span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-xl font-bold text-gray-400">
                {user?.nickName ? user.nickName[0] : "👤"}
              </div>
            </div>

            {/* 활성 일정 미니 배너 */}
            {activePlans.length > 0 && (
              <div
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  navigate(`/planner/${activePlans[0].id}`);
                }}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-3.5 text-white flex items-center justify-between cursor-pointer mb-5 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black">
                    {activePlans[0].title}
                  </span>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  {getTravelStatusText(
                    activePlans[0].startDate,
                    activePlans[0].endDate,
                  )}
                </span>
              </div>
            )}

            {/* 4대 내 정보 퀵 아이콘 가이드 */}
            <div className="grid grid-col-4 gap-2 text-center py-4 border-y border-gray-100">
              <div
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  navigate("/my");
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <MapPin
                  size={22}
                  className="text-gray-700 group-hover:text-blue-600"
                />
                <span className="text-[11px] font-bold text-gray-700">
                  내 여행
                </span>
              </div>

              <div
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  navigate(
                    activePlans.length > 0
                      ? `/backpack/${activePlans[0].id}`
                      : "/my",
                  );
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <Heart
                  size={22}
                  className="text-gray-700 group-hover:text-rose-500"
                />
                <span className="text-[11px] font-bold text-gray-700">
                  내 저장
                </span>
              </div>

              <div
                onClick={() => alert("리뷰 목록 기능 준비 중입니다.")}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <MessageSquare
                  size={22}
                  className="text-gray-700 group-hover:text-amber-500"
                />
                <span className="text-[11px] font-bold text-gray-700">
                  내 리뷰
                </span>
              </div>

              <div
                onClick={() => alert("내 여행기 기능 준비 중입니다.")}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <FileText
                  size={22}
                  className="text-gray-700 group-hover:text-purple-500"
                />
                <span className="text-[11px] font-bold text-gray-700">
                  내 여행기
                </span>
              </div>
            </div>

            {/* 세부 메뉴 리스트 */}
            <div className="flex flex-col gap-1 py-4 text-sm font-bold text-gray-700">
              <div
                onClick={() => alert("예약 내역이 없습니다.")}
                className="py-3 flex justify-between items-center cursor-pointer hover:text-blue-600"
              >
                <span>내 예약</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
              <div
                onClick={() => alert("보유 중인 쿠폰이 없습니다.")}
                className="py-3 flex justify-between items-center cursor-pointer hover:text-blue-600"
              >
                <div className="flex items-center gap-1.5">
                  <span>쿠폰함</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                </div>
                <span className="text-xs text-blue-600 font-extrabold flex items-center">
                  0 <ChevronRight size={16} className="text-gray-300 ml-1" />
                </span>
              </div>
              <div
                onClick={() => alert("여행자 클럽에 가입해보세요!")}
                className="py-3 flex justify-between items-center cursor-pointer hover:text-blue-600"
              >
                <span>여행자 클럽</span>
                <span className="text-xs text-blue-600 font-extrabold flex items-center">
                  가입 내역 없음{" "}
                  <ChevronRight size={16} className="text-gray-300 ml-1" />
                </span>
              </div>
              <div
                onClick={() => alert("오프라인 가이드북 다운로드")}
                className="py-3 flex justify-between items-center cursor-pointer hover:text-blue-600"
              >
                <span>오프라인 가이드</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>

            {/* 로그아웃 / 로그인 버튼 */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    //logout();
                    setIsMenuDrawerOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50"
                >
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  로그인하기
                </button>
              )}
            </div>
          </div>
        </div>
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
