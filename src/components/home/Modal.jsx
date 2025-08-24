import { createPortal } from 'react-dom';
import Logo from '../../assets/common/logo.svg?react'

export default function Modal({
  message,
  onClose = () => {},
  onConfirm = () => {},
  confirmText = '하기',
  cancelText = '나중에 하기',
}) {
  const portalTarget = document.getElementById('layout-portal') || document.body;

  return createPortal(
    <div
      className="fixed inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-50 pointer-events-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* 메시지 모달 카드 */}
      <div
        className="max-w-[312px] w-[312px] py-4 px-6 flex flex-col gap-6 rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col ">
          <div className="w-full flex gap-4 items-center justify-center mb-2">
            <Logo className="w-40"/>
          </div>
          <p className="text-body-02-regular text-gray-100 whitespace-pre-wrap break-words text-center">
            {message}
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-[#DDE2E7] bg-white py-2 text-gray-100"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-[8px] bg-green-main-dark-2 py-2 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}