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
    userName: string;
    email: string;
    nickName: string;
}