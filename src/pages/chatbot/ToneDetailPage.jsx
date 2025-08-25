import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Goback3Arrow from "../../assets/settings/gobackarrow3.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";
import { useMaltuDetail, useSetMaltu, useUpdateMaltu, useUpdateMaltuShare, useDeleteMaltu } from "../../hooks/chat/useMaltu";
import { useUserProfile } from "../../hooks/user/useUser";
import useErrorModal from "../../hooks/error/useErrorModal";
import { useQueryClient } from "@tanstack/react-query";

export default function ToneDetailPage() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { show: showError, Modal: ErrorModalMount } = useErrorModal();
  const { toneId } = useParams();
  const maltuId = toneId; // 라우트 파라미터로 전달된 ID 사용

  // 상세 조회 훅
  const { data: tone, isLoading, isError, } = useMaltuDetail(maltuId);

  const { data: profile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ maltuName: "", prompt: "" });
  const promptRef = useRef(null);

  useEffect(() => {
    if (!tone) return;
    setForm({ maltuName: tone?.maltuName ?? "", prompt: tone?.prompt ?? "" });
  }, [tone]);

  useEffect(() => {
    if (!isEditing) return;
    if (promptRef.current) {
      promptRef.current.style.height = 'auto';
      promptRef.current.style.height = promptRef.current.scrollHeight + 'px';
    }
  }, [isEditing, form.prompt]);

  // ✅ 현재 말투 설정 mutation
  const { mutate: setMaltuMutation, isPending } = useSetMaltu();
  const { mutate: updateMaltu, isPending: isUpdating } = useUpdateMaltu();
  const { mutate: toggleShare, isPending: isToggling } = useUpdateMaltuShare();
  const { mutate: deleteMaltu, isPending: isDeleting } = useDeleteMaltu();

  const handleApply = () => {
    if (!maltuId) return alert('잘못된 접근입니다.');
    setMaltuMutation(maltuId, {
      onSuccess: () => {
        nav(-1);
      },
      onError: (err) => {
        console.error('말투 적용 실패:', err);
        alert('말투 적용에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  const handlePromptChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, prompt: value }));
    if (promptRef.current) {
      promptRef.current.style.height = 'auto';
      promptRef.current.style.height = promptRef.current.scrollHeight + 'px';
    }
  };

  const handleToggleShare = () => {
    if (!maltuId || !tone) return;
    toggleShare(
      { maltuId, isPublic: !tone.isPublic },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["maltuDetail", maltuId] });
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || err?.message;
          showError(msg || "공유 설정을 변경하지 못했습니다.");
        },
      }
    );
  };

  const handleSaveEdit = () => {
    const name = form.maltuName?.trim();
    const prompt = form.prompt?.trim();
    if (!name) return showError("말투 제목을 입력하세요.");
    if (!prompt) return showError("프롬프트를 입력하세요.");

    updateMaltu(
      { maltuId, payload: { maltuName: name, prompt } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || err?.message;
          showError(msg || "말투 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!maltuId) return;
    if (!window.confirm("말투를 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;

    deleteMaltu(maltuId, {
      onSuccess: () => nav(-1),
      onError: (err) => {
        const msg = err?.response?.data?.message || err?.message;
        showError(msg || "삭제에 실패했습니다.");
      },
    });
  };

  const canEdit = !!(profile?.userId && tone?.creatorId === profile.userId);

  if (isLoading) {
    return (
      <NoNavLayout>
        <div className="w-full h-full flex items-center justify-center">로딩중...</div>
      </NoNavLayout>
    );
  }

  if (isError) {
    return (
      <NoNavLayout>
        <div className="w-full h-full flex items-center justify-center">상세 정보를 불러오지 못했습니다.</div>
      </NoNavLayout>
    );
  }

  if (!tone) {
    return (
      <NoNavLayout>
        <div className="w-full h-full flex items-center justify-center">존재하지 않는 말투입니다.</div>
      </NoNavLayout>
    );
  }

  return (
    <NoNavLayout>
      <div className="w-full min-h-full bg-white flex flex-col px-4 gap-6">
        <header className="flex items-center py-3">
          <button className="w-[75px]" onClick={() => nav(-1)}>
            <Goback3Arrow className="w-5 h-5" />
          </button>
          <h1 className="text-heading-02-semibold mx-auto">
            {isEditing ? '챗봇 말투 수정' : ''}
          </h1>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className={`text-body-02-semibold px-2 py-1 rounded-md ${isUpdating ? ' cursor-not-allowed' : ' text-green-main-dark-2'}`}
                >
                  {isUpdating ? '저장 중…' : '작성 완료'}
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-body-2-semibold"
                    >
                      수정하기
                    </button>
                    <button
                      onClick={handleToggleShare}
                      disabled={isToggling}
                      className={`text-body-2-semibold ${tone.isPublic ? 'text-green-main-dark-2' : 'text-green-main-dark-2'} ${isToggling ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isToggling ? '공유 변경…' : (tone.isPublic ? '공유 취소' : '공유 하기')}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </header>

        {/* 본문 */}
        <main className="">
          {!isEditing ? (
            <>
              <h2 className="text-[#5ACBB0] text-detail-01-regular mb-1">말투 제목</h2>
              <p className="text-lg font-bold mb-4">{tone.maltuName}</p>

              <h3 className="text-[#5ACBB0] text-sm font-semibold mb-2">프롬프트</h3>
              <div className="p-4 rounded-xl border border-gray-300 bg-[#F1F1F5] text-sm leading-relaxed whitespace-pre-line">
                {tone.prompt}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-[#5ACBB0] text-detail-01-regular">말투 제목</label>
                  <input
                    type="text"
                    value={form.maltuName}
                    onChange={(e) => setForm({ ...form, maltuName: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[#5ACBB0] text-detail-01-regular">프롬프트</label>
                  <textarea
                    rows={3}
                    ref={promptRef}
                    value={form.prompt}
                    onChange={handlePromptChange}
                    style={{ height: 'auto', overflow: 'hidden' }}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}
        </main>
        {!isEditing && (
          <div className="w-full flex justify-end gap-2 mb-2">
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-[4px] font-semibold ${isDeleting ? 'bg-red-200 text-white cursor-not-allowed' : 'bg-red-500 text-white'}`}
              >
                {isDeleting ? '삭제 중…' : '삭제'}
              </button>
            )}
            <button
              onClick={handleApply}
              disabled={isPending}
              className={`px-4 py-2 rounded-[4px] font-semibold ${isPending ? 'bg-[#9fdccc] text-white cursor-not-allowed' : 'bg-[#5ACBB0] text-white'}`}
            >
              {isPending ? '적용 중…' : '적용하기'}
            </button>
          </div>
        )}
      </div>
      <ErrorModalMount />
    </NoNavLayout>
  );
}
