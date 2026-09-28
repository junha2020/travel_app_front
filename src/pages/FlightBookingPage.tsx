import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  MapPin,
  Menu,
  Navigation,
  Plus,
  TrendingDown,
  User,
} from "lucide-react";
import {
  DOMESTIC_AIRPORTS,
  JAPAN_AIRPORTS,
  type AirportOption,
} from "../data/airportData";
import {
  FlightPassengerModal,
  type PassengerState,
} from "../components/flight/FlightPassengerModal";
import { AirportSelectModal } from "../components/flight/AirportSelectModal";
import { FlightCalendarModal } from "../components/flight/FlightCalendarModal";

export default function FlightBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">(
    "round",
  );

  // 기본값: 인천 ICN, 도쿄 TYO
  const [origin, setOrigin] = useState<AirportOption>(DOMESTIC_AIRPORTS[0]);
  const [destination, setDestination] = useState<AirportOption>(
    JAPAN_AIRPORTS[0],
  );

  const [multiSegments, setMultiSegments] = useState([
    {
      origin: DOMESTIC_AIRPORTS[0],
      dest: JAPAN_AIRPORTS[0],
      date: "10.26(월)",
    },
    {
      origin: JAPAN_AIRPORTS[0],
      dest: JAPAN_AIRPORTS[3],
      date: "10.29(목)",
    },
  ]);

  const [departDate, setDepartDate] = useState("10.26(월)");
  const [returnDate, setReturnDate] = useState("10.29(목)");
  const [passengers, setPassengers] = useState<PassengerState>({
    adults: 1,
    children: 0,
    infants: 0,
    cabinClasses: ["일반석"],
  });

  const [airportModalType, setAirportModalType] = useState<
    "origin" | "dest" | null
  >(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    navigate(
      `/flights/search?origin=${origin.code}&dest=${destination.code}&depart=${departDate}&return=${returnDate}`,
    );
  };

  const passengerText = `탑승객 ${passengers.adults + passengers.children + passengers.infants}명, ${passengers.cabinClasses[0]}${
    passengers.cabinClasses.length > 1
      ? ` 외 ${passengers.cabinClasses.length - 1}`
      : ""
  }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-700">
          <ArrowLeft size={22} />
        </button>
        <button className="p-1 text-gray-700">
          <Menu size={22} />
        </button>
      </header>

      <main className="p-5 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
            검색부터 발권까지
            <br />
            쉽고 빠른 항공 예약
          </h1>
        </div>

        {/* 탭 바: 왕복 / 편도 / 다구간 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTripType("round")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
              tripType === "round"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            왕복
          </button>
          <button
            onClick={() => setTripType("oneway")}
            className={`px-3 py-1.5 text-xs font-bold transition-all ${
              tripType === "oneway"
                ? "bg-blue-600 text-white rounded-full"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            편도
          </button>
          <button
            onClick={() => setTripType("multi")}
            className={`px-3 py-1.5 text-xs font-bold transition-all ${
              tripType === "multi"
                ? "bg-blue-600 text-white rounded-full"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            다구간
          </button>
        </div>

        {tripType !== "multi" ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 flex flex-col relative">
            <div
              onClick={() => setAirportModalType("origin")}
              className="flex items-center gap-3.5 py-3 cursor-pointer"
            >
              <Navigation size={20} className="text-gray-400 rotate-45" />
              <span className="text-base font-black text-gray-900">
                {origin.name} {origin.code}
              </span>
            </div>

            <button
              onClick={handleSwap}
              className="absolute right-5 top-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 shadow-2xs active:scale-90 z-10"
            >
              <ArrowUpDown size={16} />
            </button>

            <div className="h-[1px] bg-gray-100 ml-8 my-1" />

            <div
              onClick={() => setAirportModalType("dest")}
              className="flex items-center gap-3.5 py-3 cursor-pointer"
            >
              <MapPin size={20} className="text-gray-400" />
              <span className="text-base font-black text-gray-900">
                {destination.name} {destination.code}
              </span>
            </div>

            <div className="h-[1px] bg-gray-100 ml-8 my-1" />

            <div
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-3.5 py-3 cursor-pointer"
            >
              <Calendar size={20} className="text-gray-400" />
              <span className="text-base font-black text-gray-900">
                {tripType === "round"
                  ? `${departDate} - ${returnDate}`
                  : departDate}
              </span>
            </div>

            <div className="h-[1px] bg-gray-100 ml-8 my-1" />

            <div
              onClick={() => setIsPassengerOpen(true)}
              className="flex items-center gap-3.5 py-3 cursor-pointer"
            >
              <User size={20} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                {passengerText}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 font-bold">
              다구간은 국제선만 이용할 수 있습니다
            </p>
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 flex flex-col gap-4">
              {multiSegments.map((seg, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-black text-sm">
                    {seg.origin.code} {seg.origin.cityName}
                  </span>
                  <span className="text-gray-400">⇄</span>
                  <span className="font-black text-sm">
                    {seg.dest.code} {seg.dest.cityName}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">
                    {seg.date}
                  </span>
                </div>
              ))}
              <button
                onClick={() => alert("여정이 추가되었습니다.")}
                className="py-2.5 text-center text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center justify-center gap-1"
              >
                <Plus size={14} /> 여정 추가
              </button>
            </div>
          </div>
        )}

        {/* 항공권 검색 버튼 */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-md active:scale-98 text-base"
        >
          <span>항공권 검색</span>
        </button>
      </main>

      <AirportSelectModal
        isOpen={airportModalType !== null}
        onClose={() => setAirportModalType(null)}
        title={airportModalType === "origin" ? "출발지 선택" : "도착지 선택"}
        onSelect={(a) =>
          airportModalType === "origin" ? setOrigin(a) : setDestination(a)
        }
      />

      <FlightCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        tripType={tripType}
        departDate={departDate}
        returnDate={returnDate}
        onSelectDates={(d, r) => {
          setDepartDate(d);
          if (r) setReturnDate(r);
        }}
      />

      <FlightPassengerModal
        isOpen={isPassengerOpen}
        onClose={() => setIsPassengerOpen(false)}
        passengers={passengers}
        onApply={(p) => setPassengers(p)}
      />
    </div>
  );
}
