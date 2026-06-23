import { Calendar, ChevronLeft, MapPin, Plus, Star, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaceDetail } from "../hooks/usePlaces";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "../api/planApi";

const PlaceDetailPage = () => {
  const Maps = useNavigate();

  const { id } = useParams();
  const placeId = Number(id);

  const { data: place, isLoading, isError } = usePlaceDetail(placeId);

  const { user } = useAuthStore();

  const { data: myPlans = [] } = useQuery({
    queryKey: ["userPlans", user?.id || user?.userid],
    queryFn: () => planApi.getUserPlans(user?.id || user?.userid || 0),
    enabled: !!(user?.id || user?.userid),
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddPlace = async (planId: number) => {
    if (!place) return;

    try {
      await planApi.addPlaceToPlan(planId, {
        placeId: Number(place.id),
        day: 1,
      });

      alert("추가되었습니다.");
      setIsSheetOpen(false);
      Maps(`/planner/${planId}`);
    } catch (error) {
      console.error("장소 추가 에러:", error);
      alert("장소를 일정에 추가하는 데 실패했습니다.");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">로딩 중...</div>
    );
  if (isError || !place)
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        장소를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => Maps("/places")}
        className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>
      {/* 이미지 영역 */}
      <div className="h-64 bg-blue-100 flex items-center justify-center shrink-0">
        {/* 사진 있으면 띄우고, 없으면 다른거 띄우기 */}
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">❌</span>
        )}
      </div>
      {/* 상세 정보 */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
            {place.category}
          </span>
          <div className="flex items-center text-sm font-bold text-gray-700">
            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
            {place.rating}{" "}
            <span className="text-gray-400 font-normal ml-1">
              ({place.reviews || 0})
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{place.name}</h1>
        <p className="flex items-center text-sm text-gray-500 mb-6">
          <MapPin size={16} className="mr-1" /> {place.address}
        </p>
        <div className="h-px bg-gray-100 w-full mb-6"></div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">장소 소개</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {place.description}
        </p>
      </div>

      {/* 하단 찜하기 버튼 */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setIsSheetOpen(true)}
          className="w-full bg-blue-500 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Plus size={20} />내 일정에 담기
        </button>
      </div>
      {/* 모달 영역 시작 */}
      {isSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* 배경 까맣게 */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsSheetOpen(false)}
          />

          {/* 밑에서 올라오는 녀석 */}
          <div className="relative bg-white rounded-t-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-200 pb-8">
            {/* 타이틀 & 닫기 버튼 */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                어느 일정에 담을까요?
              </h3>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-gray-400 hover:text-gray-900 p-1"
              >
                <X size={24} />
              </button>
            </div>
            {/* 새로운 일정 만들기 버튼 */}
            <button
              onClick={() =>
                Maps("/create-plan", {
                  state: {
                    placeId: place.id,
                    placeName: place.name,
                  },
                })
              }
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">
                  새로운 일정 만들기
                </span>
                <span className="text-xs text-gray-500">
                  새 여행을 계획하고 담아보세요
                </span>
              </div>
            </button>

            {/* 기존 내 일정 리스트 */}
            <div className="max-h-[35vh] overflow-y-auto flex flex-col gap-2 mt-2">
              <p className="text-xs font-bold text-gray-400 mb-1 px-1">
                내 여행 일정
              </p>
              {myPlans && myPlans.length > 0 ? (
                myPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleAddPlace(plan.id)}
                    className="flex flex-col p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-left transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="font-bold text-gray-900">
                      {plan.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} /> {plan.startDate} - {plan.endDate}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-400">
                  등록된 일정이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetailPage;
