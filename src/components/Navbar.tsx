import React from "react";
import { Home, MapPin, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getIconColor = (path: string) => {
    return location.pathname === path ? "text-blue-500" : "text-gray-400";
  };
  const getStrokeWidth = (path: string) => {
    return location.pathname === path ? 2.5 : 2;
  };

  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center h-[64px] text-[10px] font-bold z-50 pb-2">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center gap-1 w-16 pt-2 ${getIconColor("/")}`}
      >
        <Home size={22} strokeWidth={getStrokeWidth("/")} />
        <span>홈</span>
      </button>
      <button
        onClick={() => navigate("/places")}
        className={`flex flex-col items-center gap-1 w-16 pt-2 ${getIconColor("/places")}`}
      >
        <MapPin size={22} strokeWidth={getStrokeWidth("/places")} />
        <span>장소</span>
      </button>
      <button
        onClick={() => navigate("/login")}
        className={`flex flex-col items-center gap-1 w-16 pt-2 ${getIconColor("/login")}`}
      >
        <User size={22} strokeWidth={getStrokeWidth("/login")} />
        <span>마이</span>
      </button>
    </nav>
  );
};

export default Navbar;
