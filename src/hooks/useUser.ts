import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { use, useEffect } from "react";

export const useUser = () => {
  const { user, setUser } = useAuthStore();

  const query = useQuery({
    queryKey:: ["me"],
    queryFn: authApi.getMe,
    // 로그인 상태일 때만자동으로 fetch 하도록 설정
    enabled: !!localStorage.getITem("auth-storage"),
    retry: false,
  });

  // 서버에서 유저 데이터를 가져오면 Zustand 스토어에 동기화
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return {
    ...query,
    user, // Zustand에 저장된 유저 정보 반환
    isLoggedIn: !!user,
  }
};
