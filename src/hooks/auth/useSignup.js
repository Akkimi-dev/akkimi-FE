import { useMutation } from '@tanstack/react-query';
import { signupEmail, signupPhone } from '../../apis/auth';

export function useSignup(flow) {
  const isPhone = flow === 'phone' || flow === 'phone_signup';

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async (payload) => {
      if (isPhone) {
        return await signupPhone(payload.phoneNumber, payload.password);
      }
      return await signupEmail(payload.email, payload.password);
    },
    // 성공/실패 후 처리(토큰 저장, 모달)는 호출부에서 
    retry: 0,
  });

  return { mutate, mutateAsync, isPending, error, reset };
}