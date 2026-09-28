import { ArrowUpDown, Calendar, MapPin, Navigation, User } from "lucide-react";
import { useState } from "react";

interface FlightSearchTopModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: { code: string; name: string };
  destination: { code: string; name: string };
  departDate: string;
  returnDate: string;
  passengerText?: string;
  onReSearch: (
    origin: string,
    dest: string,
    depart: string,
    ret: string,
  ) => void;
}

export const FlightSearchTopModal: React.FC<FlightSearchTopModalProps> = ({
  isOpen,
  onClose,
  origin: initOrigin,
  destination: initDest,
  departDate: initDepart,
  returnDate: initReturn,
  passengerText = "탑승객 1명, 일반석",
  onReSearch,
}) => {
  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initDest);

  if (!isOpen) return null;

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-200">
      <div className="bg-white rounded-b-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top duration-300">
        <div className="flex flex-col relative bg-gray-50 rounded-2xl p-3 border border-gray-100">
          {/* 출발지 */}
          <div className="flex items-center gap-3 py-2">
            <Navigation size={18} className="text-gray-400 rotate-45" />
            <span className="text-sm font-black text-gray-900">
              {origin.name} {origin.code}
            </span>
          </div>

          {/* 스왑 버튼 */}
          <button
            onClick={handleSwap}
            className="absolute right-3 top-6 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-2xs active:scale-90 transition-all"
          >
            <ArrowUpDown size={14} />
          </button>

          <div className="h-[1px] bg-gray-200 my-1" />

          {/* 도착지 */}
          <div className="flex items-center gap-3 py-2">
            <MapPin size={18} className="text-gray-400" />
            <span className="text-sm font-black text-gray-900">
              {destination.name} {destination.code}
            </span>
          </div>

          <div className="h-[1px] bg-gray-200 my-1" />

          {/* 일정 */}
          <div className="flex items-center gap-3 py-2">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm font-black text-gray-900">
              {initDepart} - {initReturn}
            </span>
          </div>

          <div className="h-[1px] bg-gray-200 my-1" />

          {/* 탑승객 */}
          <div className="flex items-center gap-3 py-2">
            <User size={18} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-700">
              {passengerText}
            </span>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onReSearch(origin.code, destination.code, initDepart, initReturn);
              onClose();
            }}
            className="flex-1 py-3.5 bg-blue-600 rounded-xl text-sm font-black text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            재검색
          </button>
        </div>
      </div>
    </div>
  );
};
