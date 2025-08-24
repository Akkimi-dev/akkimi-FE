import { createPortal } from 'react-dom';

export default function LoadingModal({ open = false, message = '로딩 중...' }) {
  const portalTarget = document.getElementById('layout-portal') || document.body;

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="polite"
      className={`fixed top-0 inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-50 pointer-events-auto transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* 로딩 모달 */}
      <div
        className={`max-w-[312px] py-4 px-6 flex flex-col rounded-2xl bg-white transform transition-all duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={open ? '' : ''}>
          <div className="flex flex-col my-6">
            <div className="w-full flex flex-col items-center justify-around gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-black" />
              <p className="mt-4 sur-loading-font">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
}