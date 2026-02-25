import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserSignUpRequestDTO } from "../types/userTypes";
import { register } from "../api/authApi";
import { ChevronLeft, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const credentials: UserSignUpRequestDTO = {
        userName,
        password,
        email,
        nickName,
      };
      const userData = await register(credentials);
      console.log("회원가입 성공!", userData);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 뒤로가기 */}
      <div className="flex items-center h-14 px-4 border-b border-gray-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-900 active:scale-95 transition-transform hover:bg-gray-100 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">회원가입</span>
      </div>

      {/* 본문 */}
      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            거의 다 왔어요!
          </h1>
          <p className="text-gray-500 text-sm">
            트리플과 함께할 계정을 만들어주세요.
          </p>

          {/* 입력 폼 */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                이름
              </label>
              <input
                type="text"
                placeholder="홍길동"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                아이디
              </label>
              <input
                type="email"
                placeholder="example@triple.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="8자리 이상 영문, 숫자 조합"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="비밀번호를 한번 더 입력해주세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          {/* 가입 버튼 */}
          <button className="w-full bg-blue-500 text-white font-bold rounded-xl py-4 mt-2 hover:bg-blue-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-sm shadow-blue-500/20">
            <UserPlus size={20} />
            가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
