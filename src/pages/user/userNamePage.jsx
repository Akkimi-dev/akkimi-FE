import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUpdateNickname, useUserProfile } from '../../hooks/user/useUser';
import useErrorModal from '../../hooks/error/useErrorModal';

import NameDone from "../../assets/settings/nameDone.svg?react";

import Header from '../../components/common/Header';

export default function UserNamePage() {
  const navigate = useNavigate();
  const { show: showError, Modal: ErrorModalMount } = useErrorModal();
  const [searchParams] = useSearchParams();
  const isInit = searchParams.get('type') === 'init';
  const INIT_REDIRECT_URL = '/survey';

  // 프로필 조회로 모드 결정 (닉네임 존재 여부)
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useUserProfile();

  // 최초 1회 프로필 값으로 초기화
  const [value, setValue] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!initialized && profile) {
      setValue(profile?.nickname ?? '');
      setInitialized(true);
    }
  }, [profile, initialized]);

  const isEdit = Boolean((profile?.nickname ?? '').trim());

  const updateNicknameMutation = useUpdateNickname();

  const inputType = 'text';
  const autoCompleteAttr = 'off';

  const trimmed = useMemo(() => value.trim(), [value]);
  const isValid = trimmed.length > 0 && trimmed.length <= 10;

  const contactBorderClass = (!isValid && value.length > 0)
    ? 'border-login-waring text-gray-30'
    : 'border-gray-80 focus:border-green-main-dark-2';

  const helperText = useMemo(() => {
    if (!isValid && value.length > 0) return '닉네임은 공백 제외 1~10자 이내로 입력하세요.';
    return '';
  }, [isValid, value.length]);

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!isValid) {
      return showError('닉네임은 공백 제외 1~10자 이내로 입력하세요.');
    }
    try {
      await updateNicknameMutation.mutateAsync(trimmed);
      if (isEdit) {
        navigate('/settings', { replace: true });
      } else {
        setDone(true);
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message;
      showError(serverMsg || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const pendingLabel = isEdit ? '수정 중…' : '저장 중…';
  const submitLabel  = isEdit ? '수정 완료' : '완료';

  if (isProfileError) {
    return (
      <div className="relative w-full h-full px-6 pt-10">프로필 불러오기 실패</div>
    );
  }

  if (isProfileLoading && !initialized) {
    return (
      <div className="relative w-full h-full px-6 pt-10">로딩중...</div>
    );
  }

  const handleStartQuiz = () => {
    navigate('/survey', { replace: isInit });
  };
  const handleLater = () => {
    if (isInit) {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  if (done && !isEdit) {
    return (
      <div className="relative w-full h-full px-6 pt-10 flex flex-col items-center justify-center gap-15">
        <NameDone />
        <div className="w-full flex flex-col gap-1 max-w-[420px] items-center">
          <span className='text-detail-01-regular text-gray-60'>1분만에 끝나는 간단 퀴즈</span>
          <button
            type="button"
            onClick={handleStartQuiz}
            className="px-6 py-4 w-full rounded-[30px] text-body-02-semibold bg-green hover:bg-green-main-dark-2 text-gray-100 mb-3"
          >
            소비성향 퀴즈 시작하기
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="px-6 py-4 w-full rounded-[30px] text-body-02-semibold bg-gray-10 hover:bg-gray-30 text-gray-60"
          >
            다음에 진행하기
          </button>
        </div>
        <ErrorModalMount />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full px-6 pt-10 flex flex-col gap-10">
      {isEdit ? (
        <div className='pb-4'>
          <Header header="닉네임 수정"/>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <span className='text-detail-01-regular text-gray-60'>반갑습니다 새로운 도전자님!</span>
          <div className='flex flex-col'>
            <span className='text-heading-01-bold text-gray-100'>아끼미에서 사용할 </span>
            <span className='text-heading-01-bold text-gray-100'>닉네임을 생성해주세요</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-1 relative">
          <span className="text-detail-01-regular text-gray-60">닉네임</span>
          <input
            type={inputType}
            value={value}
            onChange={handleChange}
            className={`focus:outline-none focus:shadow-none w-full h-12 border p-2 leading-[32px] rounded pr-10 text-body-02-semibold ${contactBorderClass}`}
            placeholder="10글자 이내로 닉네임을 생성해주세요"
            autoComplete={autoCompleteAttr}
          />
          <span className="absolute right-2 top-[42px] text-detail-02-regular text-gray-50">{value.length}/10</span>
          {helperText && (
            <span className="text-detail-02-regular text-login-warning mt-1">{helperText}</span>
          )}
        </div>

        <div className="mt-10">
          <button
            type="submit"
            disabled={!isValid || updateNicknameMutation.isPending}
            className={`w-full h-12 rounded-[8px] text-body-02-semibold ${(!isValid || updateNicknameMutation.isPending) ? 'bg-gray-40 text-gray-70 cursor-not-allowed' : 'bg-green hover:bg-green-main-dark-2 text-gray-60'}`}
          >
            {updateNicknameMutation.isPending ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>

      <ErrorModalMount />
    </div>
  );
}