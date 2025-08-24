import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BackArrow from "../../assets/common/backArrow.svg?react";
import More from "../../assets/chatbot/more.svg?react";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="fixed sm:absolute sm:inset-x-0 top-0 z-50 w-full h-12 flex justify-between items-center bg-bg-blue">
      <button className="cursor-pointer px-4" onClick={() => navigate(-1)}>
        <BackArrow />
      </button>
      <span className="text-heading-02-semibold text-gray-100">
        아끼미
      </span>
      <div className="relative" ref={menuRef}>
        <button className="cursor-pointer p-4" onClick={() => setOpen(!open)}>
          <More/>
        </button>
        {open && (
          <div className="absolute right-4 top-12 bg-white rounded-b-[8px] flex flex-col">
            <button className="px-6 py-4 flex hover:bg-gray-20">
              <span className="text-body-02-regular leading-[120%] whitespace-nowrap">말투 설정</span>
            </button>
            {/* <button className="px-6 py-4 flex hover:bg-gray-20">
              <span className="text-body-02-regular leading-[120%] whitespace-nowrap">색상 변경</span>
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}
