import api from "./axiosInstance";
import type {
  UserLoginRequestDTO,
  UserSignUpRequestDTO,
  UserResponseDTO,
} from "../types/userTypes";

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
    "/users/register",
    signUpData,
  );
  return response.data;
};

// 내 정보 가져오기 API
export const getMe = async (userId: number): Promise<UserResponseDTO> => {
  const response = await api.get<UserResponseDTO>(`/users/me?userId=${userId}`);
  return response.data;
};

// 아이디 찾기 API 호출
export const findUsername = async (data: {
  nickName: string;
  email: string;
}) => {
  const response = await api.post<{ userName: string; email: string }>(
    "/users/find-username",
    data,
  );
  return response.data;
};

// 비밀번호 재설정 API 호출
export const resetPassword = async (data: { email: string }) => {
  const response = await api.post<{ message: string }>(
    "/users/reset-password",
    data,
  );
  return response.data;
};

// 마이페이지 비밀번호 변경 API 호출
export const changePassword = async (
  userId: number,
  data: { currentPassword: string; newPassword: string },
): Promise<UserResponseDTO> => {
  const response = await api.put<UserResponseDTO>(`/users/${userId}`, data);
  return response.data;
};

// 내보내기
export const authApi = {
  login,
  register,
  getMe,
  findUsername,
  resetPassword,
  changePassword,
};
