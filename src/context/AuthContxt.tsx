import React, { createContext, useContext, useState } from "react";
import { login as apiLogin } from '../api/authApi'
import type { UserLoginRequestDTO, UserResponseDTO } from "../types/userTypes";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    currentUser: UserResponseDTO | null;
    login: (credentials: UserLoginRequestDTO) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (credentials: UserLoginRequestDTO) => {
        setIsLoading(true);
        try {
            const userData = await apiLogin(credentials);
            setCurrentUser(userData);
            console.log("AuthContext: 로그인 성공", userData);
            navigate('/');
        } catch (error) {
            console.error("AuthContext: 로그인 실패", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        console.log("AuthContext: 로그아웃됨");
        navigate('/login');
    };

    const value = {
        currentUser,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth는 AuthProvider 안에서만 써야 됨");
    }
    return context;
};