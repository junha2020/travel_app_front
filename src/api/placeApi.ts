import axios from "axios";
import type { Place } from "../types/placeTypes";

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 번호
  first: boolean;
  last: boolean;
}

const api = axios.create({
  baseURL: "/api/places",
  headers: {
    "Content-Type": "application/json",
  },
});

// 페이징 처리된 장소 목록 가져오기 API
export const fetchPlaces = async (
  page: number = 0,
  size: number = 5,
): Promise<PageResponse<Place>> => {
  const response = await api.get<PageResponse<Place>>("", {
    params: { page, size },
  });
  return response.data;
};

// 특정 ID로 장소 상세 정보 가져오기 API
export const fetchPlaceDetail = async (placeId: number): Promise<Place> => {
  const response = await api.get<Place>(`/${placeId}`);
  return response.data;
};

// 이름 기반 장소 검색 API 호출 함수
export const searchPlacesByName = async (name: string): Promise<Place[]> => {
  const response = await api.get<Place[]>(
    `/search/${encodeURIComponent(name)}`,
  );
  return response.data;
};

export const placeApi = {
  fetchPlaces,
  fetchPlaceDetail,
  searchPlacesByName,
};
