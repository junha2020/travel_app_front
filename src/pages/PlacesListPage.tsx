import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "../api/placeApi";

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  location: string;
}

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
    <div className="bg-white min-h-screen pb-20">
      <header className="px-5 py-6">
        <h1 className="text-2xl font-bold text-gray-900">어디로 떠나시나요?</h1>
        <p className="text-gray-500 mt-1">
          지금 인기 있는 여행지들을 모아봤어요.
        </p>
      </header>
      {/* 장소 리스트 */}
      <section className="px-5 space-y-8">
        {places?.map((place) => (
          <div key={places.id} className="group cursor-pointer">
            {/* 이미지 */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-sm bord border-gary-100">
              <img
                src={
                  place.imageUrl ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
                }
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* 이미지 위 오버레이 */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
                ⭐ {place.rating}
              </div>
            </div>
            {/* 정보 */}
            <div className="mt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {place.category} · {place.location}
                  </p>
                </div>
              </div>
              {/* 리뷰 */}
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>리뷰 {place.reviewCount}개</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-blue-500 font-medium">
                  실시간 인기 급상승
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
      {/* 하단 플로팅 버튼 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
          지도로 보기
        </button>
      </div>
    </div>
  );
};

export default PlacesListPage;
