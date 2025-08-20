import { useNavigate } from "react-router-dom";
import BackArrow from "../../assets/common/backArrow.svg?react";

export default function Header({header}) {
  const navigate = useNavigate();

  return (
    <div className="fixed sm:absolute sm:inset-x-0 top-0 z-50 w-full h-12 flex justify-between items-center bg-bg-blue">
      <button className="px-4" onClick={() => navigate(-1)}>
        <BackArrow />
      </button>
      <span className="text-heading-02-semibold text-gray-100">
        {header}
      </span>
      <div className="w-12">
      </div>
    </div>
  );
}
