import { useState, useRef, useEffect } from 'react';
import Chat from './Chat';
import ChatInput from "../../assets/chatbot/chatInput.svg?react";
import { useChatHistoryInfiniteQuery, useSendMessageMutation } from '../../hooks/chat/useChat';
import { getChatApi } from '../../apis/chatApis';
import { computeTimeLabels } from '../../utils/chatTime'
//import { useQueryClient } from '@tanstack/react-query';

export default function ChatThread() {
  // 캐시 무효화를 위한 qc 선언
  // const qc = useQueryClient();

  const DONE_GRACE_MS = 250;   // onDone 이후 잠깐 대기(지연 단축)
  const IDLE_GRACE_MS = 12000;  // 마지막 토큰 이후 유예 (과도 대기 축소)

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
  // 스트리밍 종료
  const endStream = () => { esRef.current = null; setIsSSE(false); } //resetStream(); };

  const clearTimers = () => {
    if (doneTimerRef.current) { clearTimeout(doneTimerRef.current); doneTimerRef.current = null; }
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
  };

  const finalizeStream = () => {
    clearTimers();
    endStream();
    resetStream(); // 청크/streamedText 비우기
    // 로컬 에코 제거(서버 히스토리로 대체)
    streamMsgIdRef.current = null; // 스트리밍 렌더 ID 초기화

    // 캐시 무효화로 히스토리 동기화 -> 하면 안됌!!! 새 메세지 리스트로 추가 메세지 받음!!!
    stickBottomOnceRef.current = true; // 서버 히스토리로 편입되는 갱신도 하단 고정
    //qc.invalidateQueries({ queryKey: ["chatHistory"] });
  };

  // 스트리밍 시 제일 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamedText, isSSE]);

  useEffect(() => () => { clearTimers(); }, []);

  // 채팅 히스토리 관련
  // 무한 쿼리 
  const { data, fetchNextPage, isFetchingNextPage } = useChatHistoryInfiniteQuery({ pageSize: 20 });
  const messages = data?.items || [];

  // UI에서만 사용하는 렌더 배열 (append 전용)
  const [renderItems, setRenderItems] = useState([]);
  const lastSeenIdRef = useRef(null);   // renderItems의 마지막 id
  const firstSeenIdRef = useRef(null);  // renderItems의 첫 id

  // messages가 바뀔 때 UI에 새 데이터만 append/prepend
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // 초기 진입: 전체 동기화
    if (renderItems.length === 0) {
      setRenderItems(messages);
      firstSeenIdRef.current = messages[0]?.chatId ?? null;
      lastSeenIdRef.current = messages[messages.length - 1]?.chatId ?? null;
      return;
    }

    const prevFirst = firstSeenIdRef.current;
    const prevLast = lastSeenIdRef.current;

    // tail append: 마지막 이후로 새 메시지가 붙은 경우
    const lastIdx = prevLast ? messages.findIndex(m => m.chatId === prevLast) : -1;
    const tailToAppend = lastIdx >= 0 ? messages.slice(lastIdx + 1) : [];

    // head prepend: 무한 스크롤로 과거가 앞에 붙은 경우
    const firstIdx = prevFirst ? messages.findIndex(m => m.chatId === prevFirst) : -1;
    const headToPrepend = firstIdx > 0 ? messages.slice(0, firstIdx) : [];

    if (tailToAppend.length === 0 && headToPrepend.length === 0) return;

    setRenderItems(prev => {
      let next = prev;
      if (headToPrepend.length > 0) {
        next = [...headToPrepend, ...next];
        firstSeenIdRef.current = messages[0]?.chatId ?? firstSeenIdRef.current;
      }
      if (tailToAppend.length > 0) {
        next = [...next, ...tailToAppend];
        lastSeenIdRef.current = messages[messages.length - 1]?.chatId ?? lastSeenIdRef.current;
      }
      return next;
    });
  }, [messages]);

  useEffect(() => {
    if (!isSSE) return;
    if (!streamedText) return;
    const id = streamMsgIdRef.current || (streamMsgIdRef.current = `bot-stream-${Date.now()}`);
    setRenderItems((prev) => {
      const idx = prev.findIndex((x) => x.chatId === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], message: streamedText };
        return next;
      }
      // 최초 생성 시(첫 토큰 수신)
      const nowIso = new Date().toISOString();
      return [
        ...prev,
        {
          chatId: id,
          speaker: 'BOT',
          message: streamedText,
          createdAt: nowIso,
          showDate: false,
          dateLabel: '',
          showTime: false,
          timeLabel: '',
        },
      ];
    });
  }, [streamedText, isSSE]);

  // 채팅 + 챗봇 응답 시 맨 밑으로 가기위한 ref
  const bottomRef = useRef(null);

  const didInitialScrollRef = useRef(false);

  // 이전 채팅 로드시 기존 위치로 가기위한 ref
  const topRef = useRef(null);

  const appendScrollRefId = useRef(0)
  const stickBottomOnceRef = useRef(false); // 다음 messages 갱신 시 한 번만 하단 고정
  const streamMsgIdRef = useRef(null); // 현재 스트리밍 BOT 메시지의 렌더 ID

  const sentinelRef = useRef(null);      // 상단 감지용 센티넬 (선택한 div)
  const ioRef = useRef(null);            // IO 인스턴스 저장
  const lastLoadAtRef = useRef(0);       // 연속 로딩 방지 쿨다운
  const IO_COOLDOWN_MS = 200;            // IO 트리거 최소 간격

  // 메세지 로드 시 마다 실행
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // 내 채팅으로 인한 갱신이면 하단 고정 1회 우선
    if (stickBottomOnceRef.current) {
      stickBottomOnceRef.current = false;
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
      appendScrollRefId.current = data.nextBeforeId;
      return;
    }

    // 최초 진입은 맨 아래로
    if (!didInitialScrollRef.current) {
      didInitialScrollRef.current = true;
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }));
      appendScrollRefId.current = data.nextBeforeId;
      return;
    }

    // 그 외(무한 스크롤 등prepend 상황)는 기존처럼 최상단 앵커로
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'auto' }));
    appendScrollRefId.current = data.nextBeforeId;
  }, [messages.length]);

  // 상단 센티넬이 뷰포트 상단 (0px)까지 내려오면 자동으로 이전 페이지 로드
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    // 기존 옵저버 제거
    if (ioRef.current) {
      ioRef.current.disconnect();
      ioRef.current = null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        if (!didInitialScrollRef.current) return;  // 첫 렌더링 중에는 무시
        if (isFetchingNextPage) return;  // 중복 로딩 방지
        const now = Date.now();
        if (now - lastLoadAtRef.current < IO_COOLDOWN_MS) return; // 쿨다운

        // 불러오기 전 실제 최상단 메시지를 앵커로 지정
        appendScrollRefId.current = messages?.[0]?.chatId ?? 0;

        lastLoadAtRef.current = now;
        fetchNextPage();
      },
      {
        root: null, // 뷰포트 기준 (상위 컨테이너 ref를 못 올릴 때 사용)
        rootMargin: '0px 0px 0px 0px', // 상단에서 0px
        threshold: 0,
      }
    );

    observer.observe(target);
    ioRef.current = observer;
    return () => observer.disconnect();

  }, [messages, isFetchingNextPage]);

  // 메세지 전송 관련
  const sendMutation = useSendMessageMutation();
  const { isPending } = sendMutation;

  // 메세지 보내기
  const sendUserMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    stickBottomOnceRef.current = true; // 내 채팅으로 인한 다음 갱신은 하단 고정
    setInput('');
    // 로컬로 처리(깜박임 떄문): invalidate는 SSE 종료 시점에만 수행
    const now = new Date();
    const tempId = `local-${now.getTime()}`;
    // 직전 서버 메시지와 비교해 라벨 계산
    const prevMsg = renderItems.length > 0 ? renderItems[renderItems.length - 1] : null;

    const labels = computeTimeLabels(now, prevMsg);

    setRenderItems((prev) => ([
      ...prev,
      {
        chatId: tempId,
        speaker: 'USER',
        message: trimmed,
        createdAt: now.toISOString(),
        showDate: labels.showDate,
        dateLabel: labels.dateLabel,
        showTime: labels.showTime,
        timeLabel: labels.timeLabel,
      },
    ]));
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));

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
        } catch (e) {console.log(e)};
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

  return (
    <div
      className="w-full flex flex-col gap-4 pb-18 min-h-0"
    >
      <div ref={sentinelRef} />
      {renderItems.map((m) => (
        appendScrollRefId.current == m.chatId ? (
          <div key={m.chatId} className='w-full px-4' ref={topRef}>
            {(m.showDate || m.showTime) && (
              <div className='w-full flex justify-center items-center pt-2 pb-6'>
                {m.showDate && <span className='text-body-02-regular text-gray-100'>{m.dateLabel}</span>}
                {m.showDate && m.showTime && <span className='text-body-02-regular text-gray-100'>&nbsp;</span>}
                {m.showTime && <span className='text-body-02-regular text-gray-100'>{m.timeLabel}</span>}
              </div>
            )}
            <Chat role={m.speaker} message={m.message} />
          </div>
        ) : (
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
        )
      ))}
      
      <div ref={bottomRef} />
      
      <div className='fixed sm:absolute sm:inset-x-0 bottom-0 z-50 w-full max-w-[768px] py-3 px-4 flex gap-[10px] bg-white '>
        <input
          type='text'
          className='w-9 flex-1 bg-chat-input rounded-[40px] px-4 h-9 outline-none'
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
          className={`cursor-pointer ${input.trim() && !isPending && !isSSE ? 'text-chat-input border border-green-main-dark-2' : 'text-chat-input'}`}
          disabled={isPending || isSSE}
          aria-busy={isPending || isSSE}
        >
          <ChatInput/>
        </button>
      </div>
    </div>
  );
}