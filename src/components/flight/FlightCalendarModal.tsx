import { CalendarModal } from "../CalendarModal";

export interface FlightCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripType: "round" | "oneway" | "multi";
  departDate: string;
  returnDate: string;
  onSelectDates: (depart: string, ret: string) => void;
}

// ISO 문자열 MM.DD(요일) 항공 전용 표기법으로 변환
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const formatFlightDate = (iso: string) => {
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

export const FlightCalendarModal: React.FC<FlightCalendarModalProps> = ({
  isOpen,
  onClose,
  tripType,
  departDate,
  returnDate,
  onSelectDates,
}) => {
  return (
    <CalendarModal
      isOpen={isOpen}
      onClose={onClose}
      mode={tripType === "oneway" ? "single" : "range"}
      startDate={departDate}
      endDate={returnDate}
      title="일정 선택"
      subtitle="항공권을 검색하실 일정을 선택해주세요."
      startBadgeLabel="가는날"
      endBadgeLabel="오는날"
      monthsCount={6}
      onConfirm={(startIso, endIso) => {
        const dStr = formatFlightDate(startIso);
        const rStr = endIso ? formatFlightDate(endIso) : "";
        onSelectDates(dStr, rStr);
      }}
    />
  );
};
