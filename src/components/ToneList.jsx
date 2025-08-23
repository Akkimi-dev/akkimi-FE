import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Goback3Arrow from "../assets/Settings/gobackarrow3.svg?react";
import { createMaltu } from "../apis/userApis";

export default function ToneList() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleAddTone = async () => {
    if (!name.trim() || !description.trim()) {
      setErrorModal(true);
      return;
    }

    try {
      // ✅ 서버에 저장
      const newTone = await createMaltu(name, true, description);

      // ✅ 성공 모달 띄우고 → 닫을 때 nav(-1) + 데이터 전달
      setSuccessModal(true);

      setTimeout(() => {
        setSuccessModal(false);
        nav(-1, { state: { newTone: newTone.result } });
      }, 1000);
    } catch (err) {
      console.error("말투 생성 에러:", err);
      setErrorModal(true);
    }
  };

  return (
    <div className="max-w-full mx-auto min-h-screen bg-white flex flex-col">
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
        <div>
          <label className="block maltu-make-subtitle-font mb-1">말투 제목</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block maltu-make-subtitle-font mb-1">프롬프트</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex w-full p-4 rounded-[16px] border border-[#DDE2E7] bg-[#F1F1F5]"
          />
        </div>

        <button
          onClick={handleAddTone}
          className="mt-4 bg-[#5ACBB0] text-white py-2 rounded-lg"
        >
          저장하기
        </button>
      </main>

      {/* 에러 모달 */}
      {errorModal && (
        <div className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-2xl shadow-lg p-6 w-[300px] text-center">
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
        <div className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-2xl shadow-lg p-6 w-[300px] text-center">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            말투가 성공적으로 저장되었습니다!
          </h2>
        </div>
      )}
    </div>
  );
}
