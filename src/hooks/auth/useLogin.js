import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { loginEmail, loginPhone, kakaoLogin } from '../../apis/auth';
import { useAuthStore } from '../../stores/useAuthStore';

export function useLogin(flow) {
  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async (payload) => {
      if (flow === 'phone') {
        return await loginPhone(payload.phoneNumber, payload.password);
      }
      return await loginEmail(payload.email, payload.password);
    },
    // 성공/실패 후 처리(토큰 저장, 모달)는 호출부에서
    retry: 0,
  });

  return { mutate, mutateAsync, isPending, error, reset };
}

export function useKakaoLogin() {
  const { setTokens } = useAuthStore();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: (code) => kakaoLogin(code),
    onSuccess: ({ accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
    },
    retry: 0,
  });

  return { mutateAsync, isLoading, error };
}