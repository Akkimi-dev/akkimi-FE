const mockConsumptionList = [
  { category: "식비", time: "12:30", consumptionName: "점심 식사", price: 8000 },
  { category: "교통", time: "13:00", consumptionName: "지하철", price: 1250 },
  { category: "카페", time: "15:00", consumptionName: "아메리카노", price: 4500 },
  { category: "쇼핑", time: "18:00", consumptionName: "티셔츠", price: 25000 },
  { category: "기타", time: "20:00", consumptionName: "편의점", price: 3000 },
  { category: "식비", time: "12:30", consumptionName: "점심 식사", price: 8000 },
  { category: "교통", time: "13:00", consumptionName: "지하철", price: 1250 },
  { category: "카페", time: "15:00", consumptionName: "아메리카노", price: 4500 },
  { category: "쇼핑", time: "18:00", consumptionName: "티셔츠", price: 25000 },
  { category: "기타", time: "20:00", consumptionName: "편의점", price: 3000 },
];

import Plus from "../../assets/home/plus.svg?react";
import ConsumptionList from "../consumption/ConsumptionList";

export default function Consumption(){
  return(
  <div className="p-4 flex flex-col gap-4 ">
    <span className="text-body-01-semibold text-gray-100">오늘 내 소비</span>
    <button className="px-4 py-6 flex justify-between bg-white border border-green-main-dark-2 rounded-2xl">
      <span >소비 내역 작성하기</span>
      <Plus/>
    </button>
    <ConsumptionList consumptionList={mockConsumptionList} />
  </div>
)}