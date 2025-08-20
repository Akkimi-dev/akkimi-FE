import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";

export default function MessageModalSSE({ messageId, onClose }) {
  const portalTarget = document.getElementById('layout-portal') || document.body;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const esRef = useRef(null);
  const abortRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  useEffect(() => {
    if (!messageId) return;
    setLoading(true);
    setError('');
    setContent('');

    try {
      const url = `/api/messages/${messageId}/stream`; // TODO: 실제 엔드포인트로 교체
      const es = new EventSource(url);
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed?.chunk) setContent((prev) => prev + parsed.chunk);
          else if (typeof parsed === 'string') setContent((prev) => prev + parsed);
          else setContent((prev) => prev + e.data);
        } catch {
          setContent((prev) => prev + (e.data || ''));
        }
      };

      es.onerror = () => {
        setError('스트림 중 오류가 발생했습니다.');
        setLoading(false);
        es.close();
      };

      es.onopen = () => setLoading(false);
    } catch {
      setError('SSE 연결을 열 수 없습니다.');
      setLoading(false);
    }

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [messageId]);

  return createPortal(
    <div className="absolute inset-0 w-full h-full bg-bg-modal flex justify-center items-center z-50 pointer-events-auto" onClick={onClose}>
      {/* 메세지 모달 */}
      <div className="max-w-[312px] py-4 px-6 flex flex-col gap-6 rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <ChatAvatar/>
            <span className="text-body-02-semibold text-gray-100">아끼미</span>
          </div>
          <div className="w-full">
            <pre
              ref={contentRef}
              className="text-body-02-regular text-gray-100 whitespace-pre-wrap break-words min-h-[80px]"
            >
              {content || (loading ? '불러오는 중…' : error || '')}
            </pre>
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
  );
}