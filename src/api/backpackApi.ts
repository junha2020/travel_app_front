import axios from "axios";
import type { Place } from "../types/placeTypes";

const api = axios.create({
  baseURL: "/api/backpack",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 로컬 스토리지에 토큰이 있다면 자동으로 Authorization 헤더 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. 배낭에 찜 추가 API
export const addBookmark = async (placeId: number): Promise<void> => {
  await api.post<void>(`/add`, null, { params: { placeId } });
};

// 2. 배낭에서 찜 해제 API
export const removeBookmark = async (placeId: number): Promise<void> => {
  await api.delete<void>(`/remove`, { params: { placeId } });
};

// 3. 내 배낭 목록 조회 API
export const getBackpackList = async (): Promise<Place[]> => {
  const response = await api.get<Place[]>("");
  return response.data;
};

export const backpackApi = {
  addBookmark,
  removeBookmark,
  getBackpackList,
};
