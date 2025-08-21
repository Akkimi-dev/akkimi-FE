import { useState } from "react";
import { useParams } from "react-router-dom";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import GobackIcon from "../../assets/Goal/goback.svg?react";
import GoalPeriod from "../../components/GoalPeriod";
import Header from "../../components/chatbot/Header";

export default function GoalEditPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    purpose: "",
    purposeBudget: "",
    startDate: null,
    endDate: null,
  });

  const handleDelete = () => {
    console.log("목표 삭제 클릭됨");
    // 추후 삭제 로직 추가
  };

  const handleSave = () => {
    console.log("수정 완료 클릭됨", { id, form });
    // TODO: call update API with { id, ...form }
  };

  return (
    <NoNavLayout>
      {/* 헤더 */}
      <Header header={"목표 생성"}/>
     
      {/* 본문 */}
      <div className="flex flex-col gap-6 p-6 pt-22">
        {/* 목표 이름 */}
        <div>
          <label className="text-sm goal-subtitle-font">목표 이름</label>
          <input
            type="text"
            className="w-full border-b focus:outline-none py-2 text-lg goal-input-font"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
        </div>

        {/* 목표 기간 */}
        <GoalPeriod
          startDate={form.startDate}
          endDate={form.endDate}
          onChange={(start, end) => setForm({ ...form, startDate: start, endDate: end })}
          onSave={(s, e) => setForm({ ...form, startDate: s, endDate: e })}
        />

        {/* 목표 금액 */}
        <div>
          <label className="text-sm goal-subtitle-font">목표 금액</label>
          <div className="flex items-center border-b py-2">
            <input
              type="number"
              className="flex-1 focus:outline-none text-lg goal-input-font"
              value={form.purposeBudget}
              onChange={(e) => setForm({ ...form, purposeBudget: e.target.value })}
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
