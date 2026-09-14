import axios from "axios";

// 공통 axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api/external",
  headers: {
    "Content-Type": "application/json",
  },
});

// 환율 응답 인터페이스
export interface ExchangeRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  rateFor100Yen: number;
  updatedAt: string;
}

// 날씨 응답 인터페이스
export interface WeatherResponse {
  cityName: string;
  temperature: number;
  humidity: number;
  weatherText: string;
  weatherEmoji: string;
  windSpeed: number;
}

// 실시간 엔화 환율 조회 API
export const fetchExchangeRate = async (): Promise<ExchangeRateResponse> => {
  const response = await api.get<ExchangeRateResponse>("/currency");
  return response.data;
};

// 일본 도시별 실시간 날씨 조회 API
export const fetchCityWeather = async (
  cityName: string = "도쿄",
): Promise<WeatherResponse> => {
  const response = await api.get<WeatherResponse>("/weather", {
    params: { cityName },
  });
  return response.data;
};

export const externalApi = {
  fetchExchangeRate,
  fetchCityWeather,
};
