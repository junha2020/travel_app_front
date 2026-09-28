import { X } from "lucide-react";
import { useMemo, useState } from "react";

export interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "range" | "single";
  startDate?: string;
  endDate?: string;
  onConfirm: (startDate: string, endDate?: string) => void;

  title?: string;
  subtitle?: string;
  startBadgeLabel?: string;
  endBadgeLabel?: string;
  monthsCount?: number;
}

const normalizeToISO = (val?: string): string => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const match = val.match(/(\d{1,2})\.(\d{1,2})/);
  if (match) {
    const m = match[1].padStart(2, "0");
    const d = match[2].padStart(2, "0");
    return `2026-${m}-${d}`;
  }

  return val;
};

// 요일 명칭 매핑
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// ISO 문자열을 MM.DD(요일) 형식으로 바꾸기
const formatDisplay = (iso: string) => {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length === 3) {
    const d = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    const m = parts[1];
    const day = parts[2];
    const dow = WEEKDAYS[d.getDay()];
    return `${m}.${day}(${dow})`;
  }

  return iso;
};

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  mode = "range",
  startDate: initStart,
  endDate: initEnd,
  onConfirm,
  title = "일정 선택",
  subtitle = "원하시는 일정을 선택해주세요.",
  startBadgeLabel = "가는날",
  endBadgeLabel = "오는날",
  monthsCount = 6,
}) => {
  const [selectedStart, setSelectedStart] = useState(() =>
    normalizeToISO(initStart),
  );
  const [selectedEnd, setSelectedEnd] = useState(() => normalizeToISO(initEnd));

  // 오늘 날짜 및 기준 월 계산
  const baseDate = useMemo(() => new Date(2026, 9, 1), []);

  // monthsCount 만큼의 연속된 달력 데이터 동적 생성
  const calendarMonths = useMemo(() => {
    const list = [];
    for (let i = 0; i < monthsCount; i++) {
      const curDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + i,
        1,
      );
      const curYear = curDate.getFullYear();
      const curMonth = curDate.getMonth();
      const firstDay = new Date(curYear, curMonth, 1).getDay();
      const daysCount = new Date(curYear, curMonth + 1, 0).getDate();

      list.push({
        year: curYear,
        month: curMonth + 1,
        firstDay,
        daysCount,
      });
    }

    return list;
  }, [baseDate, monthsCount]);

  if (!isOpen) return null;

  const handleDateClick = (isoStr: string) => {
    if (mode === "single") {
      setSelectedStart(isoStr);
      setSelectedEnd("");
      return;
    }

    // 기간 선택
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(isoStr);
      setSelectedEnd("");
    } else {
      if (isoStr < selectedStart) {
        setSelectedStart(isoStr);
        setSelectedEnd("");
      } else {
        setSelectedEnd(isoStr);
      }
    }
  };

  const isConfirmedDisabled =
    !selectedStart || (mode === "range" && !selectedEnd);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      {/* 상단 닫기 버튼 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-150">
        <button
          onClick={onClose}
          className="p-1 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* 다중 월 연속 스크롤 영역 */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h2 className="text-xl font-black text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 font-bold mt-1 mb-6">{subtitle}</p>

        {calendarMonths.map((m) => {
          const emptySlots = Array.from({ length: m.firstDay }, (_, i) => i);
          const days = Array.from({ length: m.daysCount }, (_, i) => i + 1);

          return (
            <div key={`${m.year}-${m.month}`} className="mb-8">
              <h3 className="text-base font-black text-gray-900 mb-4">
                {m.year}년 {m.month}월
              </h3>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-y-3 text-center text-xs font-bold text-gray-400 mb-2">
                <span className="text-rose-500">일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span>토</span>
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-black">
                {/* 1일 이전 빈칸으로 채우기 */}
                {emptySlots.map((slot) => (
                  <div key={`empty-${slot}`} />
                ))}

                {/* 해당 월 날짜 버튼 */}
                {days.map((d) => {
                  const mStr = String(m.month).padStart(2, "0");
                  const dStr = String(d).padStart(2, "0");
                  const isoStr = `${m.year}-${mStr}-${dStr}`;

                  const isStart = selectedStart === isoStr;
                  const isEnd = selectedEnd === isoStr;
                  const isInRange =
                    mode === "range" &&
                    selectedStart &&
                    selectedEnd &&
                    isoStr > selectedStart &&
                    isoStr < selectedEnd;

                  return (
                    <div
                      key={isoStr}
                      onClick={() => handleDateClick(isoStr)}
                      className={`py-2 cursor-pointer relative flex flex-col items-center justify-center transition-all ${
                        isStart || isEnd
                          ? "bg-blue-600 text-white rounded-full z-10"
                          : isInRange
                            ? "bg-blue-50 text-blue-600 rounded-none"
                            : "text-gray-900 hover:bg-gray-100 rounded-full"
                      }`}
                    >
                      <span className="leading-tight">{d}</span>
                      {isStart && startBadgeLabel && (
                        <span className="text-[9px] font-bold text-blue-100 -mt-0.5">
                          {startBadgeLabel}
                        </span>
                      )}
                      {isEnd && endBadgeLabel && (
                        <span className="text-[9px] font-bold text-blue-100 -mt-0.5">
                          {endBadgeLabel}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 선택 완료 플로팅 바 */}
      <div className="p-4 border-t border-gray-150 bg-white">
        <button
          onClick={() => {
            if (!isConfirmedDisabled) {
              onConfirm(selectedStart, selectedEnd);
              onClose();
            }
          }}
          disabled={isConfirmedDisabled}
          className={`w-full font-black py-4 rounded-xl shadow-md text-base transition-all ${
            isConfirmedDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {selectedStart ? formatDisplay(selectedStart) : "날짜 선택"}
          {selectedEnd ? ` - ${formatDisplay(selectedEnd)}` : ""}
          {" / 선택완료"}
        </button>
      </div>
    </div>
  );
};
