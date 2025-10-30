import axios from 'axios';
import type {
    UserLoginRequestDTO,
    UserSignUpRequestDTO,
    UserResponseDTO
} from '../types/userTypes'

const API_BASE_URL = 'http://localhost:8080/api/users';

// 로그인 API 호출 함수
/* @Param credentials - userName, password 들어간 객체 */
export const login = async (credentials: UserLoginRequestDTO): Promise<UserResponseDTO> => {
    try {
        const response = await axios.post<UserResponseDTO>(`${API_BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || '로그인 중 오류 발생');
        }
        throw new Error('Network Error');
    }
}

// 회원가입 API 호출 함수
/* @Param signUpData - 회원가입 폼 데이터 */
export const register = async (signUpData: UserSignUpRequestDTO): Promise<UserResponseDTO> => {
    try {
        const response = await axios.post<UserResponseDTO>(`${API_BASE_URL}/register`, signUpData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || '회원가입 중 오류 발생');
        }
        throw new Error('Network Error');
    }
}