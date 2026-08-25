import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getCityInfo,
  getCitySlug,
  POPULAR_SEARCH_KEYWORDS,
  SUPPORTED_JAPAN_CITIES,
} from "../utils/travelUtils";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  MapPin,
  Plane,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { JAPAN_TOP_PASSES } from "../data/japanPassData";

const SEARCH_CATEGORIES = [
  { id: "all", label: "추천" },
  { id: "guide", label: "가이드" },
  { id: "tour", label: "관광지" },
  { id: "food", label: "맛집" },
  { id: "hotel", label: "숙소" },
  { id: "magazine", label: "매거진" },
  { id: "trip", label: "여행기" },
  { id: "pass", label: "투어·티켓" },
  { id: "city", label: "도시" },
] as const;

type SearchCategory = (typeof SEARCH_CATEGORIES)[number]["id"];

const MOCK_SEARCH_DATA = {
  // 1. 가이드 (4종)
  guides: [
    {
      id: "g1",
      city: "도쿄",
      title: "도쿄로 떠나는 단풍 여행",
      subtitle: "도쿄 가을 여행의 묘미로 손꼽히는 단풍. 형형색색의 정원 코스",
      imageUrl:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "g2",
      city: "도쿄",
      title: "사진작가 추천, 도쿄의 숨은 포토 스팟",
      subtitle: "도쿄 7곳을 소개한다. 야네센, 닛포리 근처의 레트로 골목",
      imageUrl:
        "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "g3",
      city: "도쿄",
      title: "현지 감성 가득, 쿠라마에 탐방하기",
      subtitle: "도쿄 대표 명소인 아사쿠사와 가까운 작은 동네, 감성 카페 거리",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "g4",
      city: "도쿄",
      title: "아사쿠사 레트로 맛집 BEST",
      subtitle: "도쿄 동부에 위치한 지역인 아사쿠사는 일명 '시타마치' 감성",
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
    },
  ],

  // 2. 관광지 (4종)
  places: [
    {
      id: "p1",
      city: "도쿄",
      name: "닌텐도 도쿄",
      category: "쇼핑 · 도쿄",
      description: "시부야 파스코 6층에 위치한 공식 닌텐도 스토어",
      imageUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "p2",
      city: "도쿄",
      name: "아코메야 도쿄",
      category: "쇼핑 · 시부야(도쿄)",
      description: "엄선된 쌀과 일본 전역의 조미료, 식기 편집샵",
      imageUrl:
        "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "p3",
      city: "도쿄",
      name: "피그먼트 도쿄",
      category: "쇼핑 · 도쿄",
      description: "4,500가지 색상의 전통 안료와 붓을 전시한 갤러리 샵",
      imageUrl:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "p4",
      city: "도쿄",
      name: "FC라이브 도쿄",
      category: "테마/체험 · 신주쿠(도쿄)",
      description: "도쿄 도심에서 즐기는 라이브 공연 및 K-컬처 체험관",
      imageUrl:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80",
    },
  ],

  // 3. 맛집 (4종)
  restaurants: [
    {
      id: "r1",
      city: "도쿄",
      name: "도쿄 바나나즈 도쿄 역점",
      category: "카페/디저트 · 도쿄",
      description: "도쿄역 기념품 1위 부드러운 바나나 커스터드 빵",
      imageUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "r2",
      city: "도쿄",
      name: "하나고요미 도쿄",
      category: "음식점 · 긴자(도쿄)",
      description: "제철 식재료를 활용한 정갈한 긴자식 일본 가정식 가이세키",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "r3",
      city: "도쿄",
      name: "캔버스 도쿄",
      category: "카페/디저트 · 시부야(도쿄)",
      description: "히로오 골목의 감각적인 화이트톤 플랫화이트 & 도넛 카페",
      imageUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "r4",
      city: "도쿄",
      name: "도쿄 멘쓰단",
      category: "음식점 · 신주쿠(도쿄)",
      description: "신주쿠에서 맛보는 쫄깃한 수타 사누키 우동과 갓 튀긴 튀김",
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
    },
  ],

  // 4. 숙소 (4종)
  hotels: [
    {
      id: "h1",
      city: "도쿄",
      name: "아만 도쿄",
      category: "5성급 · 긴자(도쿄)",
      description: "오테마치 타워 최상층의 압도적인 도심 전망 럭셔리 호텔",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "h2",
      city: "도쿄",
      name: "카사 도쿄",
      category: "3성급 · 신주쿠(도쿄)",
      description: "신주쿠역 도보 5분 가성비 최고의 모던 비즈니스 호텔",
      imageUrl:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "h3",
      city: "도쿄",
      name: "라나 도쿄",
      category: "3성급 · 도쿄",
      description: "깔끔하고 아늑한 도쿄 도심 속 힐링 부티크 호텔",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "h4",
      city: "도쿄",
      name: "오쿠라 도쿄",
      category: "5성급 · 롯폰기(도쿄)",
      description: "일본 전통의 품격과 현대적 럭셔리가 어우러진 최고급 호텔",
      imageUrl:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80",
    },
  ],

  // 5. 매거진 (4종)
  magazines: [
    {
      id: "m1",
      city: "도쿄",
      title: "가성비 현지 체험 일본 사우나 여행",
      subtitle: "일본의 문화 집결지 도쿄의 감성 사우나 & 대욕장 탐방기",
      imageUrl:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "m2",
      city: "도쿄",
      title: "지금 일본에 간다면 놓치지 말아야 할 OOO",
      subtitle: "① 도쿄 ② 오사카 & 교토 ③ 후쿠오카 ④ 나고야 필수 꿀팁",
      imageUrl:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "m3",
      city: "도쿄",
      title: "도쿄에서 한 시간, 소도시 당일치기 여행지",
      subtitle: "도쿄에서 한 시간 남짓 걸리는 가마쿠라, 에노시마 바다 여행",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "m4",
      city: "도쿄",
      title: "지금 가장 저렴해요! 하루빨리 가야 할 해외 여행지",
      subtitle: "1위 도쿄! 한국인 여행객에게 가장 부담 없는 특가 노선 총정리",
      imageUrl:
        "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=200&q=80",
    },
  ],

  // 6. 여행기 (4종)
  trips: [
    {
      id: "t1",
      city: "도쿄",
      title: "🌈맛집투어 꼼데투어 ☀️",
      subtitle: "도쿄 거주 에디터가 알려주는 카페 & 숨은 맛집 모아모아 리스트",
      imageUrl:
        "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "t2",
      city: "도쿄",
      title: "3박4일 도쿄/가마쿠라 혼자여행 맛집 총정리",
      subtitle: "도쿄 3박4일 동안 식비에만 투자한 사람이 추천하는 도쿄 찐맛집",
      imageUrl:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "t3",
      city: "도쿄",
      title: "알차게 다녀온 첫 도쿄여행",
      subtitle: "도쿄 정말 알차디 알찼던 일본 도쿄여행 4박5일 코스",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "t4",
      city: "도쿄",
      title: "🇯🇵 8월 말 4박 5일 도쿄여행 🇯🇵",
      subtitle: "도쿄 · 2026.08.21 - 2026.08.25 ✈️ 인천 > 도쿄 나리타",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80",
    },
  ],
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 검색 상태 관리
  const initialQuery = searchParams.get("query") || "";
  const initialCity = searchParams.get("city") || "도쿄";

  const [selectedCityTag, setSelectedCityTag] = useState<string | null>(
    initialCity,
  );
  const [searchText, setSearchText] = useState<string>(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);

  const targetCityName = selectedCityTag || "도쿄";
  const cityInfo = getCityInfo(targetCityName);

  // 실시간 연관 검색어 필터링
  const autocompleteSuggestions = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return [];

    const citySuggestions = SUPPORTED_JAPAN_CITIES.filter((c) =>
      c.toLowerCase().includes(query),
    ).map((city) => ({
      type: "city",
      name: city,
      subText: `${city}(일본)`,
      hasHomeButton: true,
      slug: getCitySlug(city),
    }));

    const keywordSuggestions = POPULAR_SEARCH_KEYWORDS.filter(
      (k) =>
        k.toLowerCase().includes(query) &&
        !SUPPORTED_JAPAN_CITIES.includes(k as any),
    ).map((kw) => ({
      type: "keyword",
      name: kw,
      subText: `${targetCityName} 인기 장소`,
      hasHomeButton: false,
      slug: "",
    }));

    return [...citySuggestions, ...keywordSuggestions];
  }, [searchText, targetCityName]);

  // 검색어 입력 시 하이라이트 텍스트 렌더링 헬퍼
  const renderHighlightedText = (fullText: string, highlightQuery: string) => {
    if (!highlightQuery.trim()) return fullText;
    const parts = fullText.split(new RegExp(`(${highlightQuery})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightQuery.toLowerCase() ? (
            <span key={i} className="text-blue-500 font-black">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  const handleSelectCityTag = (cityName: string) => {
    setSelectedCityTag(cityName);
    setSearchText("");
    setIsTypingMode(false);
  };

  const handleSearchSubmit = (keyword?: string) => {
    if (keyword !== undefined) setSearchText(keyword);
    setIsTypingMode(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white select-none pb-12">
      {/* 검색창 상단 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-150 px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-800"
          >
            <ArrowLeft size={22} />
          </button>

          {/* 검색창 컨테이너 */}
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            {/* 선택된 도시 스마트 태그 칩 */}
            {selectedCityTag && (
              <span className="bg-white text-blue-600 border border-blue-200 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 mr-2 shadow-2xs">
                <span>{selectedCityTag}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCityTag(null);
                  }}
                  className="hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setIsTypingMode(true);
              }}
              onFocus={() => {
                if (searchText.trim()) setIsTypingMode(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder={
                selectedCityTag ? "검색어 입력" : "일본 도시, 명소, 숙소 검색"
              }
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
            />

            {searchText && (
              <button
                onClick={() => {
                  setSearchText("");
                  setIsTypingMode(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 mr-1"
              >
                <X size={16} />
              </button>
            )}

            <button
              onClick={() => handleSearchSubmit()}
              className="text-gray-700 hover:text-blue-600"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* 9대 카테고리 가로 스크롤 탭 바 */}
        {!isTypingMode && (
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-3 pb-1 -mx4 px-4">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white font-black shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* 실시간 연관 검색어 자동완성 뷰 */}
      {isTypingMode && searchText.trim() ? (
        <div className="flex flex-col p-4 divide-y divide-gray-100">
          {autocompleteSuggestions.length > 0 ? (
            autocompleteSuggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === "city") {
                    handleSelectCityTag(item.name);
                  } else {
                    handleSearchSubmit(item.name);
                  }
                }}
                className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-150 flex items-center justify-center">
                    {item.type === "city" ? (
                      <img
                        src={getCityInfo(item.name).imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MapPin size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">
                      {renderHighlightedText(item.name, searchText)}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.subText}
                    </p>
                  </div>
                </div>

                {item.hasHomeButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/city/${item.slug}`);
                    }}
                    className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    여행 홈
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              일치하는 실시간 연관 검색어가 없습니다.
            </div>
          )}
        </div>
      ) : (
        /* 통합 검색 결과 뷰 */
        <main className="p-4 flex flex-col gap-6">
          {/* 도시 바로가기 카드 + 4개 퀵 메뉴 */}
          {(activeCategory === "all" || activeCategory === "city") && (
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={cityInfo.imageUrl}
                    alt={targetCityName}
                    className="w-13 h-13 rounded-full object-cover border border-gray-100 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-base font-black text-gray-900">
                      {targetCityName}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold">일본</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/city/${getCitySlug(targetCityName)}`)
                  }
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-2xs"
                >
                  여행 홈
                </button>
              </div>

              {/* 퀵 메뉴 4개 */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-center">
                <div
                  onClick={() => alert(`${targetCityName} 항공권 검색`)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <Plane
                    size={22}
                    className="text-gray-700 group-hover:text-sky-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    항공권
                  </span>
                </div>
                <div
                  onClick={() =>
                    navigate(
                      `/places?category=hotel&search=${encodeURIComponent(targetCityName)}`,
                    )
                  }
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <Building2
                    size={22}
                    className="text-gray-700 group-hover:text-teal-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-gray-700">숙소</span>
                </div>
                <div
                  onClick={() =>
                    navigate(`/city/${getCitySlug(targetCityName)}/tours}`)
                  }
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <Ticket
                    size={22}
                    className="text-gray-700 group-hover:text-amber-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    투어·티켓
                  </span>
                </div>
                <div
                  onClick={() => alert(`${targetCityName} 인기 여행지 목록`)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <Plane
                    size={22}
                    className="text-gray-700 group-hover:text-purple-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    여행기
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 추천 항공권 카드 */}
          {(activeCategory === "all" || activeCategory === "city") && (
            <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-900">
                  추천 항공권
                </h4>
                <span
                  onClick={() => alert("항공권 전체보기")}
                  className="text-xs font-bold text-blue-600 flex items-center cursor-pointer"
                >
                  더보기 <ChevronRight size={14} />
                </span>
              </div>

              {/* TODO: 나중에 이 부분 실제 데이터로 치환 */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    165,000원
                  </h3>
                  <p className="text-xs text-gray-600 font-bold mt-0.5">
                    인천 ICN - 나리타 NRT (왕복)
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    2026.09.15 - 2026.09.23
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-600 text-sm shadow-2xs">
                  ✈️
                </div>
              </div>
            </div>
          )}

          {/* 가이드 */}
          {(activeCategory === "all" || activeCategory === "guide") && (
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-black text-gray-900">가이드</h3>
              <div className="flex flex-col divide-y- divide-gray-100">
                {MOCK_SEARCH_DATA.guides.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(`/city/${getCitySlug(targetCityName)}/guide`)
                    }
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  navigate(`/city/${getCitySlug(targetCityName)}/guide`)
                }
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                가이드 검색결과 더보기
              </button>
            </div>
          )}

          {/* 관광지 */}
          {(activeCategory === "all" || activeCategory === "tour") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="tex-base font-black text-gray-900">관광지</h3>
              <div className="flex flex-col divide-y- divide-gray-100">
                {MOCK_SEARCH_DATA.places.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(
                        `/city/${getCitySlug(targetCityName)}/places?type=tour`,
                      )
                    }
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {item.category}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/city/${getCitySlug(targetCityName)}/places?type=tour`,
                  )
                }
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                관광지 검색결과 더보기
              </button>
            </div>
          )}

          {/* 맛집 */}
          {(activeCategory === "all" || activeCategory === "food") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-base font-black text-gray-900">맛집</h3>
              <div className="flex flex-col divide-y divide-gray-100">
                {MOCK_SEARCH_DATA.restaurants.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(
                        `/city/${getCitySlug(targetCityName)}/places?type=restaurant`,
                      )
                    }
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {item.category}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/city/${getCitySlug(targetCityName)}/places?type=restaurant`,
                  )
                }
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                맛집 검색결과 더보기
              </button>
            </div>
          )}

          {/* 숙소 */}
          {(activeCategory === "all" || activeCategory === "hotel") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-base font-black text-gray-900">숙소</h3>
              <div className="flex flex-col divide-y divide-gray-100">
                {MOCK_SEARCH_DATA.hotels.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      alert(`[${item.name}] 숙소 상세 페이지 (준비 중)`)
                    }
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {item.category}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert("숙소 검색결과 더보기")}
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                숙소 검색결과 더보기
              </button>
            </div>
          )}

          {/* 매거진 */}
          {(activeCategory === "all" || activeCategory === "magazine") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-base font-black text-gray-900">매거진</h3>
              <div className="flex flex-col divide-y divide-gray-100">
                {MOCK_SEARCH_DATA.magazines.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => alert(`[${item.title}] 매거진 읽기`)}
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert("매거진 검색결과 전체보기")}
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                매거진 검색결과 더보기
              </button>
            </div>
          )}

          {/* 여행기 */}
          {(activeCategory === "all" || activeCategory === "trip") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-base font-black text-gray-900">여행기</h3>
              <div className="flex flex-col divide-y divide-gray-100">
                {MOCK_SEARCH_DATA.trips.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => alert(`[${item.title}] 여행기 읽기`)}
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert("여행기 검색결과 전체보기")}
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                여행기 검색결과 더보기
              </button>
            </div>
          )}

          {/* 투어·티켓 */}
          {(activeCategory === "all" || activeCategory === "pass") && (
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-base font-black text-gray-900">투어·티켓</h3>
              <div className="flex flex-col divide-y divide-gray-100">
                {JAPAN_TOP_PASSES.slice(0, 4).map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => window.open(pass.bookingUrl, "_blank")}
                    className="py-3 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-1 transition-colors"
                  >
                    <img
                      src={pass.imageUrl}
                      alt={pass.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">
                        {pass.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {pass.category} · {pass.city}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs font-black">
                        <span className="text-rose-500 font-extrabold">
                          {pass.discountRate}
                        </span>
                        <span className="text-gray-900">
                          {pass.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  navigate(`/city/${getCitySlug(targetCityName)}/tours`)
                }
                className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs mt-1"
              >
                투어·티켓 검색결과 더보기
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default SearchPage;
