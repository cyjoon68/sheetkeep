import type { ExamSession, SessionStorePort } from "@/features/session";

export const createMemorySessionStore = (): SessionStorePort => {
  const rows = new Map<string, ExamSession>();
  const order: string[] = [];

  return {
    load: async (examId) => rows.get(examId) ?? null,
    upsert: async (session) => {
      rows.set(session.examId, {
        ...session,
        answers: { ...session.answers },
        inkDraft: { strokes: session.inkDraft.strokes.map((stroke) => stroke.map((point) => ({ ...point }))) },
      });
      const next = order.filter((id) => id !== session.examId);
      next.push(session.examId);
      order.splice(0, order.length, ...next);
    },
    loadLatestInProgress: async () => {
      for (let index = order.length - 1; index >= 0; index -= 1) {
        const session = rows.get(order[index]);
        if (session && session.status === "active") {
          return session;
        }
      }
      return null;
    },
  };
};
