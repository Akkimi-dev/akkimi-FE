import Chat from "../../assets/consumption/chat.svg?react";

export default function ConsumptionItem({ category, time, consumptionName, price, onClick }){
  return(
  <li className="w-full flex justify-between items-center p-4">
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 items-center">
        <span className="text-detail-02-regular text-yellow-2">{category}</span>
        <div className="h-[13px] w-[1px] bg-gray-30"></div>
        <span className="text-detail-02-regular text-gray-40">{time}</span>
      </div>
      <span className="text-body-02-semibold text-gray-100">{consumptionName}</span>
    </div>
    <div className="flex flex-col gap-1 items-end">
      <button onClick={onClick}><Chat/></button>
      <span className="text-body-02-semibold text-gray-100">{price}원</span>
    </div>
  </li>
)}