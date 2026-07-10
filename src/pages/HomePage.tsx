import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUPPORTED_CITIES = ["도쿄", "오사카", "후쿠오카", "삿포로"];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) return;

    const matchedCity = SUPPORTED_CITIES.find(
      (city) => keyword.includes(city) || city.includes(keyword),
    );

    if (matchedCity) {
      navigate(`/city/${matchedCity}`);
    } else {
      navigate(`places?search=${encodeURIComponent(keyword)}`);
    }
  };

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

      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="도시나 장소를 검색해보세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full bg-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      </form>
      <div>
        <h2 className="text-lg font-bold mb-3 text-gray-900">
          🔥 요즘 뜨는 여행지
        </h2>
        <div className="flex gap-3 overflow-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {["도쿄", "오사카", "후쿠오카", "삿포로"].map((city, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/city/${city}`)}
              className="min-w-[100px] h-24 bg-blue-50/50 rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-100/50 active:scale-95 transition-transform cursor-pointer"
            >
              {city}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-1.5">
          AI 추천 코스
        </h2>
        <div className="flex flex-col gap-3.5">
          {[
            {
              id: 1,
              title: "도쿄 3박 4일 추천 코스",
              desc: "초보 여행자에게 추천하는 최적의 코스",
              img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
              count: 12061,
            },
            {
              id: 2,
              title: "오사카 먹방 2박 3일 코스",
              desc: "천하의 부엌에서 즐기는 식도락 루트",
              img: "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=400&q=80",
              count: 7421,
            },
          ].map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/recommend/${course.id}`)} // 추천 코스 상세 페이지로 이동
              className="bg-white rounded-2xl border border-gray-150 p-3.5 flex justify-between items-center cursor-pointer hover:shadow-md transition-all active:scale-[0.99] gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-gray-900 truncate">
                  {course.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 truncate">
                  {course.desc}
                </p>
                <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-md mt-3 inline-block">
                  🔥 저장 {course.count.toLocaleString()}
                </span>
              </div>
              <img
                src={course.img}
                alt={course.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
