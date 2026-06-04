export interface UserLoginRequestDTO {
  userName: string;
  password: string;
}

export interface UserSignUpRequestDTO {
  userName: string;
  password: string;
  email: string;
  nickName: string;
}

export interface UserResponseDTO {
  userid: number;
  id?: number;
  userName: string;
  email: string;
  nickName: string;
  token: string;
}
