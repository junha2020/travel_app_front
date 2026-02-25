import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlacesListPage from "./pages/PlacesListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";

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
            <Route path="/places" element={<PlacesListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </div>
  );
}

export default App;
