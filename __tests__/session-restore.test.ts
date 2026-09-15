import sessionContract from "../contracts/session-restore.json";
import { createMemorySessionStore } from "./helpers/memory-session-store";
import {
  applyChoice,
  createSession,
  createSessionService,
  migrateSession,
  remainingMillis,
  sessionVariant,
  sessionVariantTestId,
  submitSession,
} from "@/features/session";

describe("session restore", () => {
  const now = 1_700_000_000_000;
  const durationMs = 50 * 60 * 1000;

  test("relaunch before submit continues the same exam, answers, and remaining time", async () => {
    const store = createMemorySessionStore();
    const clock = { now };
    const service = createSessionService(store, () => clock.now);
    const first = await service.startOrResume({
      examId: "suneung-2026-korean-even",
      durationMs,
    });
    await service.choose({
      examId: first.examId,
      questionId: "q1",
      choiceId: "2",
    });
    clock.now += 90_000;

    const restored = await service.startOrResume({
      examId: "suneung-2026-korean-even",
      durationMs,
    });

    expect(restored.examId).toBe(first.examId);
    expect(restored.answers).toEqual({ q1: "2" });
    expect(restored.inkDraft).toEqual(first.inkDraft);
    expect(restored.deadlineAt).toBe(first.deadlineAt);
    expect(
      Math.abs(remainingMillis(restored.deadlineAt, clock.now) - (durationMs - 90_000)),
    ).toBeLessThanOrEqual(sessionContract.timeErrorMsMax);
  });

  test("restoring variant blocks onChoice", () => {
    const session = createSession({ examId: "exam-1", now, durationMs });
    const variant = sessionVariant({ restoring: true, session });
    const blocked = applyChoice({
      session,
      variant,
      questionId: "q1",
      choiceId: "1",
    });

    expect(variant).toBe("restoring");
    expect(sessionVariantTestId(variant)).toBe("session-variant-restoring");
    expect(blocked).toBeNull();
    expect(session.answers).toEqual({});
  });

  test("submitted sessions reject answer writes", async () => {
    const store = createMemorySessionStore();
    const service = createSessionService(store, () => now);
    const session = await service.startOrResume({ examId: "exam-1", durationMs });
    await service.choose({ examId: session.examId, questionId: "q1", choiceId: "4" });
    await service.submit(session.examId);

    const afterSubmit = await service.choose({
      examId: session.examId,
      questionId: "q1",
      choiceId: "1",
    });
    const loaded = await store.load("exam-1");

    expect(afterSubmit).toBeNull();
    expect(loaded?.status).toBe("submitted");
    expect(loaded?.answers).toEqual({ q1: "4" });
    expect(sessionVariant({ restoring: false, session: loaded })).toBe("submitted");
    expect(submitSession(loaded!, "submitted")).toBeNull();
  });

  test("migrates v1 string inkDraft to v2 strokes", () => {
    const migrated = migrateSession({
      examId: "exam-1",
      deadlineAt: now + durationMs,
      answers: { q1: "2" },
      inkDraft: "",
      schemaVersion: 1,
      status: "active",
    });

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.inkDraft).toEqual({ strokes: [] });
    expect(migrated.answers).toEqual({ q1: "2" });
  });
});
