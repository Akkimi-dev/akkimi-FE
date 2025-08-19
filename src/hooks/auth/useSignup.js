import { useMutation } from '@tanstack/react-query';
import { signupEmail, signupPhone } from '../../apis/auth';

export function useSignup(flow) {
  const isPhone = flow === 'phone_signup';
  return useMutation({
    mutationFn: async (payload) => {
      return isPhone
        ? signupPhone(payload.phoneNumber, payload.password)
        : signupEmail(payload.email, payload.password);
    },
  });
}