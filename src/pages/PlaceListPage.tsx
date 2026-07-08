import { useQuery } from "@tanstack/react-query";
import { fetchPlaces, searchPlacesByName } from "../api/placeApi";
import { ChevronLeft, ChevronRight, Map, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

/* const MOCK_PLACES = [
  {
    id: 1,
    name: "도쿄 타워",
    desc: "도쿄의 상징. 야경 맛집",
    cat: "관광지",
    icon: "🗼",
  },
  {
    id: 2,
    name: "이치란 라멘",
    desc: "돈코츠 라멘의 근본",
    cat: "맛집",
    icon: "🍜",
  },
  {
    id: 3,
    name: "신주쿠 교엔",
    desc: "도심 속 힐링 스팟",
    cat: "자연",
    icon: "🌳",
  },
]; */

const PlaceListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const urlPageQuery = Math.max(
    0,
    parseInt(searchParams.get("page") || "1") - 1,
  );

  const [currentPage, setCurrentPage] = useState(urlPageQuery);
  const [searchInput, setSearchInput] = useState(urlSearchQuery); // URL 검색어가 있으면 초기값으로 이식
  const [activeSearch, setActiveSearch] = useState(urlSearchQuery); // URL 검색어가 있으면 초기 API 필터값으로 이식
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 카테고리 필터

  // URL의 쿼리 파라미터(검색어 혹은 페이지 번호)가 변경되면 컴포넌트 상태 실시간으로 링크
  useEffect(() => {
    setSearchInput(urlSearchQuery);
    setActiveSearch(urlSearchQuery);
    setCurrentPage(urlPageQuery);
  }, [urlSearchQuery, urlPageQuery]);

  // 페이지 전환 핸들러 함수 신설
  const handlePageChange = (newPage: number) => {
    // 주소창의 쿼리 스트링을 업데이트하여 상태를 갱신
    const params = new URLSearchParams(searchParams);
    params.set("page", (newPage + 1).toString());
    navigate(`/places?${params.toString()}`);
  };

  const pageSize = 5;

  // React Query 호출 시 queryKey에 page를 포함시켜 변경될 때 마다 자동 페칭 유도
  // 검색 키워드 유무에 따라 호출 API 스위칭
  const { data, isLoading, isError } = useQuery({
    queryKey: ["places", currentPage, activeSearch],
    queryFn: () => {
      if (activeSearch.trim()) {
        // 검색어 있으면 전체 목록 대신 검색 API 호출
        return searchPlacesByName(activeSearch.trim()).then((content) => ({
          content,
          totalPages: 1,
        }));
      }
      // 검색어 없으면 일반 페이징 API 호출
      return fetchPlaces(currentPage, pageSize);
    },
  });

  // 검색 돋보기 클릭 시 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setActiveSearch(searchInput);
  };

  // 검색 초기화
  const handleReset = () => {
    setSearchInput("");
    setActiveSearch("");
    setCurrentPage(0);
    // URL 파라미터도 지움
    navigate("/places");
  };

  if (isLoading)
    return <div className="flex justify-center mt-20">장소 로딩중...</div>;
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        정보를 가져올 수 없었습니다.
      </div>
    );

  const rawPlaces = data?.content || []; // 실제 데이터 배열
  const totalPages = data?.totalPages || 1; // 전체 페이지 수

  const places =
    selectedCategory === "전체"
      ? rawPlaces
      : rawPlaces.filter((p) => p.category === selectedCategory);

  const categories = ["전체", "관광지", "맛집", "자연", "숙소"];

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2 px-1">
          <Map className="text-blue-500" size={24} />
          추천 장소 리스트
        </h2>

        {/* 검색창 UI 영역 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="장소 이름 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={16}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold rounded-xl px-4 py-2.5 hover:bg-blue-600 active:scale-95 text-sm transition-all"
          >
            검색
          </button>
          {activeSearch && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 text-gray-700 font-bold rounded-xl px-3 py-2.5 hover:bg-gray-300 active:scale-95 text-xs transition-all"
            >
              초기화
            </button>
          )}
        </form>

        {/* 카테고리 탭 버튼 영역 */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 장소 카드 리스트 */}
        <div className="flex flex-col gap-3">
          {places.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 font-bold">
              검색 조건에 맞는 장소가 없어요 ㅠㅠ
            </div>
          ) : (
            places.map((place) => (
              <div
                key={place.id}
                onClick={() => navigate(`/places/${place.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gpa-4 items-center active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {place.imageUrl ? (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "📍"
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {place.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {place.description}
                  </p>
                  <div className="flex mt-auto">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">
                      {place.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 페이지네이션 컨트롤러 영역 */}
      {!activeSearch && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-bold text-gray-700">
            {currentPage + 1} / {totalPages || 1}
          </span>

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceListPage;
