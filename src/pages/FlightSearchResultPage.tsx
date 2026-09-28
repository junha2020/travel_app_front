import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FlightSearchTopModal } from "../components/flight/FlightSearchTopModal";
import { getAirportByCode } from "../data/airportData";
import { AirlineLogo } from "../components/flight/AirlineLogo";

export default function FlightSearchResultPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const originCode = searchParams.get("origin") || "ICN";
  const destCode = searchParams.get("dest") || "TYO";
  const departDate = searchParams.get("depart") || "10.26(월)";
  const returnDate = searchParams.get("return") || "10.29(목)";
  const passengerText = searchParams.get("passenger") || "성인 1, 일반석";

  const [isTopModalOpen, setIsTopModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"recommend" | "cheapest">(
    "recommend",
  );

  const originAirport = getAirportByCode(originCode);
  const destAirport = getAirportByCode(destCode);
  const originName =
    originAirport?.cityName || originAirport?.name.split("(")[0] || "인천";
  const destName =
    destAirport?.cityName || destAirport?.name.split("(")[0] || "도쿄";

  const parseDateToISO = (dStr: string, defaultMonthDay: string) => {
    const match = dStr.match(/(\d{2})\.(\d{2})/);
    if (match) {
      return `2026-${match[1]}-${match[2]}`;
    }
    return defaultMonthDay;
  };

  const queryDepart = parseDateToISO(departDate, "2026-10-26");
  const queryReturn = parseDateToISO(returnDate, "2026-10-29");

  const { data: flightData, isLoading } = useQuery({
    queryKey: [
      "flightSearchResults",
      originCode,
      destCode,
      queryDepart,
      queryReturn,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/api/external/flights?origin=${originCode}&destination=${destCode}&departDate=2026-10-26&returnDate=2026-10-29`,
      );
      return res.data;
    },
  });

  const handleCardClick = (deal: any) => {
    navigate("/flights/detail", {
      state: {
        deal,
        originCode,
        destCode,
        departDate,
        returnDate,
        passengerText,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* 상단 헤더 */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-150 sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>
        <div
          onClick={() => setIsTopModalOpen(true)}
          className="flex-1 flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <span className="text-base font-black text-gray-900">
              {flightData?.originCityName || originName} {originCode} -{" "}
              {flightData?.destinationCityName || destName} {destCode}
            </span>
            <ChevronDown size={18} className="text-gray-600" />
          </div>
          <span className="text-xs text-gray-400 font-bold">
            {passengerText}
          </span>
        </div>
      </header>

      {/* 가로 스크롤 필터 칩 바 */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide text-xs font-bold">
        <button className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs">
          {departDate} - {returnDate} / 왕복
        </button>
        <button
          onClick={() =>
            setSelectedSort(
              selectedSort === "recommend" ? "cheapest" : "recommend",
            )
          }
          className="px-3 py-1.5 rounded-full border border-gray-200 text-blue-600 flex items-center gap-1 shrink-0 bg-white"
        ></button>
        <button className="px-3 py-1.5 rounded-full border border-gray-200 text-blue-600 flex items-center gap-1 shrink-0 bg-white">
          필터 <ChevronDown size={14} />
        </button>
        <button className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 shrink-0 bg-white">
          직항만
        </button>
      </div>

      <main className="p-4 flex flex-col gap-4">
        {/* 검색 결과 요약 카운트 */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-base font-black text-gray-900">검색결과</h3>
          <span className="text-xs text-gray-400 font-bold">
            {flightData?.flightDeals?.length || 61}개, 왕복, {passengerText}{" "}
            기준
          </span>
        </div>

        {/* 항공권 딜 카드 목록 */}
        {isLoading ? (
          <div className="py-20 text-center text-sm font-bold text-gray-400">
            실시간 항공권 조회 중...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {flightData?.flightDeals?.map((deal: any) => (
              <div
                key={deal.id}
                onClick={() => handleCardClick(deal)}
                className="bg-white rounded-2xl p-4 border border-gray-150 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex flex-col gap-3.5"
              >
                {/* 뱃지 태그 */}
                {deal.tag && (
                  <span className="text-xs font-black text-blue-600">
                    {deal.tag}
                  </span>
                )}

                {/* 가는편 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AirlineLogo airlineName={deal.airline} size={20} />
                    <span className="text-base font-black text-gray-900">
                      {deal.outboundDeptTime} - {deal.outboundArrTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800">
                      {deal.outboundDirect ? "직항" : "1회 경유"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between -mt-2 text-xs text-gray-400 font-medium">
                  <span>
                    {originCode}-{destCode}, {deal.airline}
                  </span>
                  <span>{deal.outboundDuration}</span>
                </div>

                {/* 오는편 */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <AirlineLogo airlineName={deal.airline} size={20} />
                    <span className="text-base font-black text-gray-900">
                      {deal.inboundDeptTime} - {deal.inboundArrTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800">
                      {deal.inboundDirect ? "직항" : "1회 경유"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between -mt-2 text-xs text-gray-400 font-medium">
                  <span>
                    {destCode}-{originCode}, {deal.airline}
                  </span>
                  <span>{deal.inboundDuration}</span>
                </div>

                {/* 가격 & 잔여석 */}
                <div className="border-t border-gray-100 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-blue-600">
                    {deal.remainingSeats}석 남음
                  </span>
                  <span className="text-xl font-black text-gray-900">
                    {Number(deal.price).toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 상단 재검색 모달 연동 */}
      <FlightSearchTopModal
        isOpen={isTopModalOpen}
        onClose={() => setIsTopModalOpen(false)}
        origin={{
          code: originCode,
          name: flightData?.originCityName || "인천",
        }}
        destination={{
          code: destCode,
          name: flightData?.destinationCityName || "도쿄",
        }}
        departDate={departDate}
        returnDate={returnDate}
        passengerText={passengerText}
        onReSearch={(newOrigin, newDest) => {
          setSearchParams({
            origin: newOrigin,
            dest: newDest,
            depart: departDate,
            return: returnDate,
            passenger: passengerText,
          });
        }}
      />
    </div>
  );
}
