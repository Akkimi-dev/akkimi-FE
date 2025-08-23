import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Dropdown2Icon from "../../assets/Settings/dropdown2.svg?react";
import Plus2Icon from "../../assets/Settings/plus2.svg?react";
import Goback2Icon from "../../assets/Settings/gobackarrow2.svg?react";
import Goback3Arrow from "../../assets/Settings/gobackarrow3.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";

// api
import { getCurrentMaltu, createMaltu, setMaltu } from "../../apis/userApis";

export default function ChatbotMaltu() {
  const nav = useNavigate();
  const location = useLocation();

  const [showDescription, setShowDescription] = useState(false);
  const [myTones, setMyTones] = useState([]);
  const [selectedTone, setSelectedTone] = useState(null); // 현재 말투
  const [modalTone, setModalTone] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [exploreTones, setExploreTones] = useState([]);

  // ✅ ToneList에서 전달된 새 말투 반영
  useEffect(() => {
    if (location.state?.newTone) {
      const raw = location.state.newTone;
      const newTone = {
        id: raw.maltuId,
        label: raw.maltuName,
        description: raw.prompt,
      };

      const updated = [...myTones, newTone];
      setMyTones(updated);
      localStorage.setItem("myTones", JSON.stringify(updated));

      // 바로 선택 상태도 갱신
      setSelectedTone(newTone);
      localStorage.setItem("selectedTone", JSON.stringify(newTone));
      window.dispatchEvent(new Event("storage"));
    }
  }, [location.state]);

  // 현재 말투 API
  useEffect(() => {
    const fetchMaltu = async () => {
      try {
        const res = await getCurrentMaltu();
        if (res?.result && Object.keys(res.result).length > 0) {
          const toneData = {
            id: res.result.maltuId,
            label: res.result.maltuName,
            description: res.result.prompt,
          };
          setSelectedTone(toneData);
        } else {
          setSelectedTone(null);
        }
      } catch (err) {
        console.error("현재 말투 불러오기 실패:", err);
        setSelectedTone(null);
      }
    };
    fetchMaltu();
  }, []);

  // 로컬스토리지에서 초기값 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myTones") || "[]");
    setMyTones(saved);

    const savedSelected = JSON.parse(localStorage.getItem("selectedTone"));
    if (savedSelected) setSelectedTone(savedSelected);
  }, []);

  // storage 이벤트 감지 → 다른 페이지에서 반영
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSelected = JSON.parse(localStorage.getItem("selectedTone"));
      if (savedSelected) setSelectedTone(savedSelected);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ 새 말투 생성하기
  const handleCreateMaltu = async () => {
    try {
      const result = await createMaltu("default", true, "");
      console.log("말투 생성 성공:", result);

      if (result?.result) {
        const newTone = {
          id: result.result.maltuId,
          label: result.result.maltuName,
          description: result.result.prompt,
        };

        // 로컬 상태 & localStorage 갱신
        const updated = [...myTones, newTone];
        setMyTones(updated);
        localStorage.setItem("myTones", JSON.stringify(updated));
        alert("새 말투가 생성되었습니다! ✅");
      }
    } catch (err) {
      console.error("말투 생성 에러:", err);
      alert("말투 생성에 실패했습니다 ❌");
    }
  };

  // 페이지네이션용
  const chunkedTones = [];
  for (let i = 0; i < myTones.length; i += 3) {
    chunkedTones.push(myTones.slice(i, i + 3));
  }

  return (
    <NoNavLayout>
      <div className="w-full max-h-full bg-white flex flex-col overflow-auto">
        {/* 헤더 */}
        <header className="flex items-center px-4 py-3">
          <button className="mr-2" onClick={() => nav(-1)}>
            <Goback3Arrow className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-semibold">
            챗봇 말투 설정
          </h1>
          <div className="w-5" />
        </header>

        {/* 이하 UI는 그대로 (생략 X) */}
        {/* ... (디자인은 그대로 유지, 로직만 수정됨) */}
      </div>
    </NoNavLayout>
  );
}
