import {
  CHOICE_LABELS,
  CIVIL_DURATION_MS,
  MOCK_DURATION_MS,
  QUESTION_COUNT,
  SUNEUNG_DURATION_MS,
} from "./constants";
import type { ExamChoice, ExamPaper, ExamQuestion } from "./types";

const CHOICES: ExamChoice[] = CHOICE_LABELS.map((label, index) => ({
  choiceId: String(index + 1),
  label,
}));

type ExamSeed = {
  examId: string;
  title: string;
  year: number;
  durationMs: number;
};

const EXAM_SEEDS: ExamSeed[] = [
  { examId: "suneung-2026-korean-even", title: "2026 수능 국어 짝수형", year: 2026, durationMs: SUNEUNG_DURATION_MS },
  { examId: "suneung-2026-korean-odd", title: "2026 수능 국어 홀수형", year: 2026, durationMs: SUNEUNG_DURATION_MS },
  { examId: "suneung-2026-math-even", title: "2026 수능 수학 짝수형", year: 2026, durationMs: SUNEUNG_DURATION_MS },
  { examId: "suneung-2026-english-even", title: "2026 수능 영어 짝수형", year: 2026, durationMs: SUNEUNG_DURATION_MS },
  { examId: "suneung-2026-history", title: "2026 수능 한국사", year: 2026, durationMs: SUNEUNG_DURATION_MS },
  { examId: "mock-2026-june-korean", title: "2026 6월 모의 국어", year: 2026, durationMs: MOCK_DURATION_MS },
  { examId: "mock-2026-june-math", title: "2026 6월 모의 수학", year: 2026, durationMs: MOCK_DURATION_MS },
  { examId: "mock-2026-june-english", title: "2026 6월 모의 영어", year: 2026, durationMs: MOCK_DURATION_MS },
  { examId: "mock-2026-sept-korean", title: "2026 9월 모의 국어", year: 2026, durationMs: MOCK_DURATION_MS },
  { examId: "mock-2026-sept-history", title: "2026 9월 모의 한국사", year: 2026, durationMs: MOCK_DURATION_MS },
  { examId: "suneung-2025-korean-even", title: "2025 수능 국어 짝수형", year: 2025, durationMs: SUNEUNG_DURATION_MS },
  { examId: "suneung-2025-math-odd", title: "2025 수능 수학 홀수형", year: 2025, durationMs: SUNEUNG_DURATION_MS },
  { examId: "mock-2025-june-korean", title: "2025 6월 모의 국어", year: 2025, durationMs: MOCK_DURATION_MS },
  { examId: "civil-history", title: "공무원 한국사", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "civil-korean", title: "공무원 국어", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "civil-english", title: "공무원 영어", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "grade7-history", title: "7급 한국사", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "grade9-admin-law", title: "9급 행정법", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "police-history", title: "경찰 한국사", year: 2026, durationMs: CIVIL_DURATION_MS },
  { examId: "fire-intro", title: "소방 소방학개론", year: 2026, durationMs: CIVIL_DURATION_MS },
];

const questionsFor = (examId: string, title: string): ExamQuestion[] =>
  Array.from({ length: QUESTION_COUNT }, (_, index) => ({
    questionId: `${examId}-q${index + 1}`,
    prompt: `${title} ${index + 1}번. 다음 중 알맞은 것을 고르시오.`,
    choices: CHOICES,
  }));

export const createDefaultExams = (): ExamPaper[] =>
  EXAM_SEEDS.map((seed) => ({
    ...seed,
    coverKey: "normal",
    questions: questionsFor(seed.examId, seed.title),
  }));
