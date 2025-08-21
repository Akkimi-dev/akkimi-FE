import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Dropdown2Icon from "../../assets/Settings/dropdown2.svg?react";
import Plus2Icon from "../../assets/Settings/plus2.svg?react";
import Goback2Icon from "../../assets/Settings/gobackarrow2.svg?react";
import Goback3Arrow from "../../assets/Settings/gobackarrow3.svg?react";

export default function ChatbotMaltu() {
  const nav = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [myTones, setMyTones] = useState([]);
  const [selectedTone, setSelectedTone] = useState(null);
  const [modalTone, setModalTone] = useState(null); 
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myTones") || "[]");
    setMyTones(saved);

    const savedSelected = JSON.parse(localStorage.getItem("selectedTone"));
    if (savedSelected) setSelectedTone(savedSelected);
  }, []);

  // 선택한 말투 저장
  const handleSelectTone = (tone) => {
    setSelectedTone(tone);
    localStorage.setItem("selectedTone", JSON.stringify(tone));
  };

  // 페이지네이션용
  const chunkedTones = [];
  for (let i = 0; i < myTones.length; i += 3) {
    chunkedTones.push(myTones.slice(i, i + 3));
  }

  //일단 임시 목업데이터
  const exploreTones = [
    "격식있는 말투",
    "인생을 상담하는 말투",
    "아이디어를 받는 말투",
    "당장 자고 싶은 말투",
    "이제 그만말투",
  ];

  return (
    <div className="w-full max-h-full bg-white flex flex-col overflow-auto">
      {/* 헤더 */}
      <header className="flex items-center px-4 py-3">
        <button className="mr-2" onClick={() => nav(-1)}>
          <Goback3Arrow className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">
          챗봇 말투 설정
        </h1>
        <div className="w-5" />
      </header>

      <main className="flex flex-col gap-6 mt-2">
        {/* 현재 말투 */}
        <section className="px-4">
          <h2 className="text-sm font-semibold mb-2">현재 말투</h2>
          <div
  className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 cursor-pointer"
  onClick={() => setShowDescription(!showDescription)}  // 클릭 시 설명 토글
>
  <span className="text-sm text-gray-700">
    {selectedTone ? selectedTone.label : ""}
  </span>
  <Dropdown2Icon
    className={`w-4 h-4 text-gray-500 transition-transform ${
      showDescription ? "rotate-180" : ""
    }`}
  />
</div>
{/* 설명 드롭다운 */}
{showDescription && selectedTone && (
  <div className="mt-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-yellow">
    {selectedTone.description}
  </div>
)}

        </section>

        {/* 내 말투 */}
        <section className="px-4">
          <h2 className="text-sm text-gray-500 mb-2">내 말투</h2>
          <button
            className="flex justify-between items-center w-full p-4 rounded-2xl bg-[#5ACBB0] shadow text-white font-medium"
            onClick={() => nav("/tone-list")}
          >
            <span> 말투 생성하기</span>
            <Plus2Icon className="w-5 h-5" />
          </button>

          <hr className="w-full border-t border-[#DDE2E7] my-4" />

          {myTones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">
              아직 저장된 말투가 없습니다.
            </p>
          ) : (
            <>
              <div
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-2"
                onScroll={(e) => {
                  const pageIndex = Math.round(
                    e.target.scrollLeft / e.target.clientWidth
                  );
                  setCurrentPage(pageIndex);
                }}
              >
                {chunkedTones.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="flex-shrink-0 w-full snap-center flex flex-col gap-3"
                  >
                    {page.map((tone) => (
                      <div
                        key={tone.id}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm cursor-pointer transition 
                          ${
                            selectedTone?.id === tone.id
                              ? "border border-emerald-400"
                              : "border border-gray-200"
                          }`}
                      >
                        {/* 설명 모달 열기 */}
                        <div
                          className="flex items-center gap-2"
                          onClick={() => setModalTone(tone)}
                        >
                          <span className="text-sm font-medium">
                            {tone.label}
                          </span>
                          <Goback2Icon className="w-4 h-4" />
                        </div>
                        {/* 말투 선택 */}
                        <div
                          onClick={() => handleSelectTone(tone)}
                          className={`w-6 h-6 rounded-full cursor-pointer 
                            ${
                              selectedTone?.id === tone.id
                                ? "bg-emerald-400"
                                : "bg-gray-200"
                            }`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 페이지네이션 점 */}
              <div className="flex justify-center mt-3 gap-2">
                {chunkedTones.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      currentPage === idx ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 말투 탐색 */}
        <section className="w-full bg-[#F1F1F5] py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-sm font-semibold">말투 탐색</h2>
            <div className="flex items-center text-sm text-gray-500 cursor-pointer">
              추천순
              <Dropdown2Icon className="w-4 h-4 ml-1 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4">
            {exploreTones.map((tone, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-xl cursor-pointer"
              >
                <span>{tone}</span>
                <Goback2Icon className="w-4 h-4" />
              </div>
            ))}
          </div>

          <div className="px-4 mt-3">
            <button className="flex w-full px-4 py-2 justify-center items-center gap-[10px] rounded-[30px] bg-[#DDE2E7]">
              더보기
            </button>
          </div>
        </section>
      </main>

      {/* 설명 모달 */}
      {modalTone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h2 className="text-base font-semibold mb-2">{modalTone.label}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line mb-4">
              {modalTone.description}
            </p>
            <button
              onClick={() => setModalTone(null)}
              className="px-4 py-2 bg-emerald-400 text-white rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
