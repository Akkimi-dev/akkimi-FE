import BackArrow from "../../assets/common/backArrow.svg?react";
import Error from "../../assets/login/error.svg?react";
import Waring from "../../assets/login/waring.svg?react";
import Eye from "../../assets/login/eye.svg?react";

import { useState } from "react";

export default function Login({flow, onInit}) {
  const [value, setValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPhone = flow === "phone";
  const headingTitle = isPhone ? "휴대폰 번호로 로그인하기" : "이메일로 로그인하기";
  const headingSubtitle = isPhone
    ? "아끼미 가입에 사용했던 휴대폰 번호를 입력해주세요."
    : "아끼미 가입에 사용했던 이메일을 입력해주세요.";
  const labelText = isPhone ? "휴대폰 번호" : "이메일";
  const inputType = isPhone ? "tel" : "email";
  const autoCompleteAttr = isPhone ? "tel" : "email";
  const warningText = isPhone
    ? "휴대폰 번호 작성이 완료되지 않았습니다"
    : "이메일 형식이 올바르지 않습니다";
  const borderClass = isInvalid && value.length > 0
    ? "border-login-waring"
    : "border-gray-60 focus:border-login-good";

  const handleChange = (e) => {
    let val = e.target.value;
    if (flow === "phone") {
      // 숫자만 입력
      val = val.replace(/[^0-9]/g, "");
      // 전화번호: 3-4-4 형식
      if (val.length > 3 && val.length <= 7) {
        val = val.slice(0, 3) + "-" + val.slice(3);
      } else if (val.length > 7) {
        val = val.slice(0, 3) + "-" + val.slice(3, 7) + "-" + val.slice(7, 11);
      }
      setIsInvalid(val.length !== 13); // '000-0000-0000' 길이 = 13
    } else {
      // 이메일 형식
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsInvalid(!emailRegex.test(val));
    }
    setValue(val);
  };

  return (
    <div className="flex flex-col">
      <button className="p-4 mb-4" onClick={onInit}>
        <BackArrow />
      </button>
      <div className="flex flex-col gap-2 px-4 mb-12">
        <span className="text-heading-01-regular text-gray-100">
          {headingTitle}
        </span>
        <span className="text-detail-01-regular text-gray-60">
          {headingSubtitle}
        </span>
      </div>
      <div className="w-full flex flex-col gap-14 px-4">
        <div className="w-full flex flex-col gap-[30px]">
          <div className="w-full flex flex-col gap-1 relative">
            <span className="text-detail-01-regular text-gray-60 ">
              {labelText}
            </span>
            <input
              type={inputType}
              value={value}
              onChange={handleChange}
              className={`focus:outline-none focus:shadow-none w-full border p-2 rounded pr-10 ${borderClass}`}
              placeholder=""
              autoComplete={autoCompleteAttr}
              inputMode={isPhone ? "numeric" : undefined}
              maxLength={isPhone ? 13 : undefined}
            />
            {isInvalid && value.length > 0 && (
              <>
                <Waring className="absolute right-3 top-[34px]" />
                <span className="text-yellow-500 text-sm mt-1">{warningText}</span>
              </>
            )}
          </div>
          <div className="w-full flex flex-col gap-1 relative">
            <span className="text-detail-01-regular text-gray-60">
              비밀번호
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:shadow-none w-full border p-2 rounded border-gray-60 focus:border-login-good pr-10"
              placeholder=""
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-60"
            >
              <Eye />
            </button>
          </div>
        </div>
        <button className={`w-full flex items-center justify-center gap-[10px] rounded-[100px] py-[12px] cursor-pointer ${isInvalid ? "bg-gray-20" : "bg-login-good hover:bg-login-good-hover"}`}>
          <span className="">로그인</span>
        </button>
      </div>
    </div>
  );
}
