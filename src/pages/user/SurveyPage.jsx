import NoNavLayout from "../../components/layouts/NoNavLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetCharacter, useSetMaltu } from "../../hooks/user/useUser"; 
import { useQueryClient } from "@tanstack/react-query";

// 결과 SVG 매핑 (12개 조합)
const resultSVGs = {
  "실속형 미식파": "/result/silsok-misikpa.svg",
  "실속형 스타일파": "/result/silsok-stylepa.svg",
  "실속형 취미러": "/result/silsok-chimirer.svg",
  "실속형 생활러": "/result/silsok-life.svg",

  "감정형 미식파": "/result/gamjung-misikpa.svg",
  "감정형 스타일파": "/result/gamjung-stylepa.svg",
  "감정형 취미러": "/result/gamjung-chimirer.svg",
  "감정형 생활러": "/result/gamjung-life.svg",

  "무의식형 미식파": "/result/muuisik-misikpa.svg",
  "무의식형 스타일파": "/result/muuisik-stylepa.svg",
  "무의식형 취미러": "/result/muuisik-chimirer.svg",
  "무의식형 생활러": "/result/muuisik-life.svg",
};

// character 문자열 ↔ ID 매핑
const characterIdMap = {
  "실속형 미식파": 1,
  "실속형 스타일파": 2,
  "실속형 취미러": 3,
  "실속형 생활러": 4,
  "감정형 미식파": 5,
  "감정형 스타일파": 6,
  "감정형 취미러": 7,
  "감정형 생활러": 8,
  "무의식형 미식파": 9,
  "무의식형 스타일파": 10,
  "무의식형 취미러": 11,
  "무의식형 생활러": 12,
};

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const queryClient = useQueryClient();

  // 캐릭터 저장, 말투 저장 훅
  const { mutate: saveCharacter } = useSetCharacter();
  const { mutate: saveMaltu } = useSetMaltu();

  // 결과 매핑
  const q1Result = ["실속형", "감정형", "무의식형"];
  const q2Result = ["미식파", "스타일파", "취미러", "생활러"];

  // 최종 결과 문자열
  const finalResult =
    answers[1] !== undefined && answers[2] !== undefined
      ? `${q1Result[answers[1]]} ${q2Result[answers[2]]}`
      : "";

  const handleNext = () => {
    if (step === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("result");
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-black"></div>
        <p className="mt-4 sur-loading-font">소비 성향을 분석하고 있어요</p>
      </div>
    );
  }

  // 결과 화면
  if (step === "result") {
    const handleSaveCharacter = () => {
  if (!finalResult) return;

  const characterId = characterIdMap[finalResult];
  const selectedMaltuId = answers[4]; // ✅ 설문 말투 성향 결과

  saveCharacter(characterId, {
    onSuccess: () => {
      if (selectedMaltuId) {
       saveMaltu(selectedMaltuId, {
  onSuccess: () => {
    // ✅ currentMaltu 최신화
    queryClient.invalidateQueries({ queryKey: ["currentMaltu"] });
    nav("/settings");
  },
  onError: (err) => console.error("말투 저장 실패:", err),
});
      } else {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        nav("/settings");
      }
    },
    onError: (err) => console.error("캐릭터 저장 실패:", err),
  });
};

    return (
      <div className="flex flex-col items-center justify-around h-full bg-[#D9F5EE] px-6">
        {/* 결과 컨테이너 */}
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md py-4 px-8 flex flex-col items-center">
          {finalResult && (
            <img
              src={resultSVGs[finalResult]}
              alt={finalResult}
              className="w-full"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* 하단 텍스트 */}
          <p className="survey-fighting-font">당신의 절약을 응원합니다!</p>

          {/* 시작 버튼 */}
          <button
            onClick={handleSaveCharacter}
            className="start-akkimi-font flex justify-center items-center gap-[10px] self-stretch px-[12px] py-[12px] rounded-[100px] bg-gradient-to-t from-[#5ACBB0] to-[#03FFDA]"
          >
            아끼미 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 질문 화면
  return (
    <NoNavLayout>
      <div className="relative w-full flex flex-col min-h-full bg-[#E3FFF9]">
        <div className="w-full flex flex-col items-center py-6">
          <h1 className="sur-title-font py-2">소비/성향 테스트</h1>
          <div className="w-[85%]">
            <div className="flex justify-between sur-percent-font mb-1">
              <span>진행도</span>
              <span>{step}/4</span>
            </div>
            <div className="w-full rounded-[30px] bg-[#DDE2E7] h-3">
              <div
                className="bg-[#5ACBB0] h-3 rounded-[30px]"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6">
          {step === 1 && (
            <Question
              step={1}
              subtitle="온라인에서 마음에 드는 옷을 발견했다!"
              question="어떤 결정을 할까?"
              options={[
                "다른 쇼핑몰도 확인해볼까? 더 싼 곳을 찾자",
                "오늘 진짜 힘들었으니까… 힐링용으로 구매!",
                "어라, 이미 샀었잖아? 언제 주문했지..?",
              ]}
              onSelect={(i) => setAnswers({ ...answers, 1: i })}
              selected={answers[1]}
            />
          )}
          {step === 2 && (
            <Question
              step={2}
              subtitle="내 지갑이 가난한 이유를 찾아보자"
              question={
                <>
                  당신의 지갑을 가장 많이 <br />
                  털어가는 범인은?
                </>
              }
              options={[
                "사람이 굶으면 안되지!(미식파)",
                "나는 꾸미는건 포기 못해(스타일파)",
                "이번엔 진짜 마스터할거야(취미러)",
                "생필품은 인생에서 뺄 수 없지(생활러)",
              ]}
              onSelect={(i) => setAnswers({ ...answers, 2: i })}
              selected={answers[2]}
            />
          )}
          {step === 3 && (
            <MultiQuestion
              step={3}
              subtitle="나도 이제부터 아끼미!"
              question={
                <>
                  가장 많이 줄이고 싶은
                  <br />
                  소비항목은? (중복선택)
                </>
              }
              options={[
                "배달·외식",
                "디저트",
                "커피",
                "뷰티·패션",
                "취미·여가",
                "생필품",
                "충동구매",
                "친목",
                "자기개발",
              ]}
              onSelect={(list) => setAnswers({ ...answers, 3: list })}
              selected={answers[3] || []}
            />
          )}
          {step === 4 && (
            <Question
              step={4}
              subtitle="내 절약을 도와줘!"
              question={
                <>
                  누군가 절약을 도와주려 할 때
                  <br /> 어떤 말투가 좋을까?
                </>
              }
              options={[
                { id: 1, label: "부드러운 존댓말과 함께 격려해주는 말투" },
                { id: 2, label: "단호하고 간결하게 절약을 독려하는 말투" },
                { id: 3, label: "다정한 친구같은 반말로 권유하는 말투" },
                { id: 4, label: "숫자와 데이터를 중심으로 분석해주는 말투" },
              ]}
              onSelect={(id) => setAnswers({ ...answers, 4: id })}
              selected={answers[4]}
              isObjectOptions
            />
          )}
        </div>

        <div className="w-full">
          <button
            className={`absolute left-1/2 -translate-x-1/2 bottom-10
              sur-next-font flex w-[248px] h-[56px] px-6 py-4 justify-center items-center gap-[10px] rounded-[30px] ${
                isDisabled(answers, step) ? "bg-[#A6AEB6]" : "bg-[#5ACBB0]"
              }`}
            onClick={handleNext}
            disabled={isDisabled(answers, step)}
          >
            {step === 4 ? "결과 확인하기" : "다음"}
          </button>
        </div>
      </div>
    </NoNavLayout>
  );
}

// 버튼 비활성화 조건
function isDisabled(answers, step) {
  if (step === 3) return (answers[3] || []).length === 0;
  return answers[step] === undefined;
}

// 단일 선택 컴포넌트
function Question({
  subtitle,
  question,
  options,
  onSelect,
  selected,
  isObjectOptions,
}) {
  return (
    <div className="w-full flex flex-col items-center gap-[10px] p-[32px_24px] rounded-[24px] bg-white mb-20">
      {subtitle && (
        <p className="text-center text-sm sur-situation-font">{subtitle}</p>
      )}
      <h2 className="text-xl sur-question-font text-center pb-7">{question}</h2>
      <div className="flex flex-col gap-3 mt-2 w-full">
        {options.map((opt, i) => {
          const value = isObjectOptions ? opt.id : i;
          const label = isObjectOptions ? opt.label : opt;
          return (
            <button
              key={value}
              className={`p-4 ${
                selected === value
                  ? "sur-chosen-font flex w-full h-full px-4 py-4 justify-center items-center gap-[10px] rounded-[8px] bg-[#5ACBB0]"
                  : "sur-notchosen-font flex w-full h-full px-4 py-4 justify-center items-center gap-[10px] rounded-[8px] bg-[#DDE2E7]"
              }`}
              onClick={() => onSelect(value)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 다중 선택 컴포넌트
function MultiQuestion({ subtitle, question, options, onSelect, selected }) {
  const toggleOption = (i) => {
    const newSelection = selected.includes(i)
      ? selected.filter((v) => v !== i)
      : [...selected, i];
    onSelect(newSelection);
  };

  return (
    <div className="w-full flex flex-col items-center gap-[10px] p-[48px_24px] rounded-[24px] bg-white mb-20">
      {subtitle && (
        <p className="text-center text-sm sur-situation-font">{subtitle}</p>
      )}
      <h2 className="text-xl sur-question-font text-center pb-7">{question}</h2>
      <div className="grid grid-cols-3 gap-2 w-full">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`sur-notchosen-font flex w-full px-2 py-3 justify-center items-center gap-[8px] rounded-[8px] ${
              selected.includes(i)
                ? " bg-[#5ACBB0] sur-3-chosen-font"
                : "bg-[#DDE2E7] sur-3-notchosen-font"
            }`}
            onClick={() => toggleOption(i)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
