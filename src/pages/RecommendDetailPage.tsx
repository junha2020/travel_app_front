import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planApi } from "../api/planApi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Calendar, ChevronLeft, Compass, Share2 } from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 숫자가 적힌 예쁜 커스텀 지도 핀
const createNumberedPin = (number: number) => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items; center; justify-content: center;">
        <!-- 지도 물방울 핀 모양 배경 -->
        <div style="position: absolute; width: 100%; height: 100%; background-color: #3B82F6; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);"></div>
        <!-- 핀 내부의 순서 숫자 -->
        <span style="position: relative; z-index: 10; color: white; font-weight: 900; font-size: 11px; margin-top: -2px;">${number}</span>
      </div>
    `,
    className: "custom-numbered-pin",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const getTravelDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const RecommendDetailPage = () => {
  const { recommendId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();

  const [activeDay, setActiveDay] = useState(1);

  // 추천 코스 원본 일정 상세 정보 긁어오기
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendPlan", recommendId],
    queryFn: () => planApi.getPlanById(Number(recommendId)),
    enabled: !!recommendId,
  });

  // 내 플래너로 통째로 가져오기
  const copyMutation = useMutation({
    mutationFn: () =>
      planApi.copyRecommendPlan(Number(recommendId), user!.id || user!.userid),
    onSuccess: (newPlanId) => {
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
      alert("내 일정표로 성공적으로 가져왔습니다! 지금 확인해 보세요.");
      navigate(`/planner/${newPlanId}`);
    },
    onError: (err: any) => {
      alert("일정 복사 실패: " + (err.response?.data?.message || err.message));
    },
  });

  const handleCopyPlan = () => {
    if (!isLoggedIn || !user) {
      alert("로그인이 필요한 서비스입니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
    if (window.confirm("이 추천 코스를 복사해 내 일정으로 가져올까요?")) {
      copyMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <span className="text-gray-500 font-bold">추천 일정 분석중... ⏳</span>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-6 text-center">
        <span className="text-red-500 font-bold mb-4">
          추천 일정을 불러오는 데 실패했습니다.
        </span>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl text-sm"
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  const allPlaces = plan.places || [];
  const filteredPlaces = allPlaces
    .filter((p) => p.day === activeDay)
    .sort((a, b) => a.sequence - b.sequence);

  const totalDays =
    plan.startDate && plan.endDate
      ? getTravelDays(plan.startDate, plan.endDate)
      : 1;

  // 지도 선 연결을 위한 위경도 패스 구성
  const linePath = filteredPlaces.map((item) => [
    item.latitude,
    item.longitude,
  ]);
  const defaultCenter = linePath.length > 0 ? linePath[0] : [35.6895, 139.6917];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-base font-bold ml-2 text-blue-600">
            AI 추천 가이드
          </span>
        </div>
        <button
          onClick={() => alert("링크가 복사되었습니다")}
          className="text-gray-500 p-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="h-[28vh] w-full shrink-0 border-b border-gray-200 z-10 relative">
        <MapContainer
          center={defaultCenter as [number, number]}
          center-set={defaultCenter}
          center-changed={defaultCenter}
          center-update={defaultCenter}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyringt">OpenStreetMap</a>'
            url="https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPlaces.map((item, index) => (
            <Marker
              key={item.planPlaceId}
              position={[item.latitude, item.longitude]}
              icon={createNumberedPin(index + 1)}
            >
              <Popup>
                <div className="text-xs text-gray-900 font-bold">
                  {index + 1}. {item.name}
                </div>
              </Popup>
            </Marker>
          ))}
          {linePath.length > 1 && (
            <Polyline
              positions={linePath as [number, number][]}
              color="#3B82F6"
              weight={3}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>

      {/* 일정 코스 목록 및 하단 플로팅 버튼 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
        {/* 일차 탭 */}
        <div className="flex bg-white border-b border-gray-200 shrink-0 px-2 pt-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              className={`flex-1 min-w-[70px] pb-3 text-sm font-bold transition-all ${activeDay === dayNum ? "text-blue-500 border-b-2 border-blue-500 font-extrabold" : "text-gray-400 hover:text-gray-600"}`}
            >
              {dayNum}일차
            </button>
          ))}
        </div>

        {/* 장소 타임라인 피드 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-28">
          <div className="bg-white rounded-2xl border border-gray-150 p-4 mb-2 flex items-start gap-3">
            <Compass
              className="text-blue=500 shrink-0 mt-0.5 animate-spin-slow"
              size={20}
            />
            <div>
              <span className="text-xs font-bold text-blue-600 block">
                AI 테마 분석 코스
              </span>
              <span className="text-sm font-extrabold text-gray-900 mt-1 block">
                "{plan.title}"
              </span>
              <span className="text-xs text-gray-500 mt-1 leading-relaxed block">
                이 코스는 효율적인 동선 분석을 기반으로 최적화된 하루 예상
                소요시간 5시간짜리 최적 여행 코스입니다.
              </span>
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm font-bold">
              이 날짜에는 추천 명소가 없습니다.
            </div>
          ) : (
            filteredPlaces.map((item, index) => (
              <div key={item.planPlaceId} className="flex items-stretch gap-3">
                <div className="flex flex-col items-center w-6 shrink-0 mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>
                  {index !== filteredPlaces.length - 1 && (
                    <div className="w-0.5 bg-gray-200 h-full mt-1"></div>
                  )}
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h4 className="font-bold text-sm text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      {item.address}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md shrink-0">
                    📍 {index + 1}번째 코스
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 하단 고정: 플로팅 복사 버튼 */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent p-4 pb-6 pt-10 z-20">
          <button
            onClick={handleCopyPlan}
            disabled={copyMutation.isPending}
            className="w-full bg-blue-500 text-white font-extrabold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 hover:bg-blue-600 disabled:bg-gray-400"
          >
            <Calendar size={20} />
            {copyMutation.isPending
              ? "내 플래너로 가죠오는 중..."
              : "이 일정 내 플래너로 가져오기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendDetailPage;
