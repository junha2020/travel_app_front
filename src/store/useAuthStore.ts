import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponseDTO } from "../types/userTypes";

interface AuthState {
  user: UserResponseDTO | null;
  isLoggedIn: boolean;
  // 유저 정보 저장 및 로그인 상태 변경
  setUser: (user: UserResponseDTO | null) => void;
  // 로그아웃 시 초기화
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
