import { applyChoice, createSession, sessionVariant, submitSession } from "./session-policy";
import type { ExamSession, SessionService, SessionStorePort } from "./types";

export const createSessionService = (
  store: SessionStorePort,
  now: () => number,
): SessionService => {
  const restoringByExam = new Map<string, boolean>();

  const variantFor = (examId: string, session: ExamSession | null) =>
    sessionVariant({
      restoring: restoringByExam.get(examId) ?? false,
      session,
    });

  return {
    startOrResume: async ({ examId, durationMs }) => {
      restoringByExam.set(examId, true);
      const existing = await store.load(examId);
      if (existing) {
        restoringByExam.set(examId, false);
        return existing;
      }
      const session = createSession({
        examId,
        now: now(),
        durationMs,
      });
      await store.upsert(session);
      restoringByExam.set(examId, false);
      return session;
    },
    choose: async ({ examId, questionId, choiceId }) => {
      const session = await store.load(examId);
      if (!session) {
        return null;
      }
      const next = applyChoice({
        session,
        variant: variantFor(examId, session),
        questionId,
        choiceId,
      });
      if (!next) {
        return null;
      }
      await store.upsert(next);
      return next;
    },
    submit: async (examId) => {
      const session = await store.load(examId);
      if (!session) {
        return null;
      }
      const next = submitSession(session, variantFor(examId, session));
      if (!next) {
        return null;
      }
      await store.upsert(next);
      return next;
    },
    loadLatestInProgress: () => store.loadLatestInProgress(),
  };
};
