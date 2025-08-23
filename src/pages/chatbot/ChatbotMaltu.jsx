import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Dropdown2Icon from "../../assets/Settings/dropdown2.svg?react";
import Plus2Icon from "../../assets/Settings/plus2.svg?react";
import Goback2Icon from "../../assets/Settings/gobackarrow2.svg?react";
import Goback3Arrow from "../../assets/Settings/gobackarrow3.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";

export default function ChatbotMaltu() {
  const nav = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [myTones, setMyTones] = useState([]);
  const [selectedTone, setSelectedTone] = useState(null);
  const [modalTone, setModalTone] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  
  const [exploreTones, setExploreTones] = useState([
    { id: "t1", label: "격식있는 말투", description: "예의 바르고 정중한 말투" },
    { id: "t2", label: "인생을 상담하는 말투", description: "깊이 있는 조언을 주는 말투" },
    { id: "t3", label: "아이디어를 받는 말투", description: "창의적 아이디어를 주고받는 말투" },
    { id: "t4", label: "당장 자고 싶은 말투", description: "피곤하고 졸린 말투" },
    { id: "t5", label: "이제 그만말투", description: "단호하고 그만하자는 말투" },
  ]);

  // 로컬스토리지에서 초기값 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myTones") || "[]");
    setMyTones(saved);

    const savedSelected = JSON.parse(localStorage.getItem("selectedTone"));
    if (savedSelected) setSelectedTone(savedSelected);
  }, []);

  // storage 이벤트 감지 → 다른 페이지에서 적용하기 눌렀을 때 반영
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSelected = JSON.parse(localStorage.getItem("selectedTone"));
      if (savedSelected) setSelectedTone(savedSelected);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 내가 만든 말투 추가
  const handleAddMyTone = (newTone) => {
    const updated = [...myTones, newTone];
    setMyTones(updated);
    localStorage.setItem("myTones", JSON.stringify(updated));

    setExploreTones((prev) => [...prev, newTone]);
  };

  // 말투 다운로드
  const handleDownloadTone = (tone) => {
    const updatedMyTones = [...myTones, tone];
    setMyTones(updatedMyTones);
    localStorage.setItem("myTones", JSON.stringify(updatedMyTones));

    const updatedExplore = exploreTones.filter((t) => t.id !== tone.id);
    setExploreTones(updatedExplore);
  };

  // 페이지네이션용
  const chunkedTones = [];
  for (let i = 0; i < myTones.length; i += 3) {
    chunkedTones.push(myTones.slice(i, i + 3));
  }

  return (
    <NoNavLayout>
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
            <h2 className="maltu-mine mb-2">현재 말투</h2>
            <div
              className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 cursor-pointer"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span className="text-sm text-gray-700">
                {selectedTone ? selectedTone.label : "선택된 말투 없음"}
              </span>
              <Dropdown2Icon
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showDescription ? "rotate-180" : ""
                }`}
              />
            </div>
            {showDescription && selectedTone && (
              <div className="maltu-detail-font mt-1 px-3 py-2 rounded-[12px] border border-[#DDE2E7] bg-[#F1F1F5]
                  shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)] flex p-4 justify-between items-center self-stretch">
                {selectedTone.description}
              </div>
            )}
          </section>

          {/* 내 말투 */}
          <section className="px-4">
            <h2 className="maltu-mine mb-2">내 말투</h2>
            <button
              className="flex justify-between items-center w-full p-4 rounded-2xl bg-[#5ACBB0] shadow text-white font-medium"
              onClick={() => nav("/tone-list")}
            >
              <span className="maltu-make-font"> 말투 생성하기</span>
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
                      className="flex-shrink-0 w-full snap-center flex flex-col gap-2"
                    >
                      {page.map((tone) => (
                        <div
                          key={tone.id}
                          className={`flex mb-2 items-center justify-between rounded-2xl px-4 py-3 shadow-sm cursor-pointer transition 
                            ${
                              selectedTone?.id === tone.id
                                ? "border border-[#5ACBB0] bg-[#E6FAF6]"
                                : "border border-gray-200"
                            }`}
                        >
                          {/* 왼쪽: 말투 라벨 */}
                          <div
                            className="flex items-center gap-2"
                            onClick={() => setModalTone(tone)} // 상세 + 수정 모달 열기
                          >
                            <span className="text-sm font-medium">
                              {tone.label}
                            </span>
                          </div>

                          {/* 오른쪽: 라디오 버튼 */}
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer
                              transition-colors duration-200
                              ${
                                selectedTone?.id === tone.id
                                  ? "border-[#5ACBB0] bg-[#5ACBB0]"
                                  : "border-gray-300"
                              }`}
                            onClick={() => {
                              // ✅ 선택된 말투 갱신
                              setSelectedTone(tone);
                              localStorage.setItem(
                                "selectedTone",
                                JSON.stringify(tone)
                              );

                              // ✅ 다른 컴포넌트에서도 현재 말투가 반영되도록 이벤트 발생
                              window.dispatchEvent(new Event("storage"));
                            }}
                          >
                            {selectedTone?.id === tone.id && (
                              <div className="w-3 h-3 bg-[#5ACBB0] rounded-full" />
                            )}
                          </div>
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
              <h2 className="maltu-mine text-base font-semibold text-gray-700">
                말투 탐색
              </h2>
            </div>

            <div className="flex flex-col gap-3 px-4">
              {exploreTones.slice(0, visibleCount).map((tone) => (
                <div
                  key={tone.id}
                  className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white"
                  onClick={() => nav(`/tone/${tone.id}`, { state: { tone } })}
                >
                  <span className="maltu-public-name">
                    {tone.label}
                  </span>
                  <Goback2Icon className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

             {/* 더보기 버튼 */}
              {visibleCount < exploreTones.length && (
                <div className="flex justify-center mt-4 px-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="flex w-[361px] px-4 py-2 justify-center items-center gap-[10px] rounded-[30px] bg-[#DDE2E7] maltu-more-font"
                  >
                    더보기
                  </button>
                </div>
              )}
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
                className="px-4 py-2 bg-[#5ACBB0] text-white rounded-lg"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </NoNavLayout>
  );
}
