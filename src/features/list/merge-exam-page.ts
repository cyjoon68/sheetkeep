import type { ExamPaper, MergeExamPageResult } from "./types";

export const mergeExamPage = (seenIds: Set<string>, items: ExamPaper[]): MergeExamPageResult => {
  const nextSeen = new Set(seenIds);
  const papers: ExamPaper[] = [];
  items.forEach((item) => {
    if (nextSeen.has(item.examId)) {
      return;
    }
    nextSeen.add(item.examId);
    papers.push(item);
  });
  return {
    papers,
    uniqueCount: papers.length,
    nextSeen,
  };
};
