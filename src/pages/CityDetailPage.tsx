import { ChevronLeft, Compass, Info, MapPin } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface CityInfo {
  title: string;
  engName: string;
  description: string;
  imageUrl: string;
  flightTime: string;
  visa: string;
  currency: string;
  recommendSeason: string;
  places: { id: number; name: string; category: string; desc: string }[];
}

const CITY_DATA: Record<string, CityInfo> = {
  도쿄: {
    title: "도쿄",
    engName: "Tokyo",
    description:
      "전통과 첨단 문명이 함께 숨 쉬는 일본의 심장부. 맛있는 음식, 감각적인 쇼핑, 눈부신 도심 야경이 매일 새롭게 펼쳐지는 아시아 최고의 메가시티입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", // 도쿄타워
    flightTime: "약 2시간 10분",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    recommendSeason: "3월 ~ 5월 (벚꽃 시즌)",
    places: [
      {
        id: 1,
        name: "도쿄 타워",
        category: "관광지",
        desc: "도쿄의 상징적인 붉은 전파탑 야경 명소",
      },
      {
        id: 2,
        name: "이치란 라멘",
        category: "맛집",
        desc: "나만의 커스텀 레시피 돈코츠 라멘 맛집",
      },
      {
        id: 3,
        name: "신주쿠 교엔",
        category: "관광지",
        desc: "도심 속 조용한 쉼터이자 아름다운 국립공원",
      },
      {
        id: 4,
        name: "시부야 스크램블 교차로",
        category: "명소",
        desc: "세계에서 가장 분주한 스크램블 횡단보도",
      },
    ],
  },
  오사카: {
    title: "오사카",
    engName: "Osaka",
    description:
      "천하의 부엌이라 불리는 식도락의 천국. 도톤보리의 화려한 네온사인과 활기찬 현지 분위기, 맛있는 타코야키와 오코노미야키가 쉼 없이 오감을 자극하는 매력 도시입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=800&q=80", // 도톤보리
    flightTime: "약 1시간 40분",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    recommendSeason: "10월 ~ 11월 (단풍 시즌)",
    places: [],
  },
  후쿠오카: {
    title: "후쿠오카",
    engName: "Fukuoka",
    description:
      "공항과 도심이 가장 가까운 최고의 접근성을 가진 힐링 여행지. 맛있는 하카타 돈코츠 라멘과 나카스 포장마차(야타이) 거리의 따스한 감성을 느낄 수 있습니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1590250555776-63e80cc0be5b?auto=format&fit=crop&w=800&q=80", // 후쿠오카 모모치 해변
    flightTime: "약 1시간 15분",
    currency: "엔화 (JPY)",
    visa: "90일 무비자",
    recommendSeason: "11월 ~ 2월 (온천 여행 최적기)",
    places: [],
  },
  삿포로: {
    title: "삿포로",
    engName: "Sapporo",
    description:
      "겨울에는 은빛 눈의 축제가 열리고 여름에는 시원한 맥주 가든이 열리는 홋카이도의 보석. 신선한 대게 요리와 징기스칸 양고기, 그리고 환상적인 설경이 기다립니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=800&q=80", // 삿포로 눈경치
    flightTime: "약 2시간 40분",
    currency: "엔화 (JPY)",
    visa: "90일 무비자",
    recommendSeason: "12월 ~ 2월 (눈축제 시즌)",
    places: [],
  },
};

const CityDetailPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();

  const cityInfo = cityName ? CITY_DATA[cityName] : null;

  if (!cityInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50">
        <p className="text-gray-500 font-bold mb-4">
          앗! 준비되지 않은 도시 정보예요 ㅜㅜ
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-blue-500/20"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 고화질 도시 대표 이미지 헤더 영역 */}
      <div className="h-[260px] relative shrink-0 overflow-hidden bg-gray-900">
        <img
          src={cityInfo.imageUrl}
          alt={cityInfo.title}
          className="w-full h-full object-cover opacity-80"
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* 상단 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white active:scale-90 transition-all border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 도시 타이틀 */}
        <div className="absolute bottom-6 left-5 text-white">
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
            {cityInfo.title}
          </h1>
          <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">
            {cityInfo.engName}
          </p>
        </div>
      </div>

      {/* 본문 소개 영역 */}
      <div className="flex-1 overflow-y-auto p-5 pb-20 flex flex-col gap-6 bg-gray-50/50">
        {/* 도시 설명 카드 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <Compass size={18} className="text-blue-500" />
            도시 스토리
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {cityInfo.description}
          </p>
        </div>

        {/* 여행 꿀팁 정보 그리드 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Info size={18} className="text-blue-500" />
            여행 기본 정보
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2 border border-gray-100/50">
              <span className="text-gray-400 font-bold">비행시간</span>
              <span className="text-gray-800 font-extrabold">
                {cityInfo.flightTime}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2 border border-gray-100/50">
              <span className="text-gray-400 font-bold">비자 요건</span>
              <span className="text-gray-800 font-extrabold">
                {cityInfo.visa}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2 border border-gray-100/50">
              <span className="text-gray-400 font-bold">사용 통화</span>
              <span className="text-gray-800 font-extrabold">
                {cityInfo.currency}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2 border border-gray-100/50">
              <span className="text-gray-400 font-bold">추천 여행 시기</span>
              <span className="text-gray-800 font-extrabold text-[11px] truncate">
                {cityInfo.recommendSeason}
              </span>
            </div>
          </div>
        </div>

        {/* 추천 명소 연동 리스트 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-900 px-1 flex items-center gap-1.5">
            <MapPin size={18} className="text-blue-500" />
            {cityInfo.title} 추천 핫플레이스
          </h2>

          {cityInfo.places.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-bold bg-white rounded-2xl border border-gray-100 shadow-sm">
              준비 중인 장소들이에요. 곧 추가될 예정입니다!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cityInfo.places.map((place) => (
                <div
                  key={place.id}
                  onClick={() => navigate(`/places/${place.id}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-between items-center active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md">
                        {place.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-800">
                        {place.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {place.desc}
                    </p>
                  </div>
                  <span className="text-gray-300 text-xs font-bold shrink-0">
                    📍 상세보기
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityDetailPage;
