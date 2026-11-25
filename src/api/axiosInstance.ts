import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. 요청 인터셉터: 토큰 있으면 자동으로 Authorization 헤더에 삽입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 2. 응답 인터셉터: 401 Unauthorized(토큰 만료/무효)시 자동 로그아웃 & 로그인 페이지로 이동
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
