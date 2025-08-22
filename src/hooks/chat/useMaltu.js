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
} from "../apis/maltuApis";

// 모든 공유된 말투 목록
export const usePublicMaltus = () => {
  return useQuery({
    queryKey: ["publicMaltus"],
    queryFn: getPublicMaltus,
  });
};

// 내가 생성한 말투 목록
export const useMyMaltus = () => {
  return useQuery({
    queryKey: ["myMaltus"],
    queryFn: getMyMaltus,
  });
};

// 기본 말투 목록
export const useDefaultMaltus = () => {
  return useQuery({
    queryKey: ["defaultMaltus"],
    queryFn: getDefaultMaltus,
  });
};

// 말투 상세 조회
export const useMaltuDetail = (maltuId) => {
  return useQuery({
    queryKey: ["maltuDetail", maltuId],
    queryFn: () => getMaltuDetail(maltuId),
    enabled: !!maltuId, // maltuId 있을 때만 호출
  });
};

// 말투 생성
export const useCreateMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaltu,
    onSuccess: () => {
      queryClient.invalidateQueries(["myMaltus"]);
    },
  });
};

// 말투 수정
export const useUpdateMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ maltuId, payload }) => updateMaltu(maltuId, payload),
    onSuccess: (_, { maltuId }) => {
      queryClient.invalidateQueries(["maltuDetail", maltuId]);
      queryClient.invalidateQueries(["myMaltus"]);
    },
  });
};

// 말투 공유 여부 수정
export const useUpdateMaltuShare = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ maltuId, isPublic }) => updateMaltuShare(maltuId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries(["myMaltus"]);
      queryClient.invalidateQueries(["publicMaltus"]);
    },
  });
};

// 말투 삭제
export const useDeleteMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaltu,
    onSuccess: () => {
      queryClient.invalidateQueries(["myMaltus"]);
    },
  });
};
