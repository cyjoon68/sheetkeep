export type SessionStatus = "active" | "submitted";

export type SessionVariant = "restoring" | "active" | "submitted";

export type InkPoint = {
  x: number;
  y: number;
};

export type InkDraft = {
  strokes: InkPoint[][];
};

export type ExamSession = {
  examId: string;
  deadlineAt: number;
  answers: Record<string, string>;
  inkDraft: InkDraft;
  schemaVersion: number;
  status: SessionStatus;
};

export type SessionStorePort = {
  load: (examId: string) => Promise<ExamSession | null>;
  upsert: (session: ExamSession) => Promise<void>;
  loadLatestInProgress: () => Promise<ExamSession | null>;
};

export type SessionService = {
  startOrResume: (input: { examId: string; durationMs: number }) => Promise<ExamSession>;
  choose: (input: { examId: string; questionId: string; choiceId: string }) => Promise<ExamSession | null>;
  submit: (examId: string) => Promise<ExamSession | null>;
  loadLatestInProgress: () => Promise<ExamSession | null>;
};
