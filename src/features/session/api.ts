import * as SQLite from "expo-sqlite";

import { migrateSession } from "./migrate-session";
import type { ExamSession, SessionStorePort } from "./types";

type SessionRow = {
  exam_id: string;
  deadline_at: number;
  answers: string;
  ink_draft: string;
  schema_version: number;
  status: string;
  updated_at: number;
};

const rowToSession = (row: SessionRow): ExamSession =>
  migrateSession({
    examId: row.exam_id,
    deadlineAt: row.deadline_at,
    answers: JSON.parse(row.answers) as Record<string, string>,
    inkDraft: JSON.parse(row.ink_draft) as unknown,
    schemaVersion: row.schema_version,
    status: row.status,
  });

export const createSqliteSessionStore = async (
  databaseName = "sheetkeep.db",
): Promise<SessionStorePort> => {
  const db = await SQLite.openDatabaseAsync(databaseName);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      exam_id TEXT PRIMARY KEY NOT NULL,
      deadline_at INTEGER NOT NULL,
      answers TEXT NOT NULL,
      ink_draft TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      status TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  return {
    load: async (examId) => {
      const row = await db.getFirstAsync<SessionRow>(
        "SELECT exam_id, deadline_at, answers, ink_draft, schema_version, status, updated_at FROM sessions WHERE exam_id = ?",
        [examId],
      );
      return row ? rowToSession(row) : null;
    },
    upsert: async (session) => {
      await db.runAsync(
        `INSERT INTO sessions (exam_id, deadline_at, answers, ink_draft, schema_version, status, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(exam_id) DO UPDATE SET
           deadline_at = excluded.deadline_at,
           answers = excluded.answers,
           ink_draft = excluded.ink_draft,
           schema_version = excluded.schema_version,
           status = excluded.status,
           updated_at = excluded.updated_at`,
        [
          session.examId,
          session.deadlineAt,
          JSON.stringify(session.answers),
          JSON.stringify(session.inkDraft),
          session.schemaVersion,
          session.status,
          Date.now(),
        ],
      );
    },
    loadLatestInProgress: async () => {
      const row = await db.getFirstAsync<SessionRow>(
        "SELECT exam_id, deadline_at, answers, ink_draft, schema_version, status, updated_at FROM sessions WHERE status = ? ORDER BY updated_at DESC LIMIT 1",
        ["active"],
      );
      return row ? rowToSession(row) : null;
    },
  };
};
