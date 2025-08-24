import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Goback3Arrow from "../../assets/settings/gobackarrow3.svg?react";
import { useCreateMaltu } from "../../hooks/chat/useMaltu";

export default function ToneList() {
  const nav = useNavigate();

  // 입력 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 모달 상태
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // ✅ API 기반 말투 생성 mutation
  const { mutate: createMaltu } = useCreateMaltu();

  const handleAddTone = () => {
    if (!name.trim() || !description.trim()) {
      setErrorModal(true);
      return;
    }

    // ✅ 서버에 저장
    createMaltu(
      {
        maltuName: name,
        isPublic: false, // 기본적으로 비공개 저장
        prompt: description,
      },
      {
        onSuccess: () => {
          setSuccessModal(true);
        },
      }
    );
  };

  return (
    <div className="max-w-full mx-auto min-h-full bg-white flex flex-col">
      <div className="h-[40px]" />

      {/* 헤더 */}
      <header className="flex items-center px-4 py-3">
        <button className="mr-2" onClick={() => nav(-1)}>
          <Goback3Arrow className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">
          새 말투 만들기
        </h1>
        <div className="w-5" />
      </header>

      {/* 메인 */}
      <main className="flex flex-col gap-6 mt-4 px-4">
        {/* 말투 제목 */}
        <div>
          <label className="block maltu-make-subtitle-font mb-1">말투 제목</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* 프롬프트 */}
        <div>
          <label className="block maltu-make-subtitle-font mb-1">프롬프트</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex w-full p-4 justify-between items-center self-stretch
         rounded-[16px] border border-[#DDE2E7] bg-[#F1F1F5]
         shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)]"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleAddTone}
          className="mt-4 bg-[#5ACBB0] text-white py-2 rounded-lg"
        >
          저장하기
        </button>
      </main>

      {/* 에러 모달 */}
      {errorModal && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-2xl shadow-lg p-6 w-[300px] text-center z-50">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            내용을 모두 입력해주세요!
          </h2>
          <button
            onClick={() => setErrorModal(false)}
            className="mt-2 px-4 py-2 bg-[#5ACBB0] text-white rounded-lg"
          >
            확인
          </button>
        </div>
      )}

      {/* 성공 모달 */}
      {successModal && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-2xl shadow-lg p-6 w-[300px] text-center z-50">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            말투가 성공적으로 저장되었습니다!
          </h2>
          <button
            onClick={() => {
              setSuccessModal(false);
              nav(-1); // 뒤로 가서 내 말투 리스트 확인
            }}
            className="mt-2 px-4 py-2 bg-[#5ACBB0] text-white rounded-lg"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
