import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, X, CalendarIcon, MapPin } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { planApi } from "../api/planApi";
import { useQueryClient } from "@tanstack/react-query";

const JAPAN_CITIES = [
  {
    name: "도쿄",
    subText: "도쿄, 하코네, 요코하마, 가마쿠라",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "오사카",
    subText: "오사카, 교토, 고베, 나라",
    imageUrl:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "후쿠오카",
    subText: "후쿠오카, 유후인, 벳푸, 기타큐슈",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "나고야",
    subText: "나고야, 다카야마, 시라카와고, 게로",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "삿포로",
    subText: "삿포로, 하코다테, 오타루, 비에이, 노보리베츠",
    imageUrl:
      "https://images.unsplash.com/photo-1671616771884-43ace9cbe2bf?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "오키나와",
    subText: "오키나와, 이시가키, 미야코지마",
    imageUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "다카마쓰",
    subText: "다카마쓰, 나오시마, 쇼도시마, 고토히라",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "마쓰야마",
    subText: "마쓰야마, 도고온천, 우치코, 오즈",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80",
  },
];

// 📌 3단계: 누구와 & 여행 스타일 칩 (Create_Plan_3.PNG 싱크)
const COMPANION_OPTIONS = [
  "혼자",
  "친구와",
  "연인과",
  "배우자와",
  "아이와",
  "부모님과",
  "기타",
];

const STYLE_OPTIONS = [
  "체험·액티비티",
  "SNS 핫플레이스",
  "자연과 함께",
  "유명 관광지는 필수",
  "여유롭게 힐링",
  "문화·예술·역사",
  "여행지 느낌 물씬",
  "쇼핑은 열정적으로",
  "관광보다 먹방",
];

// 몇일 여행인지 텍스트를 반환하는 동적 계산 함수
const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return "날짜를 선택해주세요";
  const startDateObj = new Date(start);
  const endDateObj = new Date(end);
  const diffTime = endDateObj.getTime() - startDateObj.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "날짜를 다시 확인해주세요";
  if (diffDays === 0) return "당일치기";
  return `${diffDays}박 ${diffDays + 1}일`;
};

const PlanCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  // 넘어온 state 보따리 해체
  const { placeId, placeName } =
    (location.state as { placeId?: number; placeName?: string }) || {};

  const { user, isLoggedIn } = useAuthStore();

  // 단계 상태
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 1단계
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // 2단계
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-07");

  // 3단계
  const [companion, setCompanion] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // 도시 선택 & 토글 취소 헬퍼
  const handleCityToggle = (cityName: string) => {
    setSelectedCity((prev) => (prev === cityName ? null : cityName));
  };

  // 동행자 선택 & 토글 취소 헬퍼
  const handleCompanionToggle = (comp: string) => {
    setCompanion((prev) => (prev === comp ? null : comp));
  };

  // 스타일 멀티 선택 토글
  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  // 날짜 계산 결고
  const durationText = calculateDuration(startDate, endDate);
  const isDateValid =
    !durationText.includes("확인") && !durationText.includes("선택");

  const handleFinalSubmit = async () => {
    if (!isLoggedIn || !user) {
      alert("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
      navigate("/login");
      return;
    }

    if (!selectedCity) {
      alert("여행할 도시를 선택해 주세요.");
      setStep(1);
      return;
    }

    setIsLoading(true);

    try {
      // 폼 제출 시 title, startDate, endDate, userId: user.id 조합
      const userId = user.id || user.userid;
      const finalTitle = `${selectedCity} ${companion ? `${companion} ` : ""}여행`;

      const newPlan = await planApi.createPlan({
        title: finalTitle,
        startDate: startDate,
        endDate: endDate,
        userId: userId,
      });

      // 함께 넘어온 장소가 있으면 1일차에 추가
      if (placeId) {
        await planApi.addPlaceToPlan(newPlan.id, {
          placeId: Number(placeId),
          day: 1,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
      queryClient.invalidateQueries({ queryKey: ["cityPlans"] });

      alert("여행 일정이 성공적으로 생성되었습니다. 플래너로 이동합니다.");
      navigate(`/planner/${newPlan.id}`);
    } catch (error) {
      console.error("일정 생성 에러:", error);
      alert("일정 생성 중 문제가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = JAPAN_CITIES.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.subText.includes(searchQuery) ||
      searchQuery === "",
  );

  return (
    <div className="flex flex-col min-h-screen bg-white select-none max-w-md mx-auto relative overflow-hidden">
      {/* Step 1: 도시 선택 */}
      {step === 1 && (
        <div className="flex flex-col h-screen">
          {/* 상단 검색 헤더 */}
          <header className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-150 sticky top-0 bg-white z-30 shadow-2xs">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={22} className="text-gray-900" />
            </button>
            <div className="flex-1 flex items-center justify-between bg-gray-100 px-3.5 py-2.5 rounded-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="일본 여행, 어디로 가세요?"
                className="w-full text-sm font-extrabold text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
              />
              <Search size={18} className="text-gray-500 shrink-0 ml-1.5" />
            </div>
          </header>

          {/* 장소에서 타고 왔을 때 알림 배너 */}
          {placeName && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mx-4 mt-3 flex items-center gap-2.5 shadow-2xs">
              <MapPin size={16} className="text-blue-600 shrink-0" />
              <p className="text-xs font-black text-blue-900 truncate">
                <span className="underline decoration-blue-400 font-extrabold">
                  [{placeName}]
                </span>{" "}
                장소가 1일차에 자동 추가됩니다!
              </p>
            </div>
          )}

          {/* 도시 목록 본문 */}
          <main className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-gray-900">
                일본 주요 여행지
              </h3>
              <span className="text-[11px] font-bold text-blue-600">
                8개 도시 지원
              </span>
            </div>

            <div className="flex flex-col divide-y divide-gray-100">
              {filteredCities.map((city) => {
                const isSelected = selectedCity === city.name;
                return (
                  <div
                    key={city.name}
                    onClick={() => handleCityToggle(city.name)}
                    className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-gray-50 rounded-2xl px-1.5 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-13 h-13 rounded-full object-cover shrink-0 bg-gray-100 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-black text-gray-900">
                          {city.name}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                          {city.subText}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "선택됨 ✓" : "선택"}
                    </button>
                  </div>
                );
              })}
            </div>
          </main>

          {/* 하단 플로팅 CTA 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-150 z-30">
            <button
              onClick={() => {
                if (!selectedCity) {
                  alert("도시를 먼저 선택해 주세요.");
                  return;
                }
                setStep(2);
              }}
              disabled={!selectedCity}
              className={`w-full py-4 rounded-2xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 ${
                selectedCity
                  ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>
                {selectedCity
                  ? `${selectedCity} 선택 완료 (다음 ➔)`
                  : "최소 1개 도시 선택"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 여행일정 등록 */}
      {step === 2 && (
        <div className="flex flex-col h-screen">
          {/* 상단 닫기 */}
          <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-30">
            <button
              onClick={() => setStep(1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} className="text-gray-900" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto px-5 pt-2 pb-28 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                여행일정 등록
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1.5">
                일정에 따른 날씨예보, 여행 정보를 알려드립니다.
              </p>
            </div>

            {/* 날짜 빠른 선택 폼 */}
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 flex items-center gap-1.5">
                  <CalendarIcon size={16} /> 2026년 9월 일정 선택
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    isDateValid
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : "text-rose-500 bg-rose-50 border-rose-200"
                  }`}
                >
                  {durationText}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-gray-600">
                    출발일
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white text-xs font-bold px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-gray-600">
                    도착일
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white text-xs font-bold px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 캡슐형 기간 프리뷰 */}
              <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-xs font-black text-blue-900">
                    {startDate} ~ {endDate}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-700">
                  날씨 예보 연동
                </span>
              </div>
            </div>
          </main>

          {/* 하단 플로팅 CTA 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blue-md border-t border-gray-150 z-30">
            <button
              onClick={() => setStep(3)}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>날짜 선택 완료 (여행 스타일 선택 ➔)</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 여행 스타일 */}
      {step === 3 && (
        <div className="flex flex-col h-screen">
          {/* 상단 뒤로가기 */}
          <header className="px-4 py-3 flex items-center sticky top-0 bg-white z-30">
            <button
              onClick={() => setStep(2)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto px-5 pt-2 pb-32 flex flex-col gap-6">
            <h2 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
              어떤 스타일의
              <br />
              여행을 할 계획인가요?
            </h2>

            {/* 누구와 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-black text-gray-900">누구와</h3>
              <div className="flex flex-wrap gap-2">
                {COMPANION_OPTIONS.map((c) => {
                  const isSelected = companion === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleCompanionToggle(c)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white font-black shadow-2xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 여행 스타일 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-black text-gray-900">여행 스타일</h3>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white font-black shadow-2xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* 하단 완료 & 다음에 하기 액션 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-150 z-30 flex flex-col gap-2.5">
            <button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "일정 등록 중..." : "완료"}</span>
            </button>

            <button
              onClick={handleFinalSubmit}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 underline text-center cursor-pointer py-1"
            >
              다음에 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCreatePage;
