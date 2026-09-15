import { mergeExamPage } from "./merge-exam-page";
import type { ExamCatalogPort, FetchUntilUniqueResult } from "./types";

export const fetchUntilUnique = async (input: {
  catalog: ExamCatalogPort;
  seenIds: Set<string>;
  cursor: string | null;
  limit: number;
  maxFetches: number;
}): Promise<FetchUntilUniqueResult> => {
  let cursor = input.cursor;
  let fetches = 0;
  const seenIds = new Set(input.seenIds);

  while (fetches < input.maxFetches) {
    const page = await input.catalog.fetchPage({ cursor, limit: input.limit });
    fetches += 1;
    const merged = mergeExamPage(seenIds, page.items);
    merged.nextSeen.forEach((examId) => seenIds.add(examId));
    if (merged.uniqueCount > 0) {
      return {
        papers: merged.papers,
        cursor: page.nextCursor,
        fetches,
      };
    }
    cursor = page.nextCursor;
    if (!cursor) {
      break;
    }
  }

  return {
    papers: [],
    cursor,
    fetches,
  };
};
