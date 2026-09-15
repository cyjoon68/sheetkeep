import { PAGE_SIZE } from "./constants";
import { createDefaultExams } from "./create-default-exams";
import type { ExamCatalogPort, ExamPaper, SheetServerOptions } from "./types";

const uniquePageIndex = (pageIndex: number, duplicatePages: number): number => {
  if (pageIndex === 0) {
    return 0;
  }
  return Math.max(0, pageIndex - duplicatePages);
};

export const createSheetServer = (options: SheetServerOptions = {}): ExamCatalogPort => {
  const papers = options.papers ?? createDefaultExams();
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const duplicatePages = options.duplicatePages ?? 0;
  const byId = new Map(papers.map((paper) => [paper.examId, paper]));

  return {
    fetchPage: async ({ cursor, limit }) => {
      const size = limit || pageSize;
      const pageIndex = cursor ? Number(cursor) : 0;
      const offset = uniquePageIndex(pageIndex, duplicatePages) * size;
      const items: ExamPaper[] = papers.slice(offset, offset + size);
      const nextPage = pageIndex + 1;
      const nextOffset = uniquePageIndex(nextPage, duplicatePages) * size;
      const hasMore = nextPage <= duplicatePages || nextOffset < papers.length;
      return {
        items,
        nextCursor: hasMore ? String(nextPage) : null,
      };
    },
    getById: async (examId) => byId.get(examId) ?? null,
  };
};
