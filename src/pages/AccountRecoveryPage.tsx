import { ChevronLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountRecoveryPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("id");

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 뒤로가기 */}
      <div className="flex items-center h-14 px-4 shrink-0">
        <button
          onClick={() => navigate("/login")}
          className="p-1 rounded-full text-gray-900 active:scale-95 transition-transform bg-gray-50 hover:bg-gray-100"
        >
          <ChevronLeft size={28} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          계정 찾기
        </h1>
        {/* 탭 버튼 영역 */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setTab("id")}
            className={`flex-1 pb-3 text-sm font-bold transition-colors ${
              tab === "id"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-400"
            }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => setTab("pw")}
            className={`flex-1 pb-3 text-sm font-bold transition-colors ${
              tab === "pw"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-400"
            }`}
          >
            비밀번호 재설정
          </button>
        </div>

        {/* 탭 내용 렌더링 영역 */}
        {tab === "id" ? (
          // [아이디 찾기]
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <input
              type="text"
              placeholder="가입 시 사용한 이름"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <input
              type="email"
              placeholder="가입 시 사용한 이메일"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />

            <button className="w-full bg-blue-500 text-white font-bold rounded-xl py-4 mt-4 active:scale-[0.98] transition-all hover:bg-blue-600 shadow-sm shadow-blue-500/20">
              아이디 찾기
            </button>
          </div>
        ) : (
          // [비밀번호 재설정]
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <p className="text-xs text-gray-500 mb-2 leading-relaxed">
              가입하신 이메일 주소를 입력해 주세요.
              <br />
              비밀번호 재설정 링크를 보내드립니다.
            </p>
            <input
              type="email"
              placeholder="이메일"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />

            <button className="w-full bg-gray-900 text-white font-bold rounded-xl py-4 mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <KeyRound size={18} />
              재설정 링크 받기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountRecoveryPage;
