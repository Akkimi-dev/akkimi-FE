import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";

export default function ErrorModal({message, onClose}){
  const [open, setOpen] = useState(false);
  
  useEffect(() => { setOpen(true); }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const portalTarget = document.getElementById('layout-portal') || document.body;

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      className={`fixed inset-0 bg-bg-modal flex justify-center items-center z-50 pointer-events-auto transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* 메세지 모달 */}
      <div
        className={`max-w-[312px] py-4 px-6 flex flex-col rounded-2xl bg-white transform transition-all duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={open ? 'animate-shake' : ''}>
          <div className="flex flex-col mb-6">
            <div className="w-full flex flex-col items-center justify-around gap-4">
              <div>
                <span className='text-heading-01-bold text-red'> 실패 </span>
              </div>
              <p className="text-body-02-regular text-gray-100">{message}</p>
            </div>
          </div>

          <button
            type="button"
            className="cursor-pointer w-full rounded-[8px] py-3 bg-green-main-dark hover:bg-green-main-dark-2"
            onClick={onClose}
          >
            <span>닫기</span>
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}