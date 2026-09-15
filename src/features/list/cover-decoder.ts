import type { CoverDecoder } from "./types";

export const createCoverDecoder = (): CoverDecoder => {
  const visible = new Set<string>();
  return {
    markVisible: (examId) => {
      visible.add(examId);
    },
    markHidden: (examId) => {
      visible.delete(examId);
    },
    syncVisible: (examIds) => {
      visible.clear();
      Array.from(examIds).forEach((examId) => visible.add(examId));
    },
    isDecoding: (examId) => visible.has(examId),
    decodingCount: () => visible.size,
  };
};
