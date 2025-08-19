import { createPortal } from 'react-dom';
import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";

export default function MessageModal({message, onClose}){
  const portalTarget = document.getElementById('layout-portal') || document.body;

  return createPortal(
    <div className="fixed top-0 mx:absolute mx:inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-50" onClick={onClose}>
      {/* 메세지 모달 */}
      <div className="max-w-[312px] py-4 px-6 flex flex-col gap-6 rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <ChatAvatar/>
            <span className="text-body-02-semibold text-gray-100">아끼미</span>
          </div>
          <div className="w-full">
            <p className="text-body-02-regular text-gray-100">{message}</p>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer w-full rounded-[8px] py-2 bg-green-main-dark-2"
          onClick={onClose}
        >
          <span>닫기</span>
        </button>
      </div>
    </div>,
    portalTarget
  )
}