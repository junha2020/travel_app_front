import api from "./axiosInstance";
import type { Place } from "../types/placeTypes";

// 1. 배낭에 찜 추가 API
export const addBookmark = async (placeId: number): Promise<void> => {
  await api.post<void>(`/backpack/add`, null, { params: { placeId } });
};

// 2. 배낭에서 찜 해제 API
export const removeBookmark = async (placeId: number): Promise<void> => {
  await api.delete<void>(`/backpack/remove`, { params: { placeId } });
};

// 3. 내 배낭 목록 조회 API
export const getBackpackList = async (): Promise<Place[]> => {
  const response = await api.get<Place[]>("/backpack");
  return response.data;
};

export const backpackApi = {
  addBookmark,
  removeBookmark,
  getBackpackList,
};
