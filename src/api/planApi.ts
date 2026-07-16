import axios from "axios";
import type { TravelPlanRequestDTO, Plan } from "../types/planTypes";

export interface UpdatePlaceSequenceDTO {
  planPlaceId: number;
  day: number;
  sequence: number;
}

export interface AddPlaceRequestDTO {
  placeId: number;
  day: number;
}

export interface GenerateAIPlanDTO {
  cityName: string;
  days: number;
  theme: string;
  userId: number;
}

// 공통 axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 있으면 자동으로 Authorization 헤더 추가)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// POST /api/plans API 호출 함수
export const createPlan = async (
  planData: TravelPlanRequestDTO,
): Promise<Plan> => {
  const response = await api.post<Plan>("/plans", planData);
  return response.data;
};

// GET /api/plans/user/{userId} API 호출 함수
export const getUserPlans = async (userId: number): Promise<Plan[]> => {
  const response = await api.get<Plan[]>(`/plans/user/${userId}`);
  return response.data;
};

// POST /api/plans/{planId}/places API 호출 함수
export const addPlaceToPlan = async (
  planId: number,
  data: { placeId: number; day: number },
): Promise<void> => {
  await api.post<void>(`/plans/${planId}/places`, data);
};

// GET /api/plans/{planId} API 호출 함수
export const getPlanById = async (planId: number): Promise<Plan> => {
  const response = await api.get<Plan>(`/plans/${planId}`);
  return response.data;
};

// DELETE /api/plans/{planId} API 호출 함수
export const deletePlan = async (planId: number): Promise<void> => {
  await api.delete<void>(`/plans/${planId}`);
};

// DELETE /api/plans/{planId}/places/{planPlaceId} API 호출 함수
export const removePlaceFromPlan = async (
  planId: number,
  planPlaceId: number,
): Promise<void> => {
  await api.delete<void>(`/plans/${planId}/places/${planPlaceId}`);
};

// PUT /api/plans/{planId}/places/sequence API 호출 함수 추가
export const updatePlacesSequence = async (
  planId: number,
  sequenceData: UpdatePlaceSequenceDTO[],
): Promise<void> => {
  await api.put<void>(`/plans/${planId}/places/sequence`, sequenceData);
};

// POST /api/plans/{planId}/places/bulk API 호출 함수 추가
export const addPlacesToPlanBulk = async (
  planId: number,
  data: AddPlaceRequestDTO[],
): Promise<void> => {
  await api.post<void>(`/plans/${planId}/places/bulk`, data);
};

// POST /api/plans/{recommendPlanId}/copy API 호출 함수 추가
export const copyRecommendPlan = async (
  recommendPlanId: number,
  userId: number,
): Promise<number> => {
  const response = await api.post<number>(
    `/plans/${recommendPlanId}/copy`,
    null,
    {
      params: { userId },
    },
  );
  return response.data;
};

// POST AI 실시간 일정 생성 API 호출 함수
export const generateAIPlan = async (
  dto: GenerateAIPlanDTO,
): Promise<number> => {
  const response = await api.post<number>("/plans/ai-generate", null, {
    params: {
      cityName: dto.cityName,
      days: dto.days,
      theme: dto.theme,
      userId: dto.userId,
    },
  });
  return response.data;
};

export const planApi = {
  createPlan,
  getUserPlans,
  addPlaceToPlan,
  getPlanById,
  deletePlan,
  removePlaceFromPlan,
  updatePlacesSequence,
  addPlacesToPlanBulk,
  copyRecommendPlan,
  generateAIPlan,
};
