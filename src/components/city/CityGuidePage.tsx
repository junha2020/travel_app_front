import React, { useState } from "react";
import { getCityInfo } from "../../utils/travelUtils";
import { useParams } from "react-router-dom";

const GUIDE_SUB_TABS = ["준비", "정보", "관광", "맛집"] as const;

const CityGuideTab: React.FC = () => {
  const { cityName: citySlug } = useParams<{ cityName: string }>();
  const [subTab, setSubTab] = useState<(typeof GUIDE_SUB_TABS)[number]>("정보");

  const cityInfo = getCityInfo(citySlug || "tokyo");
  const targetCityName = cityInfo.title;

  return (
    <div className="flex flex-col">
      {/* 상단 4개 서브 탭 */}
      <div className="flex border-b border-gray-200 bg-white sticky top-[89px] z-20">
        {GUIDE_SUB_TABS.map((tab) => {
          const isActive = subTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`flex-1 py-3 text-xs font-extrabold text-center transition-colors relative ${
                isActive
                  ? "text-blue-600 font-black"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* 서브탭 1: 정보 */}
        {subTab === "정보" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-black text-gray-900">도시정보</h3>
            {[
              {
                title: `${targetCityName} 기초 정보`,
                desc: `${targetCityName}가 처음이라면 꼭 알아둬야 할 정보 모음 (${cityInfo.flightTime} / ${cityInfo.voltage})`,
                reviews: 146,
                saves: "5,191",
                img: cityInfo.imageUrl,
              },
              {
                title: `월별로 알아보는 ${targetCityName} 날씨`,
                desc: `여행 최적기: ${cityInfo.recommendSeason}`,
                reviews: 110,
                saves: "2,290",
                img: cityInfo.imageUrl,
              },
              {
                title: `${targetCityName} 에디터 현지 꿀팁`,
                desc: cityInfo.tips[0] || `${targetCityName} 여행 필수 팁`,
                reviews: 26,
                saves: "1,718",
                img: cityInfo.imageUrl,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-4 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex-1 pr-3">
                  <h4 className="text-sm font-extrabold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {item.desc}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5 font-bold">
                    리뷰 {item.reviews} · 저장 {item.saves}
                  </p>
                </div>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityGuideTab;
