import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlaceListPage from "./pages/PlaceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import { Routes, Route, useLocation } from "react-router-dom";
import BookmarkListPage from "./pages/BookmarkListPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import MyPage from "./pages/MyPage";
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
import FlightDetailPage from "./pages/FlightDetailPage";
import FlightBookingPage from "./pages/FlightBookingPage";
import FlightSearchResultPage from "./pages/FlightSearchResultPage";
import { MAIN_TAB_PATHS } from "./constants/navigation";

function App() {
  const location = useLocation();
  const isMainTab = MAIN_TAB_PATHS.includes(location.pathname as any);
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <main
          className={`flex-1 overflow-y-auto ${isMainTab ? "pb-[64px]" : "pb-0"} bg-white`}
        >
          <Routes>
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
            <Route path="/schedule/:scheduleId" element={<MyPage />} />
            <Route path="/my" element={<MyPage />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </div>
  );
}

export default App;
