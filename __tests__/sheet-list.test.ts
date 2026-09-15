import listContract from "../contracts/sheet-list.json";
import { createStressExams } from "./helpers/stress-exams";
import {
  createCoverDecoder,
  createSheetServer,
  fetchUntilUnique,
  isTapWithinSlop,
  MAX_EMPTY_UNIQUE_FETCHES,
  mergeExamPage,
  TAP_SLOP_PX,
} from "@/features/list";

describe("exam list paging and covers", () => {
  test("skips examIds that were already seen", () => {
    const papers = createStressExams(3);
    const seenIds = new Set([papers[0].examId]);
    const merged = mergeExamPage(seenIds, [papers[0], papers[1], papers[0]]);

    expect(merged.papers.map((paper) => paper.examId)).toEqual([papers[1].examId]);
    expect(merged.uniqueCount).toBe(1);
    expect(merged.nextSeen.has(papers[0].examId)).toBe(true);
  });

  test("fetches the next page when a duplicate page yields zero unique exams, up to 5 times", async () => {
    const papers = createStressExams(40);
    const catalog = createSheetServer({
      papers,
      pageSize: 10,
      duplicatePages: 3,
    });

    const first = await fetchUntilUnique({
      catalog,
      seenIds: new Set(),
      cursor: null,
      limit: 10,
      maxFetches: MAX_EMPTY_UNIQUE_FETCHES,
    });

    expect(MAX_EMPTY_UNIQUE_FETCHES).toBe(listContract.maxEmptyUniqueFetches);
    expect(first.fetches).toBe(1);
    expect(first.papers).toHaveLength(10);

    const second = await fetchUntilUnique({
      catalog,
      seenIds: new Set(first.papers.map((paper) => paper.examId)),
      cursor: first.cursor,
      limit: 10,
      maxFetches: MAX_EMPTY_UNIQUE_FETCHES,
    });

    expect(second.fetches).toBeGreaterThan(1);
    expect(second.fetches).toBeLessThanOrEqual(5);
    expect(second.papers[0]?.examId).toBe("stress-11");
    expect(first.papers[0]?.examId).toBe("stress-1");
  });

  test("stops after five empty unique fetches", async () => {
    const papers = createStressExams(10);
    const catalog = createSheetServer({
      papers,
      pageSize: 10,
      duplicatePages: 8,
    });
    const first = await catalog.fetchPage({ cursor: null, limit: 10 });
    const seenIds = new Set(first.items.map((paper) => paper.examId));
    const next = await fetchUntilUnique({
      catalog,
      seenIds,
      cursor: first.nextCursor,
      limit: 10,
      maxFetches: MAX_EMPTY_UNIQUE_FETCHES,
    });

    expect(next.fetches).toBe(5);
    expect(next.papers).toHaveLength(0);
  });

  test("decodes covers only for visible exam cards", () => {
    const decoder = createCoverDecoder();
    decoder.markVisible("exam-1");
    decoder.markVisible("exam-2");
    decoder.markHidden("exam-2");

    expect(decoder.decodingCount()).toBe(1);
    expect(decoder.isDecoding("exam-1")).toBe(true);
    expect(decoder.isDecoding("exam-2")).toBe(false);
    expect(decoder.isDecoding("exam-offscreen")).toBe(false);
  });

  test("rejects a card press that moved past tap slop", () => {
    expect(TAP_SLOP_PX).toBe(listContract.tapSlopPx);
    expect(isTapWithinSlop({ x: 10, y: 10 }, { x: 12, y: 11 }, TAP_SLOP_PX)).toBe(true);
    expect(isTapWithinSlop({ x: 10, y: 10 }, { x: 40, y: 10 }, TAP_SLOP_PX)).toBe(false);
  });
});
