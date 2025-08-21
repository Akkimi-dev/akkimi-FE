import { useState } from "react";
import Header from "../../components/common/Header";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import ConsumptionForm from "../../components/consumption/ConsumptionForm";

export default function ConsumptionEditPage() {
  // api 연동
  // 목데이터로 대체
  const ConsumptionData ={
    date : "2025-08-21",
    category : "쇼핑"
  }
  

  const [form, setForm] = useState({
    date: ConsumptionData.date,
    category: "",
    name: "",
    amount: "",
    memo: "",
  });

  return (
    <NoNavLayout>
      <Header header={"소비 내역 수정"}/>
      <ConsumptionForm
        form={form}
        setForm={setForm}
        onSave={() => {
          console.log("소비 내역 수정 완료", form);
          // TODO: call update API here
        }}
      />
      {/* MessageModalSSE는 생성/분석 완료 후 사용할 예정 */}
      {/* <MessageModalSSE messageId={messageId} onClose={() => setMessageId(null)} /> */}
    </NoNavLayout>
  );
}
