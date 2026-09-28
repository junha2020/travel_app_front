export interface AirportOption {
  code: string;
  name: string;
  cityName: string;
  category: "국내" | "일본";
}

// 국내 거점 공항
export const DOMESTIC_AIRPORTS: AirportOption[] = [
  { code: "ICN", name: "서울(인천)", cityName: "인천", category: "국내" },
  { code: "GMP", name: "서울(김포)", cityName: "김포", category: "국내" },
  { code: "PUS", name: "부산(김해)", cityName: "부산", category: "국내" },
  { code: "TAE", name: "대구", cityName: "대구", category: "국내" },
  { code: "CJJ", name: "청주", cityName: "청주", category: "국내" },
  { code: "CJU", name: "청주", cityName: "청주", category: "국내" },
];

// 일본 거점 공항
export const JAPAN_AIRPORTS: AirportOption[] = [
  { code: "TYO", name: "도쿄 전체", cityName: "도쿄", category: "일본" },
  { code: "NRT", name: "도쿄(나리타)", cityName: "도쿄", category: "일본" },
  { code: "HND", name: "도쿄(하네다)", cityName: "도쿄", category: "일본" },
  { code: "KIX", name: "오사카", cityName: "오사카", category: "일본" },
  { code: "FUK", name: "후쿠오카", cityName: "후쿠오카", category: "일본" },
  { code: "CTS", name: "삿포로", cityName: "삿포로", category: "일본" },
  { code: "OKA", name: "오키나와", cityName: "오키나와", category: "일본" },
  { code: "NGO", name: "나고야", cityName: "나고야", category: "일본" },
  { code: "TAK", name: "다카마쓰", cityName: "다카마쓰", category: "일본" },
  { code: "MYJ", name: "마쓰야마", cityName: "마쓰야마", category: "일본" },
];

export const ALL_AIRPORTS: AirportOption[] = [
  ...DOMESTIC_AIRPORTS,
  ...JAPAN_AIRPORTS,
];

export const getAirportByCode = (code: string): AirportOption | undefined => {
  return ALL_AIRPORTS.find((a) => a.code.toUpperCase() === code.toUpperCase());
};
