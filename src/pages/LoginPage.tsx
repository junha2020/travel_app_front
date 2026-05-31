import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { AxiosError } from "axios";
import { Compass, LogIn, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 로그인 성공 시 실행될 로직
      setUser(data);
      localStorage.setItem("token", data.token);
      alert("로그인 성공!");
      navigate("/");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "로그인 실패";
      alert(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white">
      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 text-white">
        <Compass size={36} />
      </div>
      <h1 className="text-2xl font-bold mb-2 text-gray-900">여행의 시작</h1>
      <p className="text-gray-500 text-sm mb-8 text-center">
        로그인하고 나만의 일정을
        <br />
        계획해보세요.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="아이디"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          required
        />
        
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white font-bold rounded-xl py-3.5 mt-4 hover:bg-blue-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-sm shadow-blue-500/20"
        >
          <LogIn size={18} />
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex justify-center gap-4 mt-4 text-xs font-bold text-gray-400">
          <button
            type="button"
            onClick={() => navigate("/find-account")}
            className="hover:text-gray-600"
          >
            비밀번호 찾기
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="hover:text-gray-600 text-blue-500"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
