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

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <div className="h-12 bg-white flex justify-center items-end pb-2 font-bold text-sm z-10 sticky top-0 border-b border-gray-100">
          Travel App
        </div>
        <main className="flex-1 overflow-y-auto pb-[64px] bg-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityName" element={<CityDetailPage />} />
            <Route
              path="/recommend/:recommendId"
              element={<RecommendDetailPage />}
            />

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
