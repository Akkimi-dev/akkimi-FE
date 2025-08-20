import { useNavigate } from "react-router-dom";
import Alarm from "../../assets/home/alarm.svg?react";
import Hamburger from "../../assets/home/hamburger.svg?react";

export default function Header({name}){
  const navigate = useNavigate();

  return(
    <div className="px-4 flex justify-between items-center">
      <span className="text-heading-02-semibold">{name}님</span>
      <div className="flex">
        <button className="w-12 h-12 flex justify-center items-center">
          <Alarm/>
        </button>
        <button className="cursor-pointer w-12 h-12 flex justify-center items-center"
          onClick={() => navigate("/settings")}
        >
          <Hamburger/>
        </button>
      </div>
    </div>
  )
}