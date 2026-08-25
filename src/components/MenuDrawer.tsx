import type React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Calendar,
  ChevronRight,
  Heart,
  HelpCircle,
  LogIn,
  LogOut,
  MapPin,
  PlusCircle,
  Search,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();

  if (!isOpen) return null;

  // 게스트 가드 헬퍼 함수
  const handleAuthenticatedAction = (targetPath: string) => {
    onClose();
    if (!isLoggedIn) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
        )
      ) {
        navigate("/login");
      }
      return;
    }
    navigate(targetPath);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[300px] bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-slide-left overflow-y-auto"
      >
        <div className="flex flex-col">
          {/* 상단 닫기 & 설정 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              TRIPLE 메뉴
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* 유저 프로필 카드 */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-gray-100">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
              {isLoggedIn ? (user?.userName || "게스트")[0] : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-base text-gray-900 truncate">
                {isLoggedIn ? `${user?.userName}님` : "로그인이 필요합니다"}
              </h3>
              <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                {isLoggedIn
                  ? user?.email || user?.userid || "일본 여행 준비 중"
                  : "나만의 일본 여행 일정을 만들어보세요"}
              </p>
            </div>
          </div>

          {/* 3대 바로가기 */}
          <div className="grid grid-cols-3 gap-2.5 py-5 border-b border-gray-100 text-center">
            <div
              onClick={() => handleAuthenticatedAction("/")}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-105 group-active:scale-95 transition-transform shadow-2xs">
                <Calendar size={20} />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-0.5">
                내 일정
              </span>
            </div>

            <div
              onClick={() => handleAuthenticatedAction("/my")}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-105 group-active:scale-95 transition-transform shadow-2xs">
                <Heart size={20} />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-0.5">
                내 저장
              </span>
            </div>

            <div
              onClick={() => handleAuthenticatedAction("/create-plan")}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-105 group-active:scale-95 transition-transform shadow-2xs">
                <Sparkles size={20} />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-0.5">
                AI 일정
              </span>
            </div>
          </div>

          {/* 6개 기능 메뉴 리스트 */}
          <div className="flex flex-col py-3 text-sm font-bold text-gray-800 divide-y divide-gray-50">
            {/* 새 일정 만들기 */}
            <div
              onClick={() => handleAuthenticatedAction("/create-plan")}
              className="py-3.5 flex justify-between items-center cursor-pointer hover:text-teal-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <PlusCircle size={18} className="text-teal-500" />
                <span>새 여행 일정 만들기</span>
              </div>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-teal-600"
              />
            </div>

            {/* 일본 교통패스 & 어트랙션 (클룩 제휴) */}
            <div
              onClick={() => {
                onClose();
                navigate("/city/tokyo/tours");
              }}
              className="py-3.5 flex justify-between. items-center cursor-pointer. hover:text-amber-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Ticket size={18} className="text-amber-500" />
                <span>일본 교통패스 (클룩)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  최대 15%
                </span>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-amber-600"
                />
              </div>
            </div>

            {/* 실시간 도시·항공 통합 검색 */}
            <div
              onClick={() => {
                onClose();
                navigate("/search");
              }}
              className="py-3.5 flex justify-between items-center cursor-pointer hover:text-blue-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Search size={18} className="text-blue-500" />
                <span>일본 도시 & 명소 검색</span>
              </div>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-blue-600"
              />
            </div>

            {/* 내 저장 장소 지도 뷰 */}
            <div
              onClick={() => handleAuthenticatedAction("/city/tokyo/map")}
              className="py-3.5 flex justify-between items-center cursor-pointer hover:text-purple-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-purple-500" />
                <span>도시별 장소 & 저장 지도</span>
              </div>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-purple-600"
              />
            </div>

            {/* 고객지원 */}
            <div
              onClick={() => {
                onClose();
                alert(
                  "TRIPLE 일본 여행 플래너 v2.0\n\n- 기술 스택: React, TailwindCSS, Zustand, React Query",
                );
              }}
              className="py-3.5 flex justify-between items-center cursor-pointer hover:text-gray-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-400" />
                <span>서비스 안내 & 앱 정보</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* 하단 로그인 / 로그아웃 버튼 */}
        <div className="pt-4 border-t border-gray-100">
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-3 rounded-2xl border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut size={15} />
              <span>로그아웃</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-xs font-black text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={15} />
              <span>로그인하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
