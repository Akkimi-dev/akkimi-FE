import Alarm from "../../assets/home/alarm.svg?react";
import Hamburger from "../../assets/home/hamburger.svg?react";

export default function Header({name}){
  return(
    <div className="px-4 flex justify-between items-center">
      <span className="text-heading-02-semibold">{name}님</span>
      <div className="flex">
        <button className="w-12 h-12 flex justify-center items-center">
          <Alarm/>
        </button>
        <button className="w-12 h-12 flex justify-center items-center">
          <Hamburger/>
        </button>
      </div>
    </div>
  )
}