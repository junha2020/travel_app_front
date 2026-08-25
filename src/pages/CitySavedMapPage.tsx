import { ArrowLeft, Flag, Hotel, Navigation2, Utensils } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { getCityInfo } from "../utils/travelUtils";
import { useQuery } from "@tanstack/react-query";
import { backpackApi } from "../api/backpackApi";
import { placeApi } from "../api/placeApi";

const MAP_FILTER_CHIPS = [
  { id: "saved", label: "내 저장", icon: null },
  { id: "tour", label: "관광", icon: Flag },
  { id: "food", label: "맛집", icon: Utensils },
  { id: "hotel", label: "숙소", icon: Hotel },
] as const;

export default function CitySavedMapPage() {
  const { cityName: citySlug } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<string>("saved");

  const cityInfo = getCityInfo(citySlug);
  const targetCityName = cityInfo.title;

  const { data: backpackItems = [] } = useQuery({
    queryKey: ["userBackpack"],
    queryFn: () => backpackApi.getBackpackList(),
    enabled: !!isLoggedIn && !!localStorage.getItem("token"),
    retry: false,
  });

  const { data: cityPlaces = [] } = useQuery({
    queryKey: ["cityPlaces", targetCityName],
    queryFn: () => placeApi.searchPlacesByName(targetCityName),
  });

  const savedPlaces = Array.isArray(backpackItems) ? backpackItems : [];
  const displayPlaces =
    activeFilter === "saved"
      ? savedPlaces.length > 0
        ? savedPlaces
        : cityPlaces
      : cityPlaces.filter((p: any) => {
          if (activeFilter === "food") return p.category?.includes("맛집");
          if (activeFilter === "hotel") return p.category?.includes("숙소");
          return !p.category?.includes("맛집") && !p.category?.includes("숙소");
        });

  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);
  const currentPlace = displayPlaces[selectedPlaceIndex] || displayPlaces[0];

  return (
    <div className="flex flex-col h-screen bg-slate-100 select-none relative overflow-hidden pb-[64px]">
      <header className="bg-white/95 backdrop-blur-md z-30 border-b border-gray-150 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-base font-black text-gray-900">
            {targetCityName} 여행
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto scrollbar-hide">
          {MAP_FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 ${
                activeFilter === chip.id
                  ? "bg-blue-50 border border-blue-500 text-blue-600 font-black"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              {chip.icon && <chip.icon size={13} />}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* 지도 */}
      <div className="flex-1 relative w-full h-full bg-[#e8ecef] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px, transparent_1.2px)] [background-size:20px_20px] opacity-60"></div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-sm h-[320px]">
            {displayPlaces.map((place: any, idx: number) => (
              <button
                key={place.id || idx}
                onClick={() => setSelectedPlaceIndex(idx)}
                style={{
                  top: `${25 + ((idx * 14) % 55)}%`,
                  left: `${20 + ((idx * 18) % 65)}%`,
                }}
                className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  idx === selectedPlaceIndex
                    ? "scale-125 z-20"
                    : "scale-100 z-10 opacity-85"
                }`}
              >
                <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                  <Flag size={14} className="fill-white" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {currentPlace && (
          <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
            <div
              onClick={() => navigate(`/places/${currentPlace.id}`)}
              className="bg-white rounded-3xl p-4 shadow-xl border border-gray-150 flex items-center justify-between gap-3.5 cursor-pointer"
            >
              <img
                src={currentPlace.imageUrl || cityInfo.imageUrl}
                alt={currentPlace.name}
                className="w-20 h-20 rounded-2xl object-cover bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm text-gray-900 truncate">
                  {currentPlace.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                  {currentPlace.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-gray-500">
                  <span className="text-amber-500">★ 4.8</span>
                  <span>(2,860) · 저장 81,945</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Navigation2 size={18} className="fill-blue-600 rotate-45" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
