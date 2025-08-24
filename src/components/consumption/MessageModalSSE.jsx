import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";
import { getChatApi } from '../../apis/chatApis';

export default function MessageModalSSE({ messageId, onClose }) {
  const portalTarget = document.getElementById('layout-portal') || document.body;

  const DONE_GRACE_MS = 150;    // onDone 이후 잠깐 대기
  const IDLE_GRACE_MS = 30000;  // 마지막 토큰 이후 유예 시간

  const contentRef = useRef(null);
  const esRef = useRef(null);

  const [isSSE, setIsSSE] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const doneTimerRef = useRef(null);
  const idleTimerRef = useRef(null);

  const streamedText = (chunks && chunks.map(String).join('')) || '';
  const canClose = isDone && !isSSE; // 완료 후에만 닫기 허용

  // 자동 스크롤
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedText]);

  const clearTimers = () => {
    if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); doneTimerRef.current = null; }
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
  };

  const endStream = () => { esRef.current = null; setIsSSE(false); };
  const resetStream = () => { setChunks([]); };

  const finalizeStream = () => {
    clearTimers();
    endStream();
    setIsDone(true);
  };

  // SSE 연결 (getChatApi 사용)
  useEffect(() => {
    if (!messageId) return;

    setLoading(true);
    setError(null);
    setIsDone(false);
    resetStream();

    const api = getChatApi(String(messageId), {
      onOpen: () => {
        setIsSSE(true);
        setLoading(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => { finalizeStream(); }, IDLE_GRACE_MS);
      },
      onMessage: (data) => {
        // 토큰 수신 → done 유예 타이머 취소 및 idle 타이머 리셋
        if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); doneTimerRef.current = null; }
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => { finalizeStream(); }, IDLE_GRACE_MS);

        if (typeof data === 'string') {
          if (data) setChunks((prev) => [...prev, data]);
        } else if (data && typeof data === 'object') {
          const text = typeof data.delta === 'string'
            ? data.delta
            : typeof data.text === 'string'
              ? data.text
              : JSON.stringify(data);
          if (text) setChunks((prev) => [...prev, text]);
        }
      },
      onError: (err) => {
        setError(err?.message || 'SSE 연결 중 오류가 발생했습니다.');
        finalizeStream();
      },
      onDone: () => {
        if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
        doneTimerRef.current = setTimeout(() => { finalizeStream(); }, DONE_GRACE_MS);
      },
    });

    esRef.current = api;

    return () => {
      try { api?.close?.(); } catch {}
      clearTimers();
      endStream();
    };
    // messageId가 바뀔 때마다 새로 연결
  }, [messageId]);

  if (!messageId) return null;

  const handleBackdropClick = () => {
    if (canClose && onClose) onClose();
  };

  const handleCloseClick = () => {
    if (canClose && onClose) onClose();
  };

  return createPortal(
    <div
      className="absolute inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-50 pointer-events-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* 메세지 모달 */}
      <div
        className="max-w-[312px] py-4 px-6 flex flex-col gap-6 rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <ChatAvatar />
            <span className="text-body-02-semibold text-gray-100">아끼미</span>
          </div>
          <div className="w-full">
            <pre
              ref={contentRef}
              className="text-body-02-regular text-gray-100 whitespace-pre-wrap break-words min-h-[120px] max-h-[360px] overflow-y-auto"
            >
              {error ? error : (streamedText || (loading ? '불러오는 중…' : ''))}
            </pre>
          </div>
        </div>

        <button
          type="button"
          className={`cursor-pointer w-full rounded-[8px] py-2 ${canClose ? 'bg-green-main-dark-2' : 'bg-gray-40 cursor-not-allowed'}`}
          onClick={handleCloseClick}
          disabled={!canClose}
        >
          <span>{canClose ? '닫기' : (isSSE ? '응답 수신 중…' : '마무리 중…')}</span>
        </button>
      </div>
    </div>,
    portalTarget
  );
}