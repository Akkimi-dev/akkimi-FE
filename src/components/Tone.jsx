import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownIcon from "../assets/Settings/dropdown2.svg?react";
import UpIcon from "../assets/Settings/Up.svg?react";
import Edit2Icon from "../assets/Settings/edit2.svg?react";

import { useUserProfile } from "../hooks/user/useUser";
import { useDefaultMaltus, useMyMaltus } from "../hooks/chat/useMaltu";

export default function Tone() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  // ✅ 사용자 프로필에서 현재 선택된 maltuId 가져오기
  const { data: profile } = useUserProfile();
  const currentMaltuId = profile?.maltuId;

  // ✅ 기본 말투 / 내 말투 목록 불러오기
  const { data: defaultMaltus = [] } = useDefaultMaltus();
  const { data: myMaltus = [] } = useMyMaltus();
  
// ✅ 기본 말투 + 내 말투 합치기
const allMaltus = [...(defaultMaltus || []), ...(myMaltus || [])];

// ✅ 현재 maltuId와 매칭되는 말투 찾기
const currentMaltu = allMaltus.find(
  (m) => String(m.maltuId) === String(currentMaltuId)
);
  return (
    <section className="px-4">
      <h2 className="flex flex-row justify-between pt-4 text-sm font-semibold mb-2">
        <span>현재 말투</span>
        {/* 내가 만든 말투일 때만 수정 버튼 보이기 */}
        {currentMaltu?.creatorId !== 1 && ( // creatorId=1은 아끼미봇 (기본 말투)
          <button onClick={() => nav("/tone-list")}>
            <Edit2Icon className="w-4 h-4" />
          </button>
        )}
      </h2>

      <div
        className="w-full border border-gray-300 rounded-xl px-3 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm">
          {currentMaltu ? currentMaltu.maltuName : "선택된 말투 없음"}
        </span>
        {open ? (
          <UpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <DropdownIcon className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {open && currentMaltu && (
        <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-line text-sm text-gray-700">
          {currentMaltu.prompt}
        </div>
      )}
    </section>
  );
}
