import axios from "axios";
import type { TravelPlanRequestDTO, Plan } from "../types/planTypes";

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
export const getUserPlans = async (
  userId: number,
): Promise<Plan[]> => {
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

export const planApi = {
  createPlan,
  getUserPlans,
  addPlaceToPlan,
  getPlanById,
  deletePlan,
};
