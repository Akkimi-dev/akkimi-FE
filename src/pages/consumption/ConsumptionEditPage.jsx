import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/common/Header";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import ConsumptionForm from "../../components/consumption/ConsumptionForm";
import { useUpdateConsumption } from "../../hooks/consumption/useConsumptions";
import useErrorModal from "../../hooks/error/useErrorModal";

export default function ConsumptionEditPage() {
  const { id } = useParams(); // 소비내역 ID (/:id)
  const [searchParams] = useSearchParams(); // ?goalId=...&date=YYYY-MM-DD(선택)
  const goalId = searchParams.get("goalId");

  const { show: showError, Modal: ErrorModalMount } = useErrorModal();

  // 초기값은 비워둠(서버 조회 연동 전)
  const [form, setForm] = useState({
    date: "",
    category: "",
    name: "",
    amount: "",
    memo: "",
  });

  const updateMutation = useUpdateConsumption(goalId, form.date, {
    onError: (err) => {
      const serverMsg = err?.response?.data?.message;
      return showError(serverMsg || "알 수 없는 오류가 발생했습니다.");
    },
    onSuccess: () => {
      // navigate(-1);
    },
  });

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!goalId) return showError("goalId가 없습니다. 쿼리스트링을 확인하세요.");
    if (!id) return showError("소비내역 id가 없습니다.");
    if (!form.date) return showError("날짜를 선택하세요. (YYYY-MM-DD)");
    if (!form.category) return showError("카테고리를 선택하세요.");
    if (!form.name) return showError("항목명을 입력하세요.");
    const amountNum = Number(form.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return showError("금액은 1 이상의 숫자여야 합니다.");
    }

    await updateMutation.mutateAsync({
      consumptionId: id,
      payload: {
        category: form.category,
        itemName: form.name,
        amount: amountNum,
        description: form.memo || "",
      },
    });
  };

  return (
    <NoNavLayout>
      <Header header={"소비 내역 수정"} />
      <ConsumptionForm
        form={form}
        setForm={setForm}
        onSave={handleSubmit}
        submitting={updateMutation.isPending}
      />
      <ErrorModalMount />
    </NoNavLayout>
  );
}
