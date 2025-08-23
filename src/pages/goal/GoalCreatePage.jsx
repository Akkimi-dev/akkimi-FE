import NoNavLayout from "../../components/layouts/NoNavLayout";
import GoalPeriod from "../../components/GoalPeriod";
import Header from "../../components/common/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSavingGoal } from "../../hooks/goal/useGoal";
import useErrorModal from "../../hooks/error/useErrorModal";

export default function GoalCreatePage() {
  const [form, setForm] = useState({
    purpose: "",
    purposeBudget: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();
  const { show: showError, Modal: ErrorModalMount } = useErrorModal();

  const createGoalMutation = useCreateSavingGoal({
    onError: (err) => {
      const serverMsg = err?.response?.data?.message;
      return showError(serverMsg || '알 수 없는 오류가 발생했습니다.');
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleSave = async () => {
    const { purpose, purposeBudget, startDate, endDate } = form;

    if (!purpose.trim()) return showError('목표 이름을 입력하세요.');
    if (!startDate) return showError('시작 날짜를 선택하세요. (YYYY-MM-DD)');
    if (!endDate) return showError('종료 날짜를 선택하세요. (YYYY-MM-DD)');

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return showError('날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');
    }
    if (e < s) return showError('종료 날짜는 시작 날짜 이후여야 합니다.');

    const budgetNum = Number(purposeBudget);
    if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      return showError('목표 금액은 1 이상의 숫자여야 합니다.');
    }

    await createGoalMutation.mutateAsync({
      purpose: purpose.trim(),
      purposeBudget: budgetNum,
      startDate,
      endDate,
    });
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
            onChange={e => setForm({ ...form, purpose: e.target.value })}
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
              onChange={e => setForm({ ...form, purposeBudget: e.target.value })}
            />
            <span className="ml-2 goal-won-font">원</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 px-6 py-4">
        <button
          onClick={handleSave}
          disabled={createGoalMutation.isPending}
          className={`flex justify-center items-center gap-2 px-4 py-2 rounded-[4px] ${createGoalMutation.isPending ? 'bg-[#DDE2E7] cursor-not-allowed' : 'bg-[#CAF6EC]'} goal-done-font`}
        >
          {createGoalMutation.isPending ? '생성 중…' : '생성 완료'}
        </button>
      </div>
      <ErrorModalMount />
    </NoNavLayout>
  );
}
