// Chat hooks: SSE 스트림과 히스토리 조회를 위한 재사용 훅
// - useChatStream: 메시지 ID 기반 SSE 수신
// - useChatHistory: 페이지네이션 기반 히스토리 조회

import { getChatHistoryApi, postChatApi } from "../../apis/chatApis";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

// 단건 조회형 히스토리 훅 (React Query)
export function useChatHistoryQuery({ limit = 20, beforeId = null } = {}, options = {}) {
  return useQuery({
    queryKey: ["chatHistory", { limit, beforeId }],
    queryFn: () => getChatHistoryApi(limit, beforeId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    select: (data) => ({
      items: Array.isArray(data?.messages) ? data.messages.slice().reverse() : [],
      hasMore: Boolean(data?.hasMore),
      nextBeforeId: data?.nextBeforeId ?? null,
    }),
    ...options,
  });
}

/**
 * useChatHistoryInfiniteQuery
 * - React Query 기반 무한 스크롤 히스토리 조회 훅
 * - getNextPageParam: 마지막 페이지의 마지막 아이템 id를 beforeId로 사용
 */
export function useChatHistoryInfiniteQuery({ pageSize = 20 } = {}) {
  return useInfiniteQuery({
    queryKey: ["chatHistory", pageSize],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      return await getChatHistoryApi(pageSize, pageParam);
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage?.nextBeforeId : undefined;
    },
    select: (data) => {
      const allDesc = data.pages.flatMap((p) => Array.isArray(p?.messages) ? p.messages : []);
      const items = allDesc.slice().reverse();
      const last = data.pages[data.pages.length - 1];
      const hasMore = Boolean(last?.hasMore);
      const nextBeforeId = last?.nextBeforeId ?? null;
      return { items, hasMore, nextBeforeId, pageParams: data.pageParams };
    },
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
}

/**
 * useSendMessageMutation
 * - 메시지 전송 뮤테이션. 성공 시 히스토리 캐시 무효 하지 않고 스트리밍 중에는 invalidate 지연 후 캐시 무효화
 */
export function useSendMessageMutation(options = {}) {
  return useMutation({
    mutationKey: ["chatSend"],
    mutationFn: async (payload) => postChatApi(payload),
    onSuccess: async (...args) => {
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
    onSettled: options.onSettled,
  });
}
