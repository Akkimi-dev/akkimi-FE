import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Goback3Arrow from "../assets/Settings/gobackarrow3.svg?react";

export default function ToneList() {
  const nav = useNavigate();

  // 입력 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 모달 상태
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleAddTone = () => {
    if (!name.trim() || !description.trim()) {
      setErrorModal(true);
      return;
    }

    // 로컬스토리지에 저장 (내 말투 리스트 반영용)
    const savedTones = JSON.parse(localStorage.getItem("myTones") || "[]");
    const newTone = { id: Date.now(), label: name, description };
    localStorage.setItem("myTones", JSON.stringify([...savedTones, newTone]));

    // 성공 모달 열기
    setSuccessModal(true);
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
        {/* 말투 이름 */}
        <div>
          <label className="block text-sm mb-1">말투 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="말투 이름을 입력해주세요"
          />
        </div>

        {/* 말투 설명 */}
        <div>
          <label className="block text-sm mb-1">말투 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 min-h-[200px]"
            placeholder="말투의 특징을 설명해주세요!"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleAddTone}
          className="mt-4 bg-emerald-400 text-white py-2 rounded-lg"
        >
          저장하기
        </button>
      </main>

      {/* 에러 모달 */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h2 className="text-sm font-medium text-gray-800 mb-4">
              내용을 모두 입력해주세요!
            </h2>
            <button
              onClick={() => setErrorModal(false)}
              className="mt-2 px-4 py-2 bg-emerald-400 text-white rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h2 className="text-sm font-medium text-gray-800 mb-4">
              말투가 성공적으로 저장되었습니다!
            </h2>
            <button
              onClick={() => {
                setSuccessModal(false);
                nav(-1); // 뒤로 가서 내 말투 리스트 확인
              }}
              className="mt-2 px-4 py-2 bg-emerald-400 text-white rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
