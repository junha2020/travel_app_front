import { ChevronLeft, GripVertical, Trash, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planApi, type UpdatePlaceSequenceDTO } from "../api/planApi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import React, { useRef, useState } from "react";

const createNumberedPin = (num: number) => {
  const pinColor = "#3B82F6";

  const svgHtml = `
  <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- 핀 외각 뾰적한 물방울 형태 -->
    <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${pinColor}"/>
    <!-- 내부 번호가 들어갈 흰색 원형 배경 -->
    <circle cx="16" cy="16" r="11" fill="white" />
    <!-- 중앙 정렬 텍스트 -->
    <text x="16" y="20" fill="${pinColor}" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${num}</text>
  </svg>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-numbered-pin",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// 시작 날짜와 종료 날짜 사이의 총 일자 수 구하는 함수
const getTravelDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const PlanDetailPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const queryClient = useQueryClient();
  const currentPlanId = Number(planId);

  const [activeDay, setActiveDay] = useState<number>(1);
  const dragItemIndex = useRef<number | null>(null);

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

  // 순서/일차 변경 Mutation
  const updateSequenceMutation = useMutation({
    mutationFn: (data: UpdatePlaceSequenceDTO[]) =>
      planApi.updatePlacesSequence(currentPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", currentPlanId] });
    },
    onError: (err) => {
      console.error("순서 업데이트에 실패했습니다: ", err);
      alert("순서 정렬 저장에 실패했습니다 ㅠㅠ");
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
      alert("일정 삭제에 실패했어 ㅠㅠ");
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
          일정을 불러오는 도중에 문제가 생겼어요 ㅠㅠ
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

  const currentItems = plan.places || [];

  // 총 여행 일자 계산
  const totalDays =
    plan.startDate && plan.endDate
      ? getTravelDays(plan.startDate, plan.endDate)
      : 1;

  // 현재 선택한 Day의 장소들만 필터링하여 순서대로 정렬
  const filteredPlaces = currentItems
    .filter((item) => item.day === activeDay)
    .sort((a, b) => a.sequence - b.sequence);

  // 지도 시각화에 쓰일 유효한 위경도 필터링
  const validPlaces = currentItems.filter(
    (item) =>
      item.latitude !== null &&
      item.latitude !== undefined &&
      item.longitude !== null &&
      item.longitude !== undefined &&
      !isNaN(Number(item.latitude)) &&
      !isNaN(Number(item.longitude)),
  );

  // 장소들 중 첫 번째 장소의 좌표를 지도의 중심 좌표로 설정 (장소 없으면 도쿄역을 기본 중심으로 세팅)
  const centerPosition: [number, number] =
    validPlaces.length > 0
      ? [Number(currentItems[0].latitude), Number(currentItems[0].longitude)]
      : [35.681236, 139.767125]; // 도쿄역 좌표

  // 이동 경로용 좌표 배열 가공
  const linePath: [number, number][] = validPlaces.map((item) => [
    Number(item.latitude),
    Number(item.longitude),
  ]);

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (dragItemIndex.current === null || dragItemIndex.current === dropIndex)
      return;

    // 현재 Day의 리스트 복사 후 요소 위치 변경
    const updatedList = [...filteredPlaces];
    const [draggedItem] = updatedList.splice(dragItemIndex.current, 1);
    updatedList.splice(dropIndex, 0, draggedItem);

    // 변경된 리스트의 sequence 번호 재할당
    const reorderedList = updatedList.map((index, idx) => ({
      planPlaceId: item.planPlaceId,
      day: item.day,
      sequence: idx + 1,
    }));

    // 다른 Day에 있는 장소들의 순서도 유지하기 위해 병합
    const otherDaysList = currentItems
      .filter((item) => item.day !== activeDay)
      .map((item) => ({
        planPlaceId: item.planPlaceId,
        day: item.day,
        sequence: item.sequence,
      }));

    const finalPayload = [...reorderedList, ...otherDaysList];
    updateSequenceMutation.mutate(finalPayload);

    dragItemIndex.current = null;
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
        planPlaceId: planPlaceId,
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

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white shrink-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/backpack/${planId}`)}
            className="text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-base font-bold ml-2">
            {plan.title} (ID: {planId})
          </span>
        </div>
        <button
          onClick={handleDeletePlan}
          className="text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="일정 삭제"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="h-[35%] bg-gray-200 relative shrink-0 border-b border-gray-300 overflow-hidden z-10">
        <MapContainer
          center={centerPosition}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          {/* 무료 오픈스트리트맵 타일 레이어 연동 */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 장소들의 마커 및 툴팁 렌더링 */}
          {validPlaces.map((item, index) => (
            <Marker
              key={item.planPlaceId || item.placeId}
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

      {/* 일정 편집 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* 동적 Day 탭 */}
        <div className="flex bg-white border-b border-gray-200 shrink-0 px-2 pt-2 overflow-x auto">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              className={`flex-1 min-w-[70px] pb-3 text-sm font-bold transition-all ${
                activeDay === dayNum
                  ? "text-blue-500 border-b-2 border-blue-500 font-extrabold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Day {dayNum}
            </button>
          ))}
        </div>

        {/* 일정 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-20">
          {currentItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm font-bold">
              아직 {activeDay} 담긴 장소가 없어요 ㅠㅠ
            </div>
          ) : (
            currentItems.map((item, index) => (
              <div
                key={item.planPlaceId}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className="flex items-stretch gap-3 drag-item transition-transform active:scale-[0.98]"
              >
                <div className="flex flex-col items-center w-6 shrink-0 mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  {index !== filteredPlaces.length - 1 && (
                    <div className="w-0.5 bg-gray-200 h-full mt-1"></div>
                  )}
                </div>

                {/* 장소 카드 */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <GripVertical
                      size={20}
                      className="text-gray-300 cursor-grab active:cursor-grabbing shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {item.address}
                      </p>
                    </div>
                  </div>

                  {/* 컨트롤러 (일차 이동 셀렉트박스 및 삭제 버튼) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* 모바일 최적화용 Day 변경 Select Box */}
                    <select
                      value={item.day}
                      onChange={(e) =>
                        handleDayChange(
                          item.planPlaceId,
                          Number(e.target.value),
                        )
                      }
                      className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-gray-50 font-semibold text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map(
                        (dayNum) => (
                          <option key={dayNum} value={dayNum}>
                            {dayNum}일차
                          </option>
                        ),
                      )}
                    </select>

                    <button
                      onClick={() => handleRemovePlace(item.planPlaceId)}
                      disabled={removePlaceMutation.isPending}
                      className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                      title="장소 일정 제외"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;
