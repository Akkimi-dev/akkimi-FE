import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownIcon from "../assets/Settings/dropdown2.svg?react";
import UpIcon from "../assets/Settings/Up.svg?react";
import Edit2Icon from "../assets/Settings/edit2.svg?react";

export default function Tone({ currentTone, setCurrentTone }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <section className="px-4">
      <h2 className="flex flex-row justify-between pt-4 text-sm font-semibold mb-2">
        <span>현재 말투</span>
        {/* 내가 만든 말투일 때만 수정 버튼 보이기 */}
        {currentTone.isMine && (
          <button onClick={() => nav("/tone-list")}>
            <Edit2Icon className="w-4 h-4" />
          </button>
        )}
      </h2>

      <div
        className="w-full border border-gray-300 rounded-xl px-3 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm">{currentTone.name}</span>
        {open ? (
          <UpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <DropdownIcon className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {open && (
        <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-line text-sm text-gray-700">
          {currentTone.description}
        </div>
      )}
    </section>
  );
}
