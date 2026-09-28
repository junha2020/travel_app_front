import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlaceListPage from "./pages/PlaceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import { Routes, Route } from "react-router-dom";
import BookmarkListPage from "./pages/BookmarkListPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import PlanListPage from "./pages/PlanListPage";
import FindAccountPage from "./pages/FindAccountPage";
import PlanCreatePage from "./pages/PlanCreatePage";
import CityDetailPage from "./pages/CityDetailPage";
import RecommendDetailPage from "./pages/RecommendDetailPage";
import CityGuidePage from "./components/city/CityGuidePage";
import SearchPage from "./pages/SearchPage";
import CityPlaceListPage from "./components/city/CityPlaceListPage";
import CityTourListPage from "./components/city/CityTourListPage";
import CityLoungePage from "./components/city/CityLoungePage";
import CitySavedMapPage from "./pages/CitySavedMapPage";
import {
  FlightPassengerModal,
  type PassengerState,
} from "./components/flight/FlightPassengerModal";
import { useState } from "react";
import FlightDetailPage from "./pages/FlightDetailPage";
import FlightBookingPage from "./pages/FlightBookingPage";
import FlightSearchResultPage from "./pages/FlightSearchResultPage";

function TestPassenger() {
  const [isOpen, setIsOpen] = useState(true);
  const [passengers, setPassengers] = useState<PassengerState>({
    adults: 1,
    children: 0,
    infants: 0,
    cabinClasses: ["일반석"],
  });

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-lg font-black text-gray-900 mb-2">
        인원 모달 테스트 룸
      </h2>
      <div className="mb-4 text-xs font-bold text-blue-600 bg-glue-50 px-3 py-2 rounded-xl">
        현재 선택: 성인 {passengers.adults}명, 소아 {passengers.children}명,
        유아 {passengers.infants}명 좌석: {passengers.cabinClasses.join(", ")}
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md text-sm"
      >
        인원 모달 다시 열기
      </button>

      {/* 테스트 모달 */}
      <FlightPassengerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        passengers={passengers}
        onApply={(updated) => setPassengers(updated)}
      />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto pb-[64px] bg-white">
          <Routes>
            {/* 테스트용 */}
            <Route path="/test" element={<TestPassenger />} />

            {/* 홈 & 전면 검색 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* 도시 메인 홈 & 지도 뷰 */}
            <Route path="/city/:cityName" element={<CityDetailPage />} />
            <Route path="/city/:cityName/map" element={<CitySavedMapPage />} />

            {/* 도시 내부 서브 페이지 */}
            <Route path="/city/:cityName/guide" element={<CityGuidePage />} />
            <Route
              path="/city/:cityName/places"
              element={<CityPlaceListPage />}
            />
            <Route
              path="/city/:cityName/tours"
              element={<CityTourListPage />}
            />
            <Route path="/city/:cityName/lounge" element={<CityLoungePage />} />

            {/* AI 추천 상세 */}
            <Route
              path="/recommend/:recommendId"
              element={<RecommendDetailPage />}
            />

            {/* 항공권 관련 */}
            <Route path="/flights" element={<FlightBookingPage />} />
            <Route
              path="/flights/search"
              element={<FlightSearchResultPage />}
            />
            <Route path="/flights/detail" element={<FlightDetailPage />} />

            {/* 장소 관련 */}
            <Route path="/places" element={<PlaceListPage />} />
            <Route path="/places/:id" element={<PlaceDetailPage />} />

            {/* 인증 관련 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/find-account" element={<FindAccountPage />} />

            {/* 여행 계획 관련 */}
            <Route path="/create-plan" element={<PlanCreatePage />} />
            <Route path="/backpack/:planId" element={<BookmarkListPage />} />
            <Route path="/planner/:planId" element={<PlanDetailPage />} />
            <Route path="/schedule/:scheduleId" element={<PlanListPage />} />
            <Route path="/my" element={<PlanListPage />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </div>
  );
}

export default App;
