import { axiosInstance } from './axios';
import { useAuthStore } from '../stores/useAuthStore';

// 채팅 메세지 전송 -> messageId를 반환
const postChatApi = async (message) => {
  const res = await axiosInstance.post('/api/v1/chat/messages', { message });
  return res.data.result;
};

// 메시지에 대한 챗봇의 답변을 SSE로 스트리밍
const getChatApi = (messageId, { onOpen, onMessage, onError, onDone } = {}) => {
  // sse에 토큰 달려면 fetch 사용해야 하므로 axios x
  const url = import.meta.env.VITE_API_URL + `/api/v1/chat/sse/messages/${encodeURIComponent(messageId)}`;
  //  SSE 연결을 중단 컨트롤러
  const controller = new AbortController();

  (async () => {
    try {
      // 스토어에서 엑세스 토큰 받아옴
      const { accessToken } = useAuthStore.getState();
      const token = accessToken;

      // 토큰으로 sse요청 보냄
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        mode: 'cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      // 서버 응답 x 
      if (!res.ok || !res.body) {
        throw new Error(`SSE connection failed: HTTP ${res.status}`);
      }

      // SSE 연결이 성공 -> 콜백 함수 실행(sse 연결 이후 실행 로직)
      onOpen && onOpen();

      // sse 파서
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      // 응답을 받아 청크로 처리
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split SSE events by blank line (\n\n or \r\n\r\n)
        let parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const lines = part.split(/\r?\n/);
          let eventName = 'message'; // default per SSE spec
          let dataLines = [];

          for (const line of lines) {
            if (!line) continue;
            if (line.startsWith(':')) continue; // comment/keep-alive
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
              continue;
            }
            if (line.startsWith('data:')) {
              dataLines.push(line.slice(5));
              continue;
            }
          }

          const payloadRaw = dataLines.join('\n');

          // 이벤트로 수신 받은 메세지 콜백 함수 onMessage로 로직 실행
          if (eventName === 'message') {
            const txt = payloadRaw;
            // onMessage로 로직 실행
            if (onMessage) {
              if (txt && (txt.startsWith('{') || txt.startsWith('['))) {
                try { onMessage(JSON.parse(txt)); } catch { onMessage(txt); }
              } else {
                onMessage(txt);
              }
            }
            continue;
          }

          // done 이벤트 수신시 종료
          if (eventName === 'done') {
            onDone && onDone();
            controller.abort();
            return;
          }
        }
      }
      // 종료 이후 done이 안 올 경우 종료
      if (!controller.signal.aborted) {
        try { onDone && onDone(); } catch (e) {console.log(e)}
      }
    } catch (err) {
      if (controller.signal.aborted) return; // closed intentionally
      onError && onError(err);
    }
  })();

  return {
    close: () => controller.abort(),
  };
};

// 사용자의 채팅 히스토리를 조회합니다 (페이지네이션 지원)
const getChatHistoryApi = async (limit, beforeId) => {
  const res = await axiosInstance.get('/api/v1/chat/history', {
    params: {
      ...(limit != null ? { limit } : {}),
      ...(beforeId != null ? { beforeId } : {}),
    },
  });
  return res.data.result;
};
// {
//   "messages": [
//     {
//       "chatId": 0,
//       "speaker": "string",
//       "message": "string",
//       "createdAt": "string",
//       "showDate": true,
//       "dateLabel": "string",
//       "showTime": true,
//       "timeLabel": "string"
//     }
//   ],
//   "hasMore": true,
//   "nextBeforeId": 0
// }
export { postChatApi, getChatApi, getChatHistoryApi };