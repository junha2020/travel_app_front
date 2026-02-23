import axios from "axios";
import type {
  UserLoginRequestDTO,
  UserSignUpRequestDTO,
  UserResponseDTO,
} from "../types/userTypes";

const API_BASE_URL = "http://localhost:8080/api/users";

// 로그인 API 호출 함수
/* @Param credentials - userName, password 들어간 객체 */
export const login = async (
  credentials: UserLoginRequestDTO,
): Promise<UserResponseDTO> => {
  try {
    const response = await axios.post<UserResponseDTO>(
      `${API_BASE_URL}/login`,
      credentials,
    );
    return response.data;
  } catch (error) {
    throw new Error("로그인 실패");
  }
};

// 회원가입 API 호출 함수
/* @Param signUpData - 회원가입 폼 데이터 */
export const register = async (
  signUpData: UserSignUpRequestDTO,
): Promise<UserResponseDTO> => {
  try {
    const response = await axios.post<UserResponseDTO>(
      `${API_BASE_URL}/register`,
      signUpData,
    );
    return response.data;
  } catch (error) {
    throw new Error("회원가입 실패");
  }
};

// 내 정보 가져오기 API
export const getMe = async (): Promise<UserResponseDTO> => {
  try {
    const response = await axios.get<UserResponseDTO>(`${API_BASE_URL}/me`);
    return response.data;
  } catch (error) {
    throw new Error("내 정보를 가져오지 못함");
  }
};

// 내보내기
export const authApi = {
  login,
  register,
  getMe,
};
