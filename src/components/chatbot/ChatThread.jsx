import { useState, useRef, useEffect } from 'react';
import Chat from './chat';
import ChatInput from "../../assets/chatbot/chatInput.svg?react";
import { useChatHistoryInfiniteQuery, useSendMessageMutation } from '../../hooks/chat/useChat';
import { getChatApi } from '../../apis/chatApis';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatThread() {
  const DONE_GRACE_MS = 150;   // onDone 이후 잠깐 대기
  const IDLE_GRACE_MS = 1000;  // 마지막 토큰 이후 유예 유예 시간 이후에는 sse 끊긴 걸로 간주

  const [input, setInput] = useState(''); // 사용자 입력

  // 챗봇 관련
  const esRef = useRef(null);
  const [isSSE, setIsSSE] = useState(false); // 스트리밍 중인지 여부
  const [chunks, setChunks] = useState([]);  // 스트리밍 청크
  const streamedText = (chunks && chunks.map(String).join('')) || '';  // 스트리밍 메세지

  // done -> 종료 타이머 
  const doneTimerRef = useRef(null);
  // 응답 없을 시 -> 종료 타이머
  const idleTimerRef = useRef(null);

  // 스트리밍 초기화 -> 청크 초기화
  const resetStream = () => { setChunks([]); };
  // 스트리밀 종료
  const endStream = () => { esRef.current = null; setIsSSE(false); } //resetStream(); };

  const clearTimers = () => {
    if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); doneTimerRef.current = null; }
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
  };

  const finalizeStream = () => {
    clearTimers();
    endStream();
    resetStream(); // 청크/streamedText 비우기
    // 히스토리 캐시 무효화 → 최신 메시지를 히스토리로 편입
    qc.invalidateQueries({ queryKey: ["chatHistory"] });
  };

  // 스트리밍 시 제일 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamedText, isSSE]);

  useEffect(() => () => { clearTimers(); }, []);

  // 채팅 히스토리 관련
  // 무한 쿼리 
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatHistoryInfiniteQuery({ pageSize: 20 });
  const messages = data?.items || [];
  const hasMore = !!data?.hasMore;

  // 채팅 + 챗봇 응답 시 맨 밑으로 가기위한 ref
  const bottomRef = useRef(null);

  // 캐시 무효화를 위한 qc 선언
  const qc = useQueryClient();

  // 
  const didInitialScrollRef = useRef(false);

  // 첫 로딩 시 실행
  useEffect(() => {
    if (didInitialScrollRef.current) return;
    if (!messages || messages.length === 0) return;
    didInitialScrollRef.current = true;
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }));
  }, [messages?.length]);


  // 메세지 전송 관련
  const sendMutation = useSendMessageMutation();
  const { isPending } = sendMutation;

  // 메세지 보내기
  const sendUserMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    // 서버 전송 (성공 시 히스토리 자동 갱신: invalidateQueries)
    sendMutation.mutate( trimmed , {
      onSuccess: (res) => {
        const messageId = res;
        if (!messageId) return;
        try {
          esRef.current = getChatApi(String(messageId), {
            onOpen: () => { setIsSSE(true); },
            onMessage: (data) => {
              // done 유예 타이머가 잡혀 있으면 취소 (토큰이 더 왔음)
              if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); doneTimerRef.current = null; }
              // idle 유예 타이머 갱신 (마지막 토큰 이후 IDLE_GRACE_MS 지나면 종료)
              if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); }
              idleTimerRef.current = setTimeout(() => { finalizeStream(); }, IDLE_GRACE_MS);

              const token = typeof data === 'string' ? data : JSON.stringify(data);
              if (token.length === 0) return;
              setChunks((prev) => [...prev, token]);
            },
            onError: () => { finalizeStream(); },
            onDone: () => {
              if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); }
              doneTimerRef.current = setTimeout(() => { finalizeStream(); }, DONE_GRACE_MS);
            },
          });
        } catch (e) {};
      },
      onError: () => {},
      onSettled: () => {},
    });
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    // IME 조합중이면 전송 금지 (한글 입력 등)
    if (e.isComposing || e.nativeEvent?.isComposing) return;
    // 줄바꿈(Shift+Enter)은 허용하고 전송하지 않음
    if (e.shiftKey) return;
    // 키 반복(길게 누름) 방지
    if (e.repeat) return;

    e.preventDefault();
    sendUserMessage();
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-18 overflow-y-auto">
      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="self-center text-detail-01-regular text-gray-60 hover:underline"
        >
          이전 대화 더 보기
        </button>
      )}

      {messages.map((m) => (
        <div key={m.chatId} className='w-full px-4'>
          {(m.showDate || m.showTime) && (
            <div className='w-full flex justify-center items-center pt-2 pb-6'>
              {m.showDate && <span className='text-body-02-regular text-gray-100'>{m.dateLabel}</span>}
              {m.showDate && m.showTime && <span className='text-body-02-regular text-gray-100'>&nbsp;</span>}
              {m.showTime && <span className='text-body-02-regular text-gray-100'>{m.timeLabel}</span>}
            </div>
          )}

          <Chat role={m.speaker} message={m.message} />
        </div>
      ))}

      {(isSSE || streamedText) && (
        <div className='w-full px-4'>
          <Chat role='assistant' message={streamedText} />
        </div>
      )}

      <div ref={bottomRef} />
      
      <div className='fixed sm:absolute sm:inset-x-0 bottom-0 z-50 w-full max-w-[420px] py-3 px-4 flex gap-2'>
        <input
          type='text'
          className='w-9 flex-1 bg-chat-input rounded-[40px] px-4 py-3 outline-none'
          placeholder='메시지를 입력하세요'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isPending || isSSE}
          aria-busy={isPending || isSSE}
        />
        <button
          type='button'
          onClick={() => input.trim() && sendUserMessage()}
          aria-label='전송'
          disabled={isPending || isSSE}
          aria-busy={isPending || isSSE}
        >
          <ChatInput/>
        </button>
      </div>
    </div>
  );
}