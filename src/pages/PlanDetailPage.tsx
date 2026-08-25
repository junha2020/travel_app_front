// TODO: 전체 다시 작성하기

import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planApi, type UpdatePlaceSequenceDTO } from "../api/planApi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";

const createCategoryPin = (num: number, category?: string): L.DivIcon => {
  let bgGradient = "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)";
  let shadowColor = "rgba(126, 34, 206, 0.4)";

  if (category?.includes("숙소")) {
    bgGradient = "linear-gradient(135deg, #10b981 0%, #047857 100%)";
    shadowColor = "rgba(4, 120, 87, 0.4)";
  } else if (category?.includes("맛집")) {
    bgGradient = "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%";
    shadowColor = "rgba(185, 28, 28, 0.4)";
  }

  const html = `
  <div style="
    background: ${bgGradient};
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
    border: 2.5px solid white;
    box-shadow: 0 4px 10px ${shadowColor};
  ">${num}</div>
  `;
  return L.divIcon({
    html,
    className: "custom-category-pin",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// 시작 날짜와 종료 날짜 사이의 총 일자 수 구하는 함수
const getTravelDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const getTravelDistanceBadge = (placeA: any, placeB: any): string => {
  if (!placeA || !placeB) return "500m";
  const lat1 = Number(placeA.latitude);
  const lon1 = Number(placeA.longitude);
  const lat2 = Number(placeB.latitude);
  const lon2 = Number(placeB.longitude);

  if (!lat1 || !lon1 || !lat2 || !lon2) return "500m";

  // 위도/경도 하버사인 직선거리 계산
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`; // 1km 이하는 미터
  }
  return `${distanceKm.toFixed(1)}km`; // 1km 이상은 킬로미터
};

const getDayFormattedDate = (
  startDateStr?: string,
  dayOffset: number = 1,
): string => {
  if (!startDateStr) return "";
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return "";

  const targetDate = new Date(start);
  targetDate.setDate(start.getDate() + (dayOffset - 1));

  const month = targetDate.getMonth() + 1;
  const date = targetDate.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
    targetDate.getDay()
  ];

  return `${month}.${date}/${dayOfWeek}`;
};

const getWeatherEmoji = (code?: number): string => {
  if (code === undefined || code === null) return "☁️";
  if (code-- - 0) return "☀️"; // 맑음
  if (code >= 1 && code <= 3) return "🌤️"; // 구름 조금
  if (code >= 45 && code <= 48) return "🌫️"; // 안개
  if (code >= 51 && code <= 67) return "🌧️"; // 비
  if (code >= 71 && code <= 77) return "❄️"; // 눈
  if (code >= 80 && code <= 82) return "🌦️"; // 소나기
  if (code >= 95) return "⛈️"; // 뇌우
  return "☁️";
};

const PlanDetailPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const queryClient = useQueryClient();
  const currentPlanId = Number(planId);

  const [activeDay, setActiveDay] = useState<number>(1);
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);

  // 일정 전체 상세 정보 조회
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plan", currentPlanId],
    queryFn: () => planApi.getPlanById(currentPlanId),
    enabled: !isNaN(currentPlanId),
  });

  const currentItems = plan?.places || [];

  // 총 여행 일자 계산
  const totalDays =
    plan?.startDate && plan?.endDate
      ? getTravelDays(plan.startDate, plan.endDate)
      : 1;

  // 현재 선택한 Day의 장소들만 필터링하여 순서대로 정렬
  const filteredPlaces = currentItems
    .filter((item) => item.day === activeDay)
    .sort((a, b) => a.sequence - b.sequence);

  // 도시 좌표 기반 7일 실시간 날씨 조회 훅 (Open-Meteo)
  const cityLat = currentItems[0]?.latitude || 35.6812;
  const cityLon = currentItems[0]?.longitude || 139.7671;

  const { data: weatherData } = useQuery({
    queryKey: ["weatherForecast", cityLat, cityLon],
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&daily=weathercode&timezone=auto`,
      );
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
  });

  // 타임라인 스크롤 -> 지도 날짜에 맞게 변경
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const containerTop = container.scrollTop;

    let currentVisibleDay = activeDay;
    dayRefs.current.forEach((element, day) => {
      if (element) {
        const elementTop = element.offsetTop - container.offsetTop;
        if (containerTop >= elementTop - 80) {
          currentVisibleDay = day;
        }
      }
    });

    if (currentVisibleDay !== activeDay) {
      setActiveDay(currentVisibleDay);
    }
  };

  // 순서/일차 변경 Mutation
  const updateSequenceMutation = useMutation({
    mutationFn: (data: UpdatePlaceSequenceDTO[]) =>
      planApi.updatePlacesSequence(currentPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", currentPlanId] });
    },
    onError: (err) => {
      console.error("순서 업데이트에 실패했습니다: ", err);
      alert("순서 정렬 저장에 실패했습니다");
    },
  });

  // 일정 전체 삭제 Mutation
  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => planApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
      navigate("/my");
    },
    onError: (err) => {
      console.error("일정 삭제 오류:", err);
      alert("일정 삭제에 실패했습니다");
    },
  });

  // 일정 내 개별 장소 삭제 Mutation
  const removePlaceMutation = useMutation({
    mutationFn: (planPlaceId: number) =>
      planApi.removePlaceFromPlan(currentPlanId, planPlaceId),
    onSuccess: () => {
      // 해당 일정 상세 정보 캐시 무효화 -> 자동 화면 리로드
      queryClient.invalidateQueries({ queryKey: ["plan", currentPlanId] });
      alert("일정에서 장소가 삭제되었습니다.");
    },
    onError: (err: any) => {
      alert("장소 삭제 실패: " + (err.response?.data?.message || err.message));
    },
  });

  const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      if (center[0] && center[1]) {
        map.flyTo(center, map.getZoom(), { animate: true, duration: 0.8 });
      }
    }, [center, map]);
    return null;
  };

  const handleDeletePlan = () => {
    if (window.confirm("정말 이 일정을 통째로 삭제하시겠습니까?")) {
      deletePlanMutation.mutate(currentPlanId);
    }
  };

  const handleRemovePlace = (planPlaceId: number) => {
    if (window.confirm("이 장소를 일정에서 제외할까요?")) {
      removePlaceMutation.mutate(planPlaceId);
    }
  };

  // 장소들 중 첫 번째 장소의 좌표를 지도의 중심 좌표로 설정 (장소 없으면 도쿄역을 기본 중심으로 세팅)
  const centerPosition: [number, number] =
    filteredPlaces.length > 0
      ? [
          Number(filteredPlaces[0].latitude),
          Number(filteredPlaces[0].longitude),
        ]
      : [35.681236, 139.767125]; // 도쿄역 좌표

  // 이동 경로용 좌표 배열 가공
  const linePath: [number, number][] = filteredPlaces.map((item) => [
    Number(item.latitude),
    Number(item.longitude),
  ]);

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    sourceDay: number,
  ) => {
    e.dataTransfer.setData("sourceIndex", String(index));
    e.dataTransfer.setData("sourceDay", String(sourceDay));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropToDay = (
    e: React.DragEvent,
    targetDay: number,
    targetIndex?: number,
  ) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData("sourceIndex"));
    const sourceDay = Number(e.dataTransfer.getData("sourceDay"));

    if (isNaN(sourceIndex) || isNaN(sourceDay)) return;

    // 전체 리스트 복사
    const updatedLList = [...currentItems];

    // 출발지 일차와 인덱스에 맞는 아이템 찾아 도려내기
    const sourceItems = updatedLList
      .filter((item) => item.day === sourceDay)
      .sort((a, b) => a.sequence - b.sequence);
    const draggedItem = sourceItems[sourceIndex];

    if (!draggedItem) return;

    // 전체 리스트에서 해당 아이템 임시 격리
    const listWithoutDragged = updatedLList.filter(
      (item) => item.planPlaceId !== draggedItem.planPlaceId,
    );

    // 목적지 일차에 속한 기존 아이템들 추출
    const targetDayItems = listWithoutDragged
      .filter((item) => item.day === targetDay)
      .sort((a, b) => a.sequence - b.sequence);

    // 목적지 일차 내 원하는 인덱스로 드래그 아이템 이식 및 day 속성 변경
    draggedItem.day = targetDay;
    const insertAt =
      targetIndex !== undefined ? targetIndex : targetDayItems.length;
    targetDayItems.splice(insertAt, 0, draggedItem);

    // 목적지 일차의 sequence 재정렬
    const reorderedTargetDay = targetDayItems.map((item, idx) => ({
      ...item,
      sequence: idx + 1,
    }));

    // 출발지 일차(목적지와 다를 경우)의 sequence 재정렬
    let reorderedSourceDay: any[] = [];
    if (sourceDay !== targetDay) {
      const remainingSourceDay = listWithoutDragged
        .filter((item) => item.day === sourceDay)
        .sort((a, b) => a.sequence - b.sequence);
      reorderedSourceDay = remainingSourceDay.map((item, idx) => ({
        ...item,
        sequence: idx + 1,
      }));
    }

    // 변경되지 않은 나머지 일차 데이터 추출
    const otherDays = listWithoutDragged.filter(
      (item) => item.day !== sourceDay && item.day !== targetDay,
    );

    // 최종 통합 리스트 및 페이로드 구성
    const mergedList = [
      ...reorderedTargetDay,
      ...reorderedSourceDay,
      ...otherDays,
    ];

    const finalPayload = mergedList.map((item) => ({
      planPlaceId: item.planPlaceId,
      day: item.day,
      sequence: item.sequence,
    }));

    updateSequenceMutation.mutate(finalPayload);
  };

  // 장소의 일차(Day)를 변경하는 핸들러
  const handleDayChange = (planPlaceId: number, targetDay: number) => {
    // 대상 장소 제외한 현재 Day 목록 재정렬
    const remainingInCurrentDay = filteredPlaces
      .filter((item) => item.planPlaceId !== planPlaceId)
      .map((item, idx) => ({
        planPlaceId: item.planPlaceId,
        day: item.day,
        sequence: idx + 1,
      }));

    // 대상 장소가 들어갈 타겟 Day 장소들 목록 정렬 및 마지막에 배치
    const targetDayPlaces = currentItems
      .filter((item) => item.day === targetDay)
      .sort((a, b) => a.sequence - b.sequence);

    const movedItemPayload = {
      planPlaceId: planPlaceId,
      day: targetDay,
      sequence: targetDayPlaces.length + 1,
    };

    // 나머지 다른 일차들의 장소 정보 가공
    const otherDayPlaces = currentItems
      .filter((item) => item.day !== activeDay && item.day !== targetDay)
      .map((item) => ({
        planPlaceId: item.planPlaceId,
        day: item.day,
        sequence: item.sequence,
      }));

    const finalPayload = [
      ...remainingInCurrentDay,
      ...otherDayPlaces,
      movedItemPayload,
      ...targetDayPlaces.map((item, idx) => ({
        planPlaceId: item.planPlaceId,
        day: item.day,
        sequence: idx + 1,
      })),
    ];

    // 중복 제거 및 페이로드 빌드
    const payloadMap = new Map<number, UpdatePlaceSequenceDTO>();
    finalPayload.forEach((item) => {
      payloadMap.set(item.planPlaceId, item);
    });

    updateSequenceMutation.mutate(Array.from(payloadMap.values()));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center text-gray-500 font-medium">
          일정을 열심히 불러오는 중이에요... 잠시만 기다려주세요! ⏳
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-6 text-center">
        <div className="text-gray-500 font-medium mb-4">
          일정을 불러오는 도중에 문제가 생겼습니다
        </div>
        <button
          onClick={() => navigate("/my")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          내 일정 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 z-20 shadow-xs">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/my`)}
            className="text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-base font-bold ml-2">{plan.title}</span>
        </div>
        {/* 우측 기능 버튼 세트 (배낭 보관함 & 일정 삭제) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/backpack/${planId}`)}
            className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="내 여행 배낭 (찜 목록) 열기"
          >
            <Briefcase size={20} />
          </button>
          <button
            onClick={handleDeletePlan}
            className="text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="일정 삭제"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* 지도 영역 (접기/펼치기 지원) */}
      <div
        className={`bg-gray-200 relative shrink-0 border-b border-gray-300 overflow-hidden z-10 transition-all duration-300 ${
          isMapExpanded ? "h-[35%]" : "h-0 border-none"
        }`}
      >
        <MapContainer
          center={centerPosition}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <MapCenterUpdater center={centerPosition} />

          {/* 무료 오픈스트리트맵 타일 레이어 연동 */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 장소들의 마커 및 툴팁 */}
          {filteredPlaces.map((place, index) => (
            <Marker
              key={place.planPlaceId}
              position={[Number(place.latitude), Number(place.longitude)]}
              icon={createCategoryPin(index + 1, place.category)}
            >
              <Popup>
                <div className="text-xs text-gray-900 font-bold">
                  {index + 1}, {place.name}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 장소 간의 선 연결 */}
          {linePath.length > 1 && (
            <Polyline
              positions={linePath}
              color="#3B82F6"
              weight={3}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>

      {/* 지도 접기/펼치기 토글 바 버튼 */}
      <div className="flex justify-center -mt-3 mb-0.5 z-20 relative select-none">
        <button
          onClick={() => setIsMapExpanded((prev) => !prev)}
          className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-3 py-0.5 shadow-sm text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
          title={isMapExpanded ? "지도 접기" : "지도 펼치기"}
        >
          {isMapExpanded ? (
            <>
              <ChevronUp size={13} />
              <span className="text-[10px]">지도 접기</span>
            </>
          ) : (
            <>
              <ChevronDown size={13} />
              <span className="text-[10px]">지도 펼치기</span>
            </>
          )}
        </button>
      </div>

      {/* 일정 편집 타임라인 영역 */}
      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 pb-24 select-none bg-white relative"
      >
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
          const dayPlaces = currentItems
            .filter((item) => item.day === dayNum)
            .sort((a, b) => a.sequence - b.sequence);

          // 해당 일차의 실시간 날씨 코드 추출
          const weatherCode = weatherData?.daily?.weathercode?.[dayNum - 1];
          const weatherIcon = getWeatherEmoji(weatherCode);

          return (
            <div
              key={dayNum}
              ref={(el) => {
                if (el) dayRefs.current.set(dayNum, el);
                else dayRefs.current.delete(dayNum);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => handleDropToDay(e, dayNum)}
              className="flex flex-col gap-3 min-h-[100px] h-auto shrink-0 relative"
            >
              {/* 상단 고정 스티키 헤더 */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 flex justify-between items-center px-1 py-2.5 border-b border-gray-100 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-gray-900">
                    day {dayNum}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {getDayFormattedDate(plan.startDate, dayNum)}
                  </span>
                  <span className="text-sm" title="실시간 날씨">
                    {weatherIcon}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  담긴 장소 {dayPlaces.length}개
                </span>
              </div>

              {/* 해당 일자의 장소 목록 */}
              {dayPlaces.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 font-medium border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  여기로 장소를 드래그해서 담아보세요!
                </div>
              ) : (
                <div className="flex flex-col">
                  {dayPlaces.map((item, index) => {
                    const isStay = item.category?.includes("숙소");
                    const isDining = item.category?.includes("맛집");
                    const pinBgColor = isStay
                      ? "bg-emerald-500"
                      : isDining
                        ? "bg-rose-500"
                        : "bg-purple-600";

                    return (
                      <div key={item.planPlaceId} className="flex flex-col">
                        {/* 장소 카드 본체 */}
                        <div
                          draggable
                          onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                            handleDragStart(e, index, dayNum)
                          }
                          onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                            e.stopPropagation();
                            handleDropToDay(e, dayNum, index);
                          }}
                          className="flex items-center gap-3.5 drag-item cursor-move active:scale-[0.99] transition-transform shrink-0 group"
                        >
                          {/* 좌측 카테고리 번호 핀 */}
                          <div className="flex justify-center items-center w-8 shrink-0 select-none">
                            <div
                              className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs ${pinBgColor}
                              `}
                            >
                              {index + 1}
                            </div>
                          </div>

                          {/* 우측 미니멀 플랫 화이트 카드 */}
                          <div className="flex-1 bg-white hover:bg-gray-50/80 rounded-2xl border border-gray-150 p-4 flex items-center justify-between gap-3 min-w-0 shadow-2xs transition-all">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <GripVertical
                                  size={15}
                                  className="text-gray-300 shrink-0 cursor-grab active:cursor-grabbing"
                                />
                                <h4 className="font-bold text-sm text-gray-900 truncate tracking-tight">
                                  {item.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 ml-5">
                                <p className="text-xs text-gray-400 truncate">
                                  {item.category || "관광지"}{" "}
                                  {item.address ? `· ${item.address}` : ""}
                                </p>
                              </div>
                            </div>

                            {/* 액션 컨트롤 버튼 */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <select
                                onMouseDown={(
                                  e: React.MouseEvent<HTMLSelectElement>,
                                ) => e.stopPropagation()}
                                value={item.day}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>,
                                ) =>
                                  handleDayChange(
                                    item.planPlaceId,
                                    Number(e.target.value),
                                  )
                                }
                                className="text-[11px] font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-600 active:scale-95 transition-transform"
                              >
                                {Array.from(
                                  { length: totalDays },
                                  (_, idx: number) => idx + 1,
                                ).map((d: number) => (
                                  <option key={d} value={d}>
                                    {d}일차
                                  </option>
                                ))}
                              </select>

                              <button
                                onMouseDown={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => e.stopPropagation()}
                                onClick={() =>
                                  handleRemovePlace(item.planPlaceId)
                                }
                                className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors active:scale-95"
                                title="일정 제외"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 장소와 다음 장소 사이 세로선 & 거리 알약 뱃지 */}
                        {index !== dayPlaces.length - 1 && (
                          <div className="flex items-center gap-3.5 my-1.5 select-none">
                            <div className="w-8 flex flex-col items-center justify-center shrink-0">
                              <div className="w-0.5 bg-gray-200 h-2"></div>
                              <div className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[9px] font-bold text-gray-600 shadow-2xs whitespace-nowrap">
                                {getTravelDistanceBadge(
                                  item,
                                  dayPlaces[index + 1],
                                )}
                              </div>
                              <div className="w-0.5 bg-gray-200 h-2"></div>
                            </div>
                            <div className="flex-1"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 매 일차 하단 '장소 추가' & '메모 추가' 2대 버튼 세트 */}
              <div className="grid grid-cols-2 gap-3 mt-3 px-1 select-none">
                <button
                  onClick={() =>
                    navigate(`/paces?planId=${planId}&day=${dayNum}`)
                  }
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3.5 text-center text-sm font-bold text-gray-800 shadow-2xs active:scale-[0.98] transition-all"
                >
                  장소 추가
                </button>
                <button
                  onClick={() => {
                    const memo = window.prompt(
                      `${dayNum}일차에 추가할 메모를 입력하세요:`,
                    );
                    if (memo) {
                      alert(`[${dayNum}일차 메모]: ${memo}\n(저장되었습니다)`);
                    }
                  }}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3.5 text-center text-sm font-bold text-gray-800 shadow-2xs active:scale-[0.98] transition-all"
                >
                  메모 추가
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanDetailPage;
