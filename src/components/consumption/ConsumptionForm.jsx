import { useEffect, useRef, useState } from "react";
import DownArrow2 from "../../assets/consumption/downArrow2.svg?react";

export default function ConsumptionForm({ form, setForm, categories: categoriesProp, onSave }){
  const [isOpen, setIsOpen] = useState(false);
  const categories = categoriesProp || [
    "식비",
    "카페/간식",
    "생활",
    "교통",
    "쇼핑",
    "문화/여가",
    "의료/건강",
    "교육",
    "주거/관리",
    "기타",
  ];
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫힘 처리
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setForm((prev) => ({ ...prev, date: value }));
      return;
    }

    if (name === "amount") {
      const onlyNums = value.replace(/\D/g, ""); // 숫자만 유지
      setForm((prev) => ({ ...prev, amount: onlyNums }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const memoRef = useRef(null);

  const handleMemoChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, memo: value }));

    if (memoRef.current) {
      memoRef.current.style.height = "auto";
      memoRef.current.style.height = memoRef.current.scrollHeight + "px";
    }
  };
  return(
    <div className="w-full flex flex-col gap-10 px-4 pt-22 pb-4">
      <div className="w-full flex flex-col gap-1">
        <span className="text-detail-01-regular text-green-main-dark-2">지출 날짜</span>
        <div className="border-b border-gray-80">
          <input
            type="date"
            name="date"
            value={form.date || ""}
            onChange={handleChange}
            className="outline-none w-full"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-1">
        <span className="text-detail-01-regular text-green-main-dark-2">지출 카테고리</span>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="h-12 w-full px-3 rounded-[8px] border border-gray-40 flex justify-between items-center text-left"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={form.category ? "text-black" : "text-gray-50"}>
              {form.category || "카테고리를 정해주세요"}
            </span>
            <DownArrow2 />
          </button>

          {isOpen && (
            <ul
             className="absolute z-10 w-full max-h-60 overflow-auto rounded-[8px] border border-gray-30 bg-white shadow"
             role="listbox"
            >
              {categories.map((cat) => (
                <li
                  key={cat}
                  role="option"
                  aria-selected={form.category === cat}
                  onClick={() => handleSelect(cat)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-10 ${
                    form.category === cat ? "bg-gray-10" : ""
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

        <div className="w-full flex flex-col gap-1">
          <span className="w-full text-detail-01-regular text-green-main-dark-2">지출 이름</span>
          <div className="border-b border-gray-80">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="outline-none w-full"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="text-detail-01-regular text-green-main-dark-2">지출 금액</span>
            <div className="w-full flex border-b border-gray-80">
              <input
                name="amount"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.amount}
                onChange={handleChange}
                className="outline-none flex-1"
              />
              <span className="text-body-02-regular text-gray-80">원</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="text-detail-01-regular text-green-main-dark-2">사담</span>
          <textarea
            ref={memoRef}
            name="memo"
            value={form.memo}
            onChange={handleMemoChange}
            className="outline-none w-full border rounded-[8px] p-2 border-gray-80 resize-none overflow-hidden"
            rows={1}
          />
        </div>
      {(() => {
        const isValid = Boolean(form?.category && (form?.name ?? "").trim() && form?.amount !== "");
        return (
          <button
            type="button"
            onClick={() => isValid && onSave && onSave()}
            disabled={!isValid}
            className={`w-full rounded-[4px] py-2 ${isValid ? "bg-green" : "bg-gray-30"} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-body-02-semibold">{isValid ? "작성 완료" : "입력을 완료해 주세요"}</span>
          </button>
        );
      })()}
    </div>

  )
}