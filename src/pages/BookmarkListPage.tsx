import { Calendar, ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backpackApi } from "../api/backpackApi";
import { useState } from "react";
import { planApi } from "../api/planApi";

const BookmarkListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { planId } = useParams();
  const currentPlanId = Number(planId) || 1;

  // 선택된 장소 ID 보관
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 체크박스 토글 핸들러
  const handleToggleSelect = (placeId: number) => {
    setSelectedIds((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId],
    );
  };

  // 일괄 추가 Mutation
  const bulkAddMutation = useMutation({
    mutationFn: async () => {
      const payload = selectedIds.map((placeId) => ({
        placeId,
        day: 1, // 기본 1일차
      }));
      // planApi에 실설한 bulk API 호출
      await planApi.addPlacesToPlanBulk(currentPlanId, payload);
    },
    onSuccess: () => {
      alert("선택한 장소들이 일정에 성공적으로 추가되었습니다!");
      navigate(`/planner/${currentPlanId}`);
    },
    onError: (err: any) => {
      alert("일정 추가 실패: " + (err.response?.data?.message || err.message));
    },
  });

  // 찜 목록 조회
  const {
    data: planItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["backpackList"],
    queryFn: backpackApi.getBackpackList,
  });

  // 찜 해제 액션
  const deleteMutation = useMutation({
    mutationFn: backpackApi.removeBookmark,
    onSuccess: () => {
      // 삭제 성공 시 캐시를 무효화 해 화면의 찜 리스트를 서버 기준으로 실시간 갱신
      queryClient.invalidateQueries({ queryKey: ["backpackList"] });
      alert("찜 목록에서 제거되었습니다.");
    },
    onError: (error: any) => {
      alert(
        "찜 해제 실패: " + (error.response?.data?.message || error.message),
      );
    },
  });

  const handleDelete = (itemId: number) => {
    if (window.confirm("이 장소를 찜에서 해제할까요?")) {
      deleteMutation.mutate(itemId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <span className="text-gray-500 font-bold">배낭 뒤지는 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <span className="text-red-500 font-bold">오류가 발생했어요 ㅠㅠ</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* 헤더 영역 */}
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => navigate(`/schedule/${planId}`)}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">
          내 여행 배낭 (ID: {currentPlanId})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-lg font-bold mb-4">
          찜한 장소 <span className="text-blue-500">{planItems.length}</span>
        </h2>

        <div className="flex flex-col gap-3">
          {planItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm font-bold">
              아직 찜해둔 장소가 없어요!
            </div>
          ) : (
            planItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center"
              >
                {/* 체크박스 영역 */}
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 shrink-0 cursor-pointer"
                />
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                  📍
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6">
        <button
          onClick={() => {
            if (selectedIds.length > 0) {
              bulkAddMutation.mutate(); // 선택한 장소가 있으면 벌크로 저장 후 이동
            } else {
              navigate(`/planner/${currentPlanId}`); // 선택한 장소가 없으면 그냥 플래너로 이동
            }
          }}
          disabled={bulkAddMutation.isPending}
          className="w-full bg-gray-900 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-all"
        >
          <Calendar size={20} />
          {selectedIds.length > 0
            ? `${selectedIds.length}개의 장소 일정에 담기`
            : "내 일정표 보러 가기"}
        </button>
      </div>
    </div>
  );
};

export default BookmarkListPage;
