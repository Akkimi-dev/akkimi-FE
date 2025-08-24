import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMaltu,
  getMaltuDetail,
  getPublicMaltus,
  getMyMaltus,
  getDefaultMaltus,
  updateMaltu,
  updateMaltuShare,
  deleteMaltu,
  getCurrentMaltu,
  setMaltu,
} from "../../apis/maltuApis";

// 공유 말투 목록
export const usePublicMaltus = () =>
  useQuery({ queryKey: ["publicMaltus"], queryFn: getPublicMaltus });

// 내 말투 목록
export const useMyMaltus = () =>
  useQuery({ queryKey: ["myMaltus"], queryFn: getMyMaltus });

// 기본 말투 목록
export const useDefaultMaltus = () =>
  useQuery({ queryKey: ["defaultMaltus"], queryFn: getDefaultMaltus });

// 말투 상세 조회
export const useMaltuDetail = (maltuId) =>
  useQuery({
    queryKey: ["maltuDetail", maltuId],
    queryFn: () => getMaltuDetail(maltuId),
    enabled: !!maltuId,
  });

// 말투 생성
export const useCreateMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaltu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
    },
  });
};

// 말투 수정
export const useUpdateMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ maltuId, payload }) => updateMaltu(maltuId, payload),
    onSuccess: (_, { maltuId }) => {
      queryClient.invalidateQueries({ queryKey: ["maltuDetail", maltuId] });
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
    },
  });
};

// 말투 공유 여부 수정
export const useUpdateMaltuShare = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ maltuId, isPublic }) => updateMaltuShare(maltuId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
      queryClient.invalidateQueries({ queryKey: ["publicMaltus"] });
    },
  });
};

// 말투 삭제
export const useDeleteMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaltu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
    },
  });
};

// ✅ 현재 말투 변경
export const useSetMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (maltuId) => setMaltu(maltuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentMaltu"] });
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
    },
  });
};

// ✅ 현재 말투 가져오기
export const useCurrentMaltu = () =>
  useQuery({ queryKey: ["currentMaltu"], queryFn: getCurrentMaltu });
