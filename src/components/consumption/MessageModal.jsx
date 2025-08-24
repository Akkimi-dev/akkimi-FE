import { createPortal } from 'react-dom';
import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";

export default function MessageModal({ message, onClose, onReply, replyLabel = "답장하기" }){
  const portalTarget = document.getElementById('layout-portal') || document.body;

  return createPortal(
    <div className="fixed top-0 mx:absolute mx:inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-100 pointer-events-auto" onClick={onClose}>
      {/* 메세지 모달 */}
      <div className="max-w-[312px] py-4 px-6 flex flex-col gap-6 rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <ChatAvatar/>
            <span className="text-body-02-semibold text-gray-100">아끼미</span>
          </div>
          <div className="w-full">
            <p className="text-body-02-regular text-gray-100">
              {String(message).split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="w-full flex gap-3">
          {onReply && (
            <button
              type="button"
              onClick={onReply}
              className="cursor-pointer flex-1 h-10 rounded-[8px] text-body-02-semibold border border-green-main-dark-2 bg-white hover:bg-gray-10 text-gray-60"
            >
              {replyLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex-1 h-10 rounded-[8px] text-body-02-semibold bg-green-main-dark-2 text-white hover:bg-green hover:text-gray-40"
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}