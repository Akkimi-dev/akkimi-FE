import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import GobackIcon from "../../assets/Goal/goback.svg?react";
import GoalPeriod from "../../components/GoalPeriod";
import Header from "../../components/chatbot/Header";
import { useGoalDetail, useUpdateGoal, useDeleteGoal } from "../../hooks/goal/useGoal";
import useErrorModal from "../../hooks/error/useErrorModal";

export default function GoalEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show: showError, Modal: ErrorModalMount } = useErrorModal();

  // 상세 조회 훅
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError: isGoalError,
  } = useGoalDetail(id);

  const [form, setForm] = useState({
    purpose: "",
    purposeBudget: "",
    startDate: "",
    endDate: "",
  });

  // 조회 성공 시 초기값 주입
  useEffect(() => {
    if (!goal) return;
    setForm({
      purpose: goal?.purpose ?? "",
      purposeBudget: goal?.purposeBudget ?? "",
      startDate: goal?.startDate ?? "",
      endDate: goal?.endDate ?? "",
    });
  }, [goal]);

  // 수정 훅 (에러 모달 처리 포함)
  const updateMutation = useUpdateGoal({
    onError: (err) => {
      const serverMsg = err?.response?.data?.message;
      return showError(serverMsg || "알 수 없는 오류가 발생했습니다.");
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  // 삭제 훅 (에러 모달 처리 포함)
  const deleteMutation = useDeleteGoal({
    onError: (err) => {
      const serverMsg = err?.response?.data?.message;
      return showError(serverMsg || "알 수 없는 오류가 발생했습니다.");
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleDelete = async () => {
    if (!id) return showError("goalId가 없습니다.");
    await deleteMutation.mutateAsync(id);
  };

  const handleSave = async () => {
    if (!id) return showError("goalId가 없습니다.");

    const { purpose, purposeBudget, startDate, endDate } = form;

    if (!purpose.trim()) return showError("목표 이름을 입력하세요.");
    if (!startDate) return showError("시작 날짜를 선택하세요. (YYYY-MM-DD)");
    if (!endDate) return showError("종료 날짜를 선택하세요. (YYYY-MM-DD)");

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return showError("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
    }
    if (e < s) return showError("종료 날짜는 시작 날짜 이후여야 합니다.");

    const budgetNum = Number(purposeBudget);
    if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      return showError("목표 금액은 1 이상의 숫자여야 합니다.");
    }

    await updateMutation.mutateAsync({
      goalId: id,
      payload: {
        purpose: purpose.trim(),
        purposeBudget: budgetNum,
        startDate,
        endDate,
      },
    });
  };

  if (isGoalLoading) {
    return (
      <NoNavLayout>
        <Header header={"목표 수정"} />
        <div className="p-6">로딩중...</div>
      </NoNavLayout>
    );
  }

  if (isGoalError) {
    return (
      <NoNavLayout>
        <Header header={"목표 수정"} />
        <div className="p-6">데이터 불러오기 실패</div>
      </NoNavLayout>
    );
  }

  return (
    <NoNavLayout>
      {/* 헤더 */}
      <Header header={"목표 수정"} />

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
          disabled={deleteMutation.isPending}
          className={`flex justify-center items-center gap-2 px-4 py-2 rounded-[4px] bg-white border border-[#CAF6EC] goal-delete-font ${deleteMutation.isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {deleteMutation.isPending ? '삭제 중…' : '목표 삭제'}
        </button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className={`flex justify-center items-center gap-2 px-4 py-2 rounded-[4px] ${updateMutation.isPending ? 'bg-[#DDE2E7] cursor-not-allowed' : 'bg-[#CAF6EC]'} goal-done-font`}
        >
          {updateMutation.isPending ? '수정 중…' : '수정 완료'}
        </button>
      </div>

      <ErrorModalMount />
    </NoNavLayout>
  );
}
