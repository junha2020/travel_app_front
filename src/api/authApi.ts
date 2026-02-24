import axios from "axios";
import type {
  UserLoginRequestDTO,
  UserSignUpRequestDTO,
  UserResponseDTO,
} from "../types/userTypes";

// 공통 axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (로그인 후 토큰 있으면 자동으로 헤더에 넣음)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 나중에 저장할 토큰 키 이름
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 로그인 API 호출 함수
/* @Param credentials - userName, password 들어간 객체 */
export const login = async (
  credentials: UserLoginRequestDTO,
): Promise<UserResponseDTO> => {
  const response = await api.post<UserResponseDTO>("/users/login", credentials);
  return response.data;
};

// 회원가입 API 호출 함수
/* @Param signUpData - 회원가입 폼 데이터 */
export const register = async (
  signUpData: UserSignUpRequestDTO,
): Promise<UserResponseDTO> => {
  const response = await api.post<UserResponseDTO>(
    "users/register",
    signUpData,
  );
  return response.data;
};

// 내 정보 가져오기 API
export const getMe = async (): Promise<UserResponseDTO> => {
  const response = await api.get<UserResponseDTO>("/users/me");
  return response.data;
};

// 내보내기
export const authApi = {
  login,
  register,
  getMe,
};
