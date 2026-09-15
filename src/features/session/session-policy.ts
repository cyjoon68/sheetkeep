import { SCHEMA_VERSION } from "./constants";
import type { ExamSession, SessionVariant } from "./types";

export const createSession = (input: {
  examId: string;
  now: number;
  durationMs: number;
}): ExamSession => ({
  examId: input.examId,
  deadlineAt: input.now + input.durationMs,
  answers: {},
  inkDraft: { strokes: [] },
  schemaVersion: SCHEMA_VERSION,
  status: "active",
});

export const sessionVariant = (input: {
  restoring: boolean;
  session: ExamSession | null;
}): SessionVariant => {
  if (input.restoring) {
    return "restoring";
  }
  if (input.session?.status === "submitted") {
    return "submitted";
  }
  return "active";
};

export const sessionVariantTestId = (variant: SessionVariant): string =>
  `session-variant-${variant}`;

export const canChoose = (variant: SessionVariant): boolean => variant === "active";

export const applyChoice = (input: {
  session: ExamSession;
  variant: SessionVariant;
  questionId: string;
  choiceId: string;
}): ExamSession | null => {
  if (!canChoose(input.variant) || input.session.status !== "active") {
    return null;
  }
  return {
    ...input.session,
    answers: {
      ...input.session.answers,
      [input.questionId]: input.choiceId,
    },
  };
};

export const submitSession = (
  session: ExamSession,
  variant: SessionVariant,
): ExamSession | null => {
  if (!canChoose(variant) || session.status !== "active") {
    return null;
  }
  return {
    ...session,
    status: "submitted",
  };
};
