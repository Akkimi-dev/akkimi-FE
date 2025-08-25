import { useNavigate } from "react-router-dom";
import Chat from "../../assets/consumption/chat.svg?react";

export default function ConsumptionItem({ id, goalId, category, consumptionName, price, onClick }){
  const navigate = useNavigate();

  return(
  <li className="w-full flex justify-between items-center p-4">
    <div className="cursor-pointer flex flex-col gap-1" onClick={() => navigate(`/consumption/edit/${id}?goalId=${goalId}`)}>
      <div className="flex gap-1 items-center">
        <span className="text-detail-02-regular text-yellow-2">{category}</span>
      </div>
      <span className="text-body-02-semibold text-gray-100">{consumptionName}</span>
    </div>
    <div className="flex flex-col gap-1 items-end">
      <button className="cursor-pointer" onClick={onClick}><Chat/></button>
      <span className="text-body-02-semibold text-gray-100">{price}원</span>
    </div>
  </li>
)}