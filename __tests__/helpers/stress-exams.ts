import type { ExamPaper } from "@/features/list";

const PATTERNS = [
  (index: number) => `2026 수능 국어 ${index}회 짝수형`,
  (index: number) => `2026 6월 모의 수학 ${index}회`,
  (index: number) => `공무원 한국사 ${index}회`,
  (index: number) => `9급 국어 ${index}회`,
];

export const createStressExams = (count: number): ExamPaper[] =>
  Array.from({ length: count }, (_, index) => {
    const title = PATTERNS[index % PATTERNS.length](index + 1);
    return {
      examId: `stress-${index + 1}`,
      title,
      year: 2026,
      coverKey: "large" as const,
      durationMs: 40 * 60 * 1000,
      questions: [
        {
          questionId: `stress-${index + 1}-q1`,
          prompt: `${title} 1번`,
          choices: [
            { choiceId: "1", label: "①" },
            { choiceId: "2", label: "②" },
            { choiceId: "3", label: "③" },
            { choiceId: "4", label: "④" },
            { choiceId: "5", label: "⑤" },
          ],
        },
      ],
    };
  });
