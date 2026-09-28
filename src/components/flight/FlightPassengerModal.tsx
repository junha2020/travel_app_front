import { Check, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

export interface PassengerState {
  adults: number;
  children: number;
  infants: number;
  cabinClasses: string[];
}

interface FlightPassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: PassengerState;
  onApply: (updated: PassengerState) => void;
}

export const FlightPassengerModal: React.FC<FlightPassengerModalProps> = ({
  isOpen,
  onClose,
  passengers: init,
  onApply,
}) => {
  const [adults, setAdults] = useState(init.adults);
  const [children, setChildren] = useState(init.children);
  const [infants, setInfants] = useState(init.infants);
  const [cabinClasses, setCabinClasses] = useState<string[]>(
    init.cabinClasses || ["일반석"],
  );

  if (!isOpen) return null;

  const toggleClass = (c: string) => {
    if (cabinClasses.includes(c)) {
      if (cabinClasses.length > 1)
        setCabinClasses(cabinClasses.filter((item) => item !== c));
    } else {
      setCabinClasses([...cabinClasses, c]);
    }
  };

  const handleComplete = () => {
    onApply({ adults, children, infants, cabinClasses });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col text-left max-w-md mx-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-150">
        <button onClick={onClose} className="p-1 text-gray-700">
          <X size={22} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">인원 및 좌석등급</h2>
          <ul className="text-xs text-gray-400 font-bold mt-2 space-y-1">
            <li>총 9명까지만 한번에 검색 및 예약이 가능합니다.</li>
            <li>성인 1명당 유아 1인까지 동반 탑승 가능합니다.</li>
            <li>
              만 2세 미만의 유아라도 별도 좌석에 탑승하려면 소아로 선택해주세요.
            </li>
          </ul>
        </div>

        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-black text-gray-900">성인</h4>
              <p className="text-xs text-gray-400 font-bold">만 12세 이상</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={adults <= 1}
                onClick={() => setAdults((a) => a - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-black text-gray-900 w-4 text-center">
                {adults}
              </span>
              <button
                onClick={() => setAdults((a) => a + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-black text-gray-900">소아</h4>
              <p className="text-xs text-gray-400 font-bold">
                만 2세 ~ 만 12세 미만
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={children <= 0}
                onClick={() => setChildren((c) => c - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-black text-gray-900 w-4 text-center">
                {children}
              </span>
              <button
                onClick={() => setChildren((c) => c + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-black text-gray-900">유아</h4>
              <p className="text-xs text-gray-400 font-bold">
                만 2세 미만, 보호자 동반
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={infants <= 0}
                onClick={() => setInfants((i) => i - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-black text-gray-900 w-4 text-center">
                {infants}
              </span>
              <button
                onClick={() => setInfants((i) => i + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          {["일반석", "프리미엄 일반석", "비지니스석", "일등석"].map((cls) => {
            const isChecked = cabinClasses.includes(cls);
            return (
              <div
                key={cls}
                onClick={() => toggleClass(cls)}
                className="flex items-center justify-between py-1 cursor-pointer"
              >
                <span className="text-sm font-black text-gray-900">{cls}</span>
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    isChecked
                      ? "bg-blue-600 text-white"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {isChecked && <Check size={16} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-150">
        <button
          onClick={handleComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md text-base"
        >
          선택완료
        </button>
      </div>
    </div>
  );
};
