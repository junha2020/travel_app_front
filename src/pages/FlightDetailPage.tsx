import { ArrowLeft, ChevronRight, Luggage, Plane } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAirportByCode } from "../data/airportData";
import { AirlineLogo } from "../components/flight/AirlineLogo";

export default function FlightDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    deal,
    originCode = "ICN",
    destCode = "NRT",
    departDate = "10.26(월)",
    returnDate = "10.29(목)",
    passengerText = "성인 1인",
  } = location.state || {};

  const originAirport = getAirportByCode(originCode);
  const destAirport = getAirportByCode(destCode);

  const originName =
    originAirport?.cityName || originAirport?.name.split("(")[0] || "인천";
  const destName =
    destAirport?.cityName || destAirport?.name.split("(")[0] || "도쿄";

  const price = deal?.price || 556500;
  const airlineName = deal?.airline || "트리니티항공";
  const outboundFlightNo = deal?.outboundFlightNo || "TW0251";
  const inboundFlightNo = deal?.inboundFlightNo || "TW0252";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-36">
      {/* 상단 헤더 */}
      <header className="flex items-center px-4 py-3 bg-white border-b border-gray-150 sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
      </header>

      {/* 본문 영역 */}
      <main className="p-5 flex flex-col gap-5">
        <h1 className="text-xl font-black text-gray-900 tracking-tight">
          선택한 항공권 정보
        </h1>

        {/* 가는편 요약 카드 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-black">
              가는편
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-900">
            {originName} {originCode} - {destName} {destCode}
          </h3>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <Plane size={14} className="text-gray-400 rotate-45" />{" "}
              {airlineName}
            </span>
            <span>직항 {deal?.outboundDuration || "2시간 10분"}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Luggage size={14} className="text-gray-400" /> 수하물: 항공사
              운임 규정 확인
            </span>
            <span className="font-bold text-gray-700">일반석</span>
          </div>
        </div>

        {/* 오는편 요약 카드 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-black">
              오는편
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-900">
            {destName} {destCode} - {originName} {originCode}
          </h3>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <Plane size={14} className="text-gray-400 rotate-45" />{" "}
              {airlineName}
            </span>
            <span>직항 {deal?.inboundDuration || "2시간 30분"}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Luggage size={14} className=" text-gray-400" /> 수하물: 항공사
              운임 규정 확인
            </span>
            <span className="font-bold text-gray-700">일반석</span>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-2" />

        {/* 타임라인 섹션 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-black">
              가는편
            </span>
            <span className="text-xs font-bold text-gray-500">
              직항 {deal?.outboundDuration || "2시간 10분"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {originName}-{destName}
          </h2>

          <div className="relative pl-6 flex flex-col gap-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-blue-200" />

            <div className="relative flex flex-col">
              <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-blue-600">
                  {deal?.outboundDepartTime || "11:10"}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {departDate}
                </span>
              </div>
              <span className="text-base font-black text-gray-900 mt-0.5">
                {originName} 출발
              </span>
              <span className="text-xs font-bold text-gray-400">
                {originAirport?.name || "인천국제공항"} {originCode}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-150 shadow-2xs flex flex-col gap-2 my-1">
              <div className="flex items-center gap-2">
                <AirlineLogo airlineName={airlineName} size={20} />
                <span className="text-sm font-black text-gray-900">
                  {airlineName} {outboundFlightNo}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-600">
                {deal?.outboundDuration || "2시간 10분"} 비행
              </span>
              <span className="text-xs font-bold text-gray-500">
                수하물: 항공사 운임 규정 확인
              </span>
              <span className="text-xs font-bold text-gray-500">일반석</span>
            </div>

            <div className="relative flex flex-col">
              <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-blue-600">
                  {deal?.outboundArrivalTime || "13:20"}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {departDate}
                </span>
              </div>
              <span className="text-base font-black text-gray-900 mt-0.5">
                {destName} 도착
              </span>
              <span className="text-xs font-bold text-gray-400">
                {destAirport?.name || "나리타 국제공항"} {destCode}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-2" />

        {/* 오는편 타임라인 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-black">
              오는편
            </span>
            <span className="text-xs font-bold text-gray-500">
              직항 {deal?.inboundDuration || "2시간 30분"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {destName}-{originName}
          </h2>

          <div className="relative pl-6 flex flex-col gap-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-blue-200" />

            <div className="relative flex flex-col">
              <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-blue-600">
                  {deal?.inboundDeptTime || "14:20"}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {returnDate}
                </span>
              </div>
              <span className="text-base font-black text-gray-900 mt-0.5">
                {destName} 출발
              </span>
              <span className="text-xs font-bold text-gray-400">
                {destAirport?.name || "나리타 국제공항"} {destCode}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-150 shadow-2xs flex flex-col gap-2 my-1">
              <div className="flex items-center gap-2">
                <AirlineLogo airlineName={airlineName} size={20} />
                <span className="text-sm font-black text-gray-900">
                  {airlineName} {inboundFlightNo}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-600">
                {deal?.inboundDuration || "2시간 30분"} 비행
              </span>
              <span className="text-xs font-bold text-gray-500">
                수하물: 항공사 운임 규정 확인
              </span>
              <span className="text-xs font-bold text-gray-500">일반석</span>
            </div>

            <div className="relative flex flex-col">
              <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-blue-600">
                  {deal?.inboundArrTime || "16:50"}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {returnDate}
                </span>
              </div>
              <span className="text-base font-black text-gray-900 mt-0.5">
                {originName} 도착
              </span>
              <span className="text-xs font-bold text-gray-400">
                {originAirport?.name || "인천국제공항"} {originCode}
              </span>
            </div>
          </div>
        </div>

        {/* 운임 및 규정 안내 */}
        <div className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between text-left">
            <span className="text-sm font-black text-gray-900">
              운임 및 수하물 규정 안내
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            유류할증료와 세금은 항공사 사정 및 환율 변동에 의해 매일 변경되며,
            발권시점의 환율에 따라 최종 적용됩니다. 상세 취소/환불 수수료 규정은
            해당 항공사 운임 규정을 따릅니다.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-2">
            <span className="text-sm leading-none">⚠️</span>
            <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
              특가 및 프로모션 항공권(에어로케이 실속, 제주항공 FLY 등)은 무료
              위탁수하물이 제외(0kg)될 수 있으니 최종 예약 전 항공사 수하물
              규정을 반드시 확인해주세요.
            </p>
          </div>
        </div>
      </main>

      {/* 하단 고정 결제/예약 바 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 p-4 shadow-xl z-30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400">
              {passengerText}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              유류할증료 및 제세공과금 포함
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 block">
              모든카드 결제가능
            </span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {price.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              alert(
                `[${originName} ➔ ${destName}] 항공권 예약이 완료되었습니다!`,
              )
            }
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl shadow-md active:scale-98 transition-all text-center"
          >
            예약하기
          </button>
        </div>
      </footer>
    </div>
  );
}
