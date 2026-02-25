import React from "react";
import { Search } from "lucide-react";

const HomePage = () => {
  return (
    <div className="p-5 flex flex-col gap-6 bg-white min-h-full">
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
          어디로 떠나시나요?
        </h1>
        <p className="text-gray-500 text-sm">
          트리플 감성으로 완벽한 여행을 준비하세요
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="도시나 장소를 검색해보세요"
          className="w-full bg-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      </div>
      <div>
        <h2 className="text-lg font-bold mb-3 text-gray-900">
          🔥 요즘 뜨는 여행지
        </h2>
        <div className="flex gap-3 overflow-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {["도쿄", "오사카", "후쿠오카", "삿포로"].map((city, idx) => (
            <div
              key={idx}
              className="min-w-[100px] h-24 bg-blue-50/50 rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-100/50 active:scale-95 transition-transform cursor-pointer"
            >
              {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
