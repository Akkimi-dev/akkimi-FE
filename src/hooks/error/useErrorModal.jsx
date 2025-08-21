// src/hooks/useErrorModal.jsx
import { useState, useCallback, useMemo } from 'react';
import ErrorModal from '../../components/common/ErrorModal';

export default function useErrorModal(initialMessage = null) {
  const [message, setMessage] = useState(initialMessage);

  const show = useCallback((msg) => {
    setMessage(msg ?? initialMessage ?? '오류가 발생했습니다.');
  }, [initialMessage]);

  const hide = useCallback(() => setMessage(null), []);

  // 필요할 때 한 번만 배치
  const Modal = useMemo(() => {
    return function ErrorModalRenderer() {
      return message
        ? <ErrorModal message={message} onClose={hide} />
        : null;
    };
  }, [message, hide]);

  return {
    show,        // 원하는 문구로 모달 띄우기: show('로그인 실패')
    hide,        // 모달 닫기
    Modal,       // JSX에서 <Modal /> 한 번 배치
    message,     // 현재 메시지
    isOpen: !!message,
  };
}