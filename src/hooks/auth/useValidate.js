// 중복/유효성 검증 훅
import { useMutation } from '@tanstack/react-query';
import { validatePhone, validateEmail } from '../../apis/auth';

// 휴대폰 중복/유효성 검사
export function useValidatePhone() {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async (phoneNumber) => {
      const normalizedPhone = phoneNumber.replace(/\D/g, '');
      const res = await validatePhone(normalizedPhone);
      return Boolean(res?.result?.available);
    },
    retry: 0,
  });

  return { checkPhone: mutateAsync, isLoading, error };
}

// 이메일 중복/유효성 검사
export function useValidateEmail() {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async (email) => {
      const trimmedEmail = email.trim();
      const res = await validateEmail(trimmedEmail);
      return Boolean(res?.result?.available);
    },
    retry: 0,
  });

  return { checkEmail: mutateAsync, isLoading, error };
}