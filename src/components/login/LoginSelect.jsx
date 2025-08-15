import Logo from "../../assets/login/logo.svg?react";
import Mail from "../../assets/login/mail.svg?react";
import Kakao from "../../assets/login/kakao.svg?react";
import Phone from "../../assets/login/phone.svg?react";

export default function LoginSelect({ onChoose, onSignup }) {
  return (
    <div className="relative bg-gradient-to-b from-login-start to-login-end  min-h-[100dvh] md:min-h-[800px] ">
      <div className="absolute top-[160px] flex justify-center w-full">
        <div className="w-13"></div>
        <span className="text-body-02-semiBold">절약 챌린지 서비스</span>
      </div>
      <div className="absolute top-[182px] flex justify-center w-full">
        <Logo/>
      </div>
      
      <div className="absolute top-100 w-full flex flex-col gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 items-center">
            <button
              type="button"
              className="w-[328px] h-[54px] flex justify-between items-center rounded-[100px] border border-gray-40 bg-white hover:bg-gray-20 p-4"
              onClick={() => onChoose && onChoose("phone")}
            >
              <Phone />
              <span className="text-body-01_semiBold">
                휴대폰 번호로 로그인
              </span>
              <div className="w-5 h-5"> </div>
            </button>
            <button
              type="button"
              className="w-[328px] h-[54px] flex justify-between items-center rounded-[100px] border border-gray-40 bg-white hover:bg-gray-20 p-4 "
              onClick={() => onChoose && onChoose("email")}
            >
              <Mail />
              <span className="text-body-01_semiBold">이메일로 로그인</span>
              <div className="w-5 h-5"> </div>
            </button>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="border-t border-gray-30 w-full"></div>
            <span className="text-detail-02-regular text-gray-40">
              3초만에 간편하게!
            </span>
            <button
              type="button"
              className="w-[328px] h-[54px] flex justify-between items-center rounded-[100px] bg-kakao hover:bg-kakao-hover p-4"
              onClick={() => onChoose && onChoose("kakao")}
            >
              <Kakao />
              <span className="text-body-01-regular">카카오로 로그인</span>
              <div className="w-5 h-5"> </div>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-detail-02-regular text-gray-80">문의하기</span>
          <div className="h-[13px] border-l border-gray-80"></div>
          <button
            type="button"
            className="text-detail-02-regular text-gray-80"
            onClick={onSignup}
          >
            회원 가입
          </button>
        </div>
      </div>
    </div>
  );
}
