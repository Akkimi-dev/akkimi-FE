
import NoNavLayout from "../../components/layouts/NoNavLayout";
import { useState } from "react";

export default function SurveyPage() {
  const [step, setStep] = useState(1); // 현재 질문 번호
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // 결과 매핑
  const q1Result = ["알잘딱깔센", "대문자 F", "지갑 암살자"];
  const q2Result = ["미식파", "스타일파", "취미파", "생활파"];

  const handleNext = () => {
    if (step === 4) {
      // 로딩 처리
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("result");
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  // 버튼 비활성화 조건 (0도 valid 처리)
  const isDisabled = () => {
    if (step === 3) return !answers[3] || answers[3].length === 0;
    return answers[step] === undefined;
  };

  // 최종 결과값
  const finalResult =
    answers[1] !== undefined && answers[2] !== undefined
      ? `${q1Result[answers[1]]} ${q2Result[answers[2]]}`
      : "";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-black "></div>
        <p className="mt-4 sur-loading-font">소비 성향을 분석하고 있어요</p>
      </div>
    );
  }

  if (step === "result") {
    // 결과 localStorage 저장
    localStorage.setItem(
      "surveyResult",
      JSON.stringify({
        type: finalResult,
        tone: answers[4],
      })
    );

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold">내 소비 성향 결과</h2>
        <p className="mt-4 text-lg">{finalResult}</p>
        <p className="text-sm text-gray-500">말투: {answers[4]}</p>
      </div>
    );
  }

  return (
    <NoNavLayout>
      <div className="max-w-md mx-auto flex flex-col h-screen bg-[#E3FFF9]">
        {/* 상단 제목 + 진행도 */}
        <div className="w-full flex flex-col items-center py-6">
          <h1 className="sur-title-font mt-8 mb-4">
            소비/성향 테스트
          </h1>
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

       {/* 질문 */}
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
      question={<>당신의 지갑을 가장 많이 <br />털어가는 범인은?</>}
      options={[
        "사람이 굶으면 안되지!(미식파)",
        "나는 꾸미는건 포기 못해(스타일파)",
        "이번엔 진짜 마스터할거야(취미파)",
        "생필품은 인생에서 뺄 수 없지(생활파)",
      ]}
      onSelect={(i) => setAnswers({ ...answers, 2: i })}
      selected={answers[2]}
    />
  )}
  {step === 3 && (
    <MultiQuestion
      step={3}
      subtitle="나도 이제부터 아끼미!"
      question={<>가장 많이 줄이고 싶은<br />소비항목은? (중복선택)</>}
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
      question={<>누군가 절약을 도와주려 할 때<br /> 어떤 말투가 좋을까?</>}
      options={[
        "20년지기 같은 친근한 말투",
        "이모티콘을 많이 쓰는 귀여운 말투",
        "예의범절을 갖춘 깍듯한 말투",
        "나를 가르쳐주는 선생님 말투",
      ]}
      onSelect={(i) => setAnswers({ ...answers, 4: i })}
      selected={answers[4]}
    />
  )}
</div>

       {/* 버튼 */}
        <div className="w-full">
          <button
            className={`fixed left-1/2 -translate-x-1/2 bottom-10
              sur-next-font flex w-[248px] h-[56px] px-6 py-4 justify-center items-center gap-[10px] rounded-[30px] ${
                isDisabled() ? "bg-[#A6AEB6]" : "bg-[#5ACBB0]"
              }`}
            onClick={handleNext}
            disabled={isDisabled()}
          >
            {step === 4 ? "결과 확인하기" : "다음"}
          </button>
        </div>
      </div>
    </NoNavLayout>
  );
}

// 단일 선택 컴포넌트
function Question({ subtitle, question, options, onSelect, selected }) {
  return (
    <div className="w-full flex flex-col items-center gap-[10px] p-[32px_24px] rounded-[24px] bg-white mb-20">
      {/* 서브 타이틀 */}
      {subtitle && (
        <p className="text-center text-sm sur-situation-font">
          {subtitle}
        </p>
      )}

      {/* 질문 */}
      <h2 className="text-xl sur-question-font text-center pb-7">{question}</h2>

      {/* 선택지 */}
      <div className="flex flex-col gap-3 mt-2 w-full">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`p-4
              ${
                selected === i
                  ? "sur-chosen-font flex w-full h-full px-4 py-4 justify-center items-center gap-[10px] rounded-[8px] bg-[#5ACBB0]"
                  : "sur-notchosen-font flex w-full h-full px-4 py-4 justify-center items-center gap-[10px] rounded-[8px] bg-[#DDE2E7]"
                  
              }`}
            onClick={() => onSelect(i)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// 다중 선택 컴포넌트 (3열)
function MultiQuestion({ subtitle, question, options, onSelect, selected }) {
  const toggleOption = (i) => {
    const newSelection = selected.includes(i)
      ? selected.filter((v) => v !== i)
      : [...selected, i];
    onSelect(newSelection);
  };

  return (
    <div className="w-full flex flex-col items-center gap-[10px] p-[48px_24px] rounded-[24px] bg-white mb-20">
      {/* 서브 타이틀 */}
      {subtitle && (
        <p className="text-center text-sm sur-situation-font">
          {subtitle}
        </p>
      )}

      {/* 질문 */}
      <h2 className="text-xl sur-question-font text-center pb-7">{question}</h2>

      {/* 선택지 (3열 카드형) */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`sur-notchosen-font flex w-full px-2 py-3 justify-center items-center gap-[8px] rounded-[8px]
              ${
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
