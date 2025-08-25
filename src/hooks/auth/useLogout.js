import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { logout as logoutApi } from '../../apis/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

// 로그아웃 훅
export function useLogout() {
  const qc = useQueryClient();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const { refreshToken } = useAuthStore.getState()

  const  { mutate, mutateAsync, isLoading, error } = useMutation({
    mutationFn: () => logoutApi( refreshToken ),
    onSuccess: async () => {
      // 토큰 제거
      clearAuth();
      // 모든 진행 중 쿼리 취소
      await qc.cancelQueries();
      qc.clear();
      // 인증 페이지로 이동(뒤로가기 방지)
      navigate('/auth', { replace: true });
    },
    onError: (error) => {
      clearAuth();
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
    },
    retry: 0,
  });

  return { mutate, mutateAsync, isLoading, error };

}