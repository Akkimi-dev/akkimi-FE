import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Goback3Arrow from "../../assets/Settings/gobackarrow3.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";

export default function ToneDetailPage() {
  const nav = useNavigate();
  const location = useLocation();
  const tone = location.state?.tone;

  if (!tone) return <p>잘못된 접근입니다.</p>;

  const handleApply = () => {
    // ✅ 선택한 말투 저장
    localStorage.setItem("selectedTone", JSON.stringify(tone));

    // storage 이벤트 강제 발생 → 다른 탭/컴포넌트 동기화
    window.dispatchEvent(new Event("storage"));

    nav(-1);
  };

  return (
    <NoNavLayout>
      <div className="w-full h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="flex items-center px-4 py-3 border-b">
          <button className="mr-2" onClick={() => nav(-1)}>
            <Goback3Arrow className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-semibold">
            말투 상세
          </h1>
          <div className="w-5" />
        </header>

        {/* 본문 */}
        <main className="flex-1 p-5 overflow-auto">
          <h2 className="text-[#5ACBB0] text-sm font-semibold mb-1">말투 제목</h2>
          <p className="text-lg font-bold mb-4">{tone.label}</p>

          <h3 className="text-[#5ACBB0] text-sm font-semibold mb-2">프롬프트</h3>
          <div className="p-4 rounded-xl border border-gray-300 bg-[#F1F1F5] text-sm leading-relaxed whitespace-pre-line">
            {tone.description}
          </div>
        </main>

        {/* 적용하기 버튼 */}
        <footer className="p-4 border-t">
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl bg-[#5ACBB0] text-white font-semibold"
          >
            적용하기
          </button>
        </footer>
      </div>
    </NoNavLayout>
  );
}
