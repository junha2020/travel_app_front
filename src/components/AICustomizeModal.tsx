import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { planApi } from "../api/planApi";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, X } from "lucide-react";

interface AICustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICustomizeModal = ({
  isOpen,
  onClose,
}: AICustomizeModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();

  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [theme, setTheme] = useState("");

  // 실시간 AI 일정 빌드업 API 호출
  const aiMutation = useMutation({
    mutationFn: () =>
      planApi.generateAIPlan({
        cityName: city,
        days: days,
        theme: theme,
        userId: user!!.id || user!.userid,
      }),
    onSuccess: (newPlanId) => {
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
      onClose();
      resetForm();
      navigate(`/planner/${newPlanId}`); // 새로 생성된 플래너로 이동
    },
    onError: (err: any) => {
      alert("AI 일정 생성 중 에러가 발생했습니다: " + err.message);
      setStep(3); // 마지막 단계로 되돌림
    },
  });

  const resetForm = () => {
    setStep(1);
    setCity("");
    setDays(3);
    setTheme("");
  };

  const handleNext = () => {
    if (step === 1 && !city) {
      alert("여행할 도시를 골라주세요!");
      return;
    }
    if (step === 2 && (!days || days < 1)) {
      alert("최소 1일 이상 여행이어야 합니다!");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (!isLoggedIn || !user) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
    if (!theme) {
      alert("여행 테마를 하나 골라주세요!");
      return;
    }
    aiMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* 반투명 어두운 배경 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 박스 */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-200">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-blue-500 font-extrabold text-sm">
            <Sparkles size={16} className="animate-pluse" />
            AI 맞춤 일정 생성
          </div>
          {step < 4 && !aiMutation.isPending && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* 진행률 인디케이터 */}
        {step < 4 && (
          <div className="w-full bg-gray-100 h-1">
            <div
              className="bg-blue-500 h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* 바디 콘텐트 */}
        <div className="p-6 overflow-y-auto">
          {aiMutation.isPending ? (
            /* AI 연산 중 로딩 모션 */
            <div className="py-12 flex flex-col items-center justify-center text-center gap-5">
              <Loader2 className="text-blue-500 animate-spin" size={48} />
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {user?.nickName || user?.userName || "여행자"}님의 취향 맞춤
                  코스 분석 중...
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  AI가 [{city}]의 가장 동선 효율이 좋은
                  <br />[{days}일간의 {theme} 코스]를 설계하고 있습니다. 조금만
                  기다려주세요!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 1단계: 도시 선택 */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-extrabold text-base text-gray-900">
                    어디로 떠나시나요?
                  </h3>
                  <div className="gird gird-cols-2 gap-2.5 mt-2">
                    {["도쿄", "오사카", "후쿠오카", "삿포로"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className={`p-4 rounded-xl border text-sm font-bold transition-all text-center
                          ${
                            city === c
                              ? "border-blue-500 bg-blue-50/60 text-blue-600 shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2단계: 여행 일수 선택 */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-extrabold text-base text-gray-900">
                    며칠 동안 여행하시나요?
                  </h3>
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="font-bold text-sm text-gray-700">
                        총 여행 기간
                      </span>
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => setDays((d) => Math.max(1, d - 1))}
                          className="w-8 h-8 rounded-md bg-gray-50 hover:bg-gray-100 font-extrabold text-gray-600 active:scale-95 transition-transform"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-base w-8 text-center text-gray-900">
                          {days}일
                        </span>
                        <button
                          onClick={() => setDays((d) => Math.min(7, d + 1))}
                          className="w-8 h-8 rounded-md bg-gray-50 hover:bg-gray-100 font-extrabold text-gray-600 active:scale-95 transition-transform"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold px-1">
                      * 무료 API 한도로 최대 7일까지 설정이 가능합니다.
                    </span>
                  </div>
                </div>
              )}

              {/* 3단계: 여행 테마 선택 */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-extrabold text-base text-gray-900">
                    어떤 취향의 여행을 원하시나요
                  </h3>
                  <div className="flex flex-col gap-2 mt-2">
                    {[
                      {
                        key: "미식 탐방",
                        label: "🍜 맛있는 먹방 투어 (식도락)",
                      },
                      {
                        key: "명소 관광",
                        label: "📸 핫플 & 대표 랜드마크 뿌시기",
                      },
                      {
                        key: "온천 힐링",
                        label: "♨️ 힐링 가득 여유로운 온천 휴식",
                      },
                    ].map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTheme(t.key)}
                        className={`p-4 rounded-xl border text-left text-sm font-bold transition-all ${
                          theme === t.key
                            ? "border-blue-500 bg-blue-50/60 text-blue-600 shadow-sm"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 제어 버튼 영역 */}
        {!aiMutation.isPending && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-2.5 justify-between shrink-0">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <ArrowLeft size={14} /> 이전으로
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 max-w-[200px] py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-blue-500/10"
              >
                다음 단계 <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-blue-500/20"
              >
                AI 일정 생성하기 <Sparkles size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
