import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { loginEmail, loginPhone, kakaoLogin } from '../../apis/auth';
import { useAuthStore } from '../../stores/useAuthStore';

export function useLogin(flow) {
  const { setTokens } = useAuthStore();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async (payload) => {
      if (flow === 'phone') return loginPhone(payload.phoneNumber, payload.password);
      return loginEmail(payload.email, payload.password);
    },
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response;
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