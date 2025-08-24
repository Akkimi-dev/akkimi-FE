import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/common/Header";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import ConsumptionForm from "../../components/consumption/ConsumptionForm";
import { useUpdateConsumption, useGetConsumption } from "../../hooks/consumption/useConsumptions";
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

  // 소비내역 상세 조회로 초기값 세팅
  const {
    data: consumption,
    isError: isDetailError,
    error: detailError,
  } = useGetConsumption(id);

  // 조회 성공 시 폼 초기값 주입
  useEffect(() => {
    if (!consumption) return;
    setForm({
      date: consumption?.date ?? "",
      category: consumption?.category ?? "",
      name: consumption?.itemName ?? "",
      amount: consumption?.amount != null ? String(consumption.amount) : "",
      memo: consumption?.description ?? "",
    });
  }, [consumption]);

  // 조회 실패 시 에러 모달
  useEffect(() => {
    if (!isDetailError) return;
    const serverMsg = detailError?.response?.data?.message;
    showError(serverMsg || "소비내역을 불러오지 못했습니다.");
  }, [isDetailError, detailError, showError]);

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
