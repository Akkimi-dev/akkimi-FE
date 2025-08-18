// 중복/유효성 검증 훅
import { useMutation } from '@tanstack/react-query';
import { validatePhone, validateEmail } from '../../apis/auth';

// 휴대폰 중복/유효성 검사
export function useValidatePhone() {
  return useMutation({
    mutationFn: (phoneNumber) => validatePhone(phoneNumber),
  });
}

// 이메일 중복/유효성 검사
export function useValidateEmail() {
  return useMutation({
    mutationFn: (email) => validateEmail(email),
  });
}