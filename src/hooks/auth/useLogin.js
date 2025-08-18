import { useMutation } from '@tanstack/react-query';
import { loginEmail, loginPhone } from '../../apis/auth';

export function useLogin(flow) {
  return useMutation({
    mutationFn: async (payload) => {
      if (flow === 'phone') return loginPhone(payload.phoneNumber, payload.password);
      return loginEmail(payload.email, payload.password);
    },
  });
}