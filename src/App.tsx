import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlacesListPage from "./pages/PlacesListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import { Routes, Route } from "react-router-dom";
import BackpackPage from "./pages/BackpackPage";
import PlannerPage from "./pages/PlannerPage";
import MyPlansPage from "./pages/MyPlansPage";
import AccountRecoveryPage from "./pages/AccountRecoveryPage";

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

            {/* 장소 관련 */}
            <Route path="/places" element={<PlacesListPage />} />
            <Route path="/places/:id" element={<PlaceDetailPage />} />

            {/* 인증 관련 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/find-account" element={<AccountRecoveryPage />} />

            {/* 여행 계획 관련 */}
            <Route path="/backpack" element={<BackpackPage />} />
            <Route path="/planner/:planId" element={<PlannerPage />} />
            <Route path="/schedule/:scheduleId" element={<MyPlansPage />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </div>
  );
}

export default App;
