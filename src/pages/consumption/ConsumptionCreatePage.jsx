import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ConsumptionForm from "../../components/consumption/ConsumptionForm";
import MessageModalSSE from "../../components/consumption/MessageModalSSE";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import Header from "../../components/common/Header";

export default function ConsumptionCreatePage() {
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || "";

  const [form, setForm] = useState({
    date: initialDate,
    category: "",
    name: "",
    amount: "",
    memo: "",
  });

  return (
    <NoNavLayout>
      <Header header={"소비 내역 생성"}/>
      <ConsumptionForm form={form} setForm={setForm} />
      {/* MessageModalSSE는 생성/분석 완료 후 사용할 예정 */}
      {/* <MessageModalSSE messageId={messageId} onClose={() => setMessageId(null)} /> */}
    </NoNavLayout>
  );
}
