import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '../../apis/auth';

/**
 * 현재 로그인한 사용자 정보 조회 훅
 * - React Query 캐시 key: ['me']
 */
export function useMe(options = {}) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 1000 * 60,
    ...options,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    invalidate: () => qc.invalidateQueries({ queryKey: ['me'] }),
  };
}
