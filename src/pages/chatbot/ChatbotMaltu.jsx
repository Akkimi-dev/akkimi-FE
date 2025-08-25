import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dropdown2Icon from "../../assets/settings/dropdown2.svg?react";
import Plus2Icon from "../../assets/settings/plus2.svg?react";
import Goback2Icon from "../../assets/settings/gobackarrow2.svg?react";
import Goback3Arrow from "../../assets/settings/gobackarrow3.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";

import {
  useMyMaltus,
  usePublicMaltus,
  useSetMaltu,
  useCurrentMaltu,
} from "../../hooks/chat/useMaltu";

export default function ChatbotMaltu() {
  const nav = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // ✅ 현재 말투 변경 mutation
  const { mutate: setMaltuMutation } = useSetMaltu();

  // ✅ 현재 말투 조회
  const { data: currentMaltu, isLoading: currentMaltuLoading } = useCurrentMaltu();

  // ✅ 내 말투 목록
  const { data: myMaltus = [] } = useMyMaltus();

  // ✅ 공개 말투 목록
  const { data: publicMaltus = [] } = usePublicMaltus();

  // ✅ 내 말투 페이지네이션
  const chunkedTones = [];
  for (let i = 0; i < myMaltus.length; i += 3) {
    chunkedTones.push(myMaltus.slice(i, i + 3));
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
          {/* ✅ 현재 말투 */}
          <section className="px-4">
            <h2 className="maltu-mine mb-2">현재 말투</h2>
            <div
              className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 cursor-pointer"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span className="text-sm text-gray-700">
                {currentMaltuLoading
                  ? "불러오는 중..."
                  : currentMaltu
                  ? currentMaltu.maltuName
                  : "선택된 말투 없음"}
              </span>
              <Dropdown2Icon
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showDescription ? "rotate-180" : ""
                }`}
              />
            </div>

            {showDescription && currentMaltu && (
              <div className=" maltu-detail-font mt-1 px-3 py-2 rounded-[12px] border border-[#DDE2E7] bg-[#F1F1F5] shadow flex p-4 justify-between items-center self-stretch">
                {currentMaltu.prompt}
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

            {myMaltus.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">
                아직 저장된 말투가 없습니다.
              </p>
            ) : (
              <>
                <div
                  className="flex overflow-x-auto snap-x snap-mandatory gap-4"
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
                          key={tone.maltuId}
                          className={`flex mb-1 items-center justify-between rounded-2xl p-4 shadow-sm cursor-pointer transition ${
                            currentMaltu?.maltuId === tone.maltuId
                              ? "border border-[#5ACBB0] bg-[#E6FAF6]"
                              : "border border-gray-200"
                          }`}
                        >
                          {/* 왼쪽: 말투 라벨 */}
                          <div
                            className="flex items-center gap-2"
                            onClick={() => nav(`/tone/${tone.maltuId}`)}
                          >
                            <span className="text-sm font-medium">
                              {tone.maltuName}
                            </span>
                            <Goback2Icon className="w-4 h-4" />
                          </div>

                          {/* 오른쪽: 라디오 버튼 */}
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                              currentMaltu?.maltuId === tone.maltuId
                                ? "border-[#5ACBB0] bg-[#5ACBB0]"
                                : "border-gray-300"
                            }`}
                            onClick={() => setMaltuMutation(tone.maltuId)}
                          >
                            {currentMaltu?.maltuId === tone.maltuId && (
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
              { publicMaltus.slice(0, visibleCount).map((tone) => (
                <div
                  key={tone.maltuId}
                  className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white"
                  onClick={() => nav(`/tone/${tone.maltuId}`, { state: { tone } })}
                >
                  <span className="maltu-public-name">{tone.maltuName}</span>
                  <Goback2Icon className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            {visibleCount < publicMaltus.length && (
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
      </div>
    </NoNavLayout>
  );
}
