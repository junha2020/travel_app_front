import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "../api/placeApi";
import { Map } from "lucide-react";

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  location: string;
}

const MOCK_PLACES = [
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
];

const PlacesListPage = () => {
  const {
    data: places,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
  });

  if (isLoading)
    return <div className="flex justify-center mt-20">장소 로딩중...</div>;
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        정보를 가져올 수 없었습니다.
      </div>
    );

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2 px-1">
        <Map className="text-blue-500" size={24} />
        추천 장소 리스트
      </h2>

      <div className="flex flex-col gap-3">
        {MOCK_PLACES.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
              {place.icon}
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {place.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                {place.desc}
              </p>
              <div className="flex mt-auto">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">
                  {place.cat}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesListPage;
