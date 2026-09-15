import {
  createDefaultExams,
  createSheetServer,
  DEFAULT_EXAM_COUNT,
} from "@/features/list";

describe("default exam catalog", () => {
  test("exposes 20 unique exam papers", () => {
    const papers = createDefaultExams();
    const ids = papers.map((paper) => paper.examId);

    expect(papers).toHaveLength(DEFAULT_EXAM_COUNT);
    expect(DEFAULT_EXAM_COUNT).toBe(20);
    expect(new Set(ids).size).toBe(20);
  });

  test("uses Korean exam titles instead of product or ticker names", () => {
    const titles = createDefaultExams().map((paper) => paper.title).join("\n");

    expect(titles).toContain("2026 수능 국어 짝수형");
    expect(titles).toContain("6월 모의");
    expect(titles).toContain("공무원 한국사");
    expect(titles).not.toMatch(/productId|ticker/i);
  });

  test("serves unique papers on the default first page", async () => {
    const catalog = createSheetServer();
    const page = await catalog.fetchPage({ cursor: null, limit: 20 });
    const ids = page.items.map((paper) => paper.examId);

    expect(page.items).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(page.items.every((paper) => paper.coverKey === "normal")).toBe(true);
  });
});
