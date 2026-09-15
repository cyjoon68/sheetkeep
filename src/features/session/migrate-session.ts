import { SCHEMA_VERSION } from "./constants";
import type { ExamSession, InkDraft, SessionStatus } from "./types";

const emptyInkDraft = (): InkDraft => ({ strokes: [] });

const normalizeInkDraft = (value: unknown): InkDraft => {
  if (value && typeof value === "object" && Array.isArray((value as InkDraft).strokes)) {
    return value as InkDraft;
  }
  return emptyInkDraft();
};

const normalizeStatus = (value: unknown): SessionStatus =>
  value === "submitted" ? "submitted" : "active";

export const migrateSession = (raw: unknown): ExamSession => {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    examId: String(row.examId ?? ""),
    deadlineAt: Number(row.deadlineAt ?? 0),
    answers: (row.answers as Record<string, string>) ?? {},
    inkDraft: normalizeInkDraft(row.inkDraft),
    schemaVersion: SCHEMA_VERSION,
    status: normalizeStatus(row.status),
  };
};
