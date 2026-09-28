import { ArrowLeft, Search, X } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
  ALL_AIRPORTS,
  DOMESTIC_AIRPORTS,
  JAPAN_AIRPORTS,
  type AirportOption,
} from "../../data/airportData";

interface AirportSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: "출발지 선택" | "도착지 선택";
  onSelect: (airport: AirportOption) => void;
}

export const AirportSelectModal: React.FC<AirportSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recent_airports");
    return saved
      ? JSON.parse(saved)
      : ["인천 ICN", "도쿄 TYO", "오사카 KIX", "후쿠오카 FUK"];
  });

  const filteredAirports = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return ALL_AIRPORTS.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.cityName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleSelectAirport = (airport: AirportOption) => {
    const key = `${airport.name} ${airport.code}`;
    const next = [key, ...recentSearches.filter((item) => item !== key)].slice(
      0,
      5,
    );
    setRecentSearches(next);
    localStorage.setItem("recent_airports", JSON.stringify(next));
    onSelect(airport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-150">
        <button
          onClick={onClose}
          className="p-1 -ml-1 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도시 또는 공항 이름으로 검색"
            className="flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
            autoFocus
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400"
            >
              <X size={16} />
            </button>
          ) : (
            <Search size={18} className="text-gray-500" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {filteredAirports ? (
          <div>
            <h4 className="text-xs font-bold text-gray-500 mb-3">검색 결과</h4>
            <div className="flex flex-wrap gap-2">
              {filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => handleSelectAirport(airport)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100"
                >
                  {airport.name} ({airport.code})
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-gray-900 mb-2.5">
                  최근 검색
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-7000 rounded-full text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black text-gray-900 mb-2.5">
                국내 (출발)
              </h3>
              <div className="flex flex-wrap gap-2">
                {DOMESTIC_AIRPORTS.map((a) => (
                  <button
                    key={a.code}
                    onClick={() => handleSelectAirport(a)}
                    className="px-3.5 py-2 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold hover:bg-gray-200 active:scale-95"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-900 mb-2.5">
                일본 (도착)
              </h3>
              <div className="flex flex-wrap gap-2">
                {JAPAN_AIRPORTS.map((a) => (
                  <button
                    key={a.code}
                    onClick={() => handleSelectAirport(a)}
                    className="px-3.5 py-2 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold hover:bg-gray-200 active:scale-95"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
