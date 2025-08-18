import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { logout as logoutApi } from '../../apis/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

// 로그아웃 훅
export function useLogout() {
  const qc = useQueryClient();
  const { clearTokens } = useAuthStore();
  const navigate = useNavigate();

  const  { mutate, mutateAsync, isLoading, error } = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearTokens();
      qc.invalidateQueries({ queryKey: ['me'] });
      navigate('/auth');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
    },
    retry: 0,
  });

  return { mutate, mutateAsync, isLoading, error };

}