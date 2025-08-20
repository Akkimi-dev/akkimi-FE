import React from "react";
import { useNavigate } from "react-router-dom";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import GobackIcon from "../../assets/Goal/goback.svg?react";
import GoalPeriod from "../../components/GoalPeriod";

export default function GoalCreatePage() {
  const navigate = useNavigate();

  const handleDelete = () => {
    console.log("목표 삭제 클릭됨");
    // 추후 삭제 로직 추가
  };

  const handleSave = () => {
    console.log("수정 완료 클릭됨");
    // 추후 저장 로직 추가
  };

  return (
    <NoNavLayout>
      {/* 헤더 */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-xl">
          <GobackIcon className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">목표 설정</h1>
        <div className="w-6" /> {/* 오른쪽 여백용 */}
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-6 p-6">
        {/* 목표 이름 */}
        <div>
          <label className="text-sm goal-subtitle-font">목표 이름</label>
          <input
            type="text"
            className="w-full border-b focus:outline-none py-2 text-lg goal-input-font"
          />
        </div>

        {/* 목표 기간 */}
        <GoalPeriod />

        {/* 목표 금액 */}
        <div>
          <label className="text-sm goal-subtitle-font">목표 금액</label>
          <div className="flex items-center border-b py-2">
            <input
              type="number"
              className="flex-1 focus:outline-none text-lg goal-input-font"
            />
            <span className="ml-2 goal-won-font">원</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 px-6 py-4">
        <button
          onClick={handleDelete}
          className="flex justify-center items-center gap-2 px-4 py-2 rounded-[4px] bg-white border border-[#CAF6EC] goal-delete-font"
        >
          목표 삭제
        </button>
        <button
          onClick={handleSave}
          className="flex justify-center items-center gap-2 px-4 py-2 rounded-[4px] bg-[#CAF6EC] goal-done-font"
        >
          수정 완료
        </button>
      </div>
    </NoNavLayout>
  );
}
