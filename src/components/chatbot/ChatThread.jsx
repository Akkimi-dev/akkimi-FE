import { useState, useRef, useEffect } from 'react';
import Chat from './chat';
import ChatInput from "../../assets/chatbot/chatInput.svg?react";
import { computeTimeLabels } from '../../utils/chatTime';

const mockData = {
  messages: [
    {
      chatId: 1,
      speaker: 'user',
      message: '안녕! 오늘 날씨 어때?',
      createdAt: '2025-08-18T10:15:00Z',
      showDate: true,
      dateLabel: '2025년 8월 18일',
      showTime: true,
      timeLabel: '10:15',
    },
    {
      chatId: 2,
      speaker: 'bot',
      message: '안녕하세요! 오늘은 맑고 기온은 27도예요.',
      createdAt: '2025-08-18T10:15:05Z',
      showDate: false,
      dateLabel: '',
      showTime: true,
      timeLabel: '10:15',
    },
    {
      chatId: 3,
      speaker: 'user',
      message: '고마워!',
      createdAt: '2025-08-18T10:16:00Z',
      showDate: false,
      dateLabel: '',
      showTime: true,
      timeLabel: '10:16',
    },
  ],
  hasMore: true,
  nextBeforeId: 100,
};

export default function ChatThread() {
  const [data, setData] = useState(mockData);

  const [input, setInput] = useState('');

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages]);

  const appendMessage = (msg) => {
    setData((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
  };

  const nowIso = () => new Date().toISOString();

  const sendUserMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    const now = new Date();
    const prev = data.messages[data.messages.length - 1];
    const { showDate, dateLabel, showTime, timeLabel } = computeTimeLabels(now, prev);

    const userMsg = {
      chatId: Date.now(),
      speaker: 'user',
      message: trimmed,
      createdAt: now.toISOString(),
      showDate,
      dateLabel,
      showTime,
      timeLabel,
    };

    appendMessage(userMsg);
    setInput('');

    // TODO: 실제 API 연동; 임시로 봇 에코 응답
    setTimeout(() => {
      const botMsg = {
        chatId: Date.now() + 1,
        speaker: 'bot',
        message: `"${trimmed}"(을)를 받았어요.`,
        createdAt: nowIso(),
        showDate: false,
        dateLabel: null,
        showTime: false,
        timeLabel: null,
      };
      appendMessage(botMsg);
    }, 400);
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
    // TODO: 실제 API 연동 시, nextBeforeId 기준으로 이전 메시지 로드
    console.log('load more with beforeId =', data.nextBeforeId);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-18 overflow-y-auto">
      {data.hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="self-center text-detail-01-regular text-gray-60 hover:underline"
        >
          이전 대화 더 보기
        </button>
      )}

      {data.messages.map((m) => (
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

      <div ref={bottomRef} />
      
      <div className='fixed sm:absolute sm:inset-x-0 bottom-0 z-50 w-full max-w-[420px] py-3 px-4 flex gap-2'>
        <input
          type='text'
          className='w-9 flex-1 bg-chat-input rounded-[40px] px-4 py-3 outline-none'
          placeholder='메시지를 입력하세요'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type='button' onClick={() => input.trim() && sendUserMessage()} aria-label='전송'>
          <ChatInput/>
        </button>
      </div>
    </div>
  );
}