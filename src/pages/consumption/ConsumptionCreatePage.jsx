import { useParams} from "react-router-dom";
import { useCreateConsumption } from "../../hooks/consumption/useConsumptions";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ConsumptionForm from "../../components/consumption/ConsumptionForm";
import MessageModalSSE from "../../components/consumption/MessageModalSSE";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import Header from "../../components/common/Header";
import useErrorModal from "../../hooks/error/useErrorModal";
import MessageModal from "../../components/consumption/MessageModal";

export default function ConsumptionCreatePage() {
  const { goalId } = useParams();
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || "";
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    date: initialDate,
    category: "",
    name: "",
    amount: "",
    memo: "",

  });

  const { show: showError, Modal: ErrorModalMount } = useErrorModal();

  const createConsumptionMutation = useCreateConsumption(goalId, form.date, {
    onError: (err) => {
      const serverMsg = err?.response?.data?.message;
      return showError(serverMsg || '알 수 없는 오류가 발생했습니다.');
    },
  });

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const { date, category, name, amount, memo } = form;

    // 기본 검증
    if (!date) return showError('날짜를 선택하세요. (YYYY-MM-DD)');
    if (!category) return showError('카테고리를 선택하세요.');
    if (!name) return showError('항목명을 입력하세요.');
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return showError('금액은 1 이상의 숫자여야 합니다.');
    }
    if (!goalId) {
      return showError('목표 ID(goalId)를 찾을 수 없습니다. 경로에 goalId가 포함되어야 합니다.');
    }

    try {
      const feedback = await createConsumptionMutation.mutateAsync({
        category,
        itemName: name,
        amount: parsedAmount,
        description: memo || '',
      });
      console.log(feedback)
      setMessage(feedback);
    } catch (err) {
      console.error(err);
      showError('소비 내역 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <NoNavLayout>
      <Header header={"소비 내역 생성"}/>
      <ConsumptionForm
        form={form}
        setForm={setForm}
        onSave={handleSubmit}
        submitting={createConsumptionMutation.isPending}
      />
      {message && (
        <MessageModal message={message} onClose={() => setMessage(null)} />
      )}
      <ErrorModalMount />
    </NoNavLayout>
  );
}
