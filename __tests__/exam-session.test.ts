import sessionContract from "../contracts/session-restore.json";
import {
  applyChoice,
  createSession,
  remainingMillis,
  sessionVariant,
  submitSession,
} from "@/features/session";

describe("timed exam session", () => {
  const now = 1_700_000_000_000;
  const durationMs = 80 * 60 * 1000;

  test("starts with a wall-clock deadline instead of elapsed state", () => {
    const session = createSession({
      examId: "suneung-2026-korean-even",
      now,
      durationMs,
    });

    expect(session.examId).toBe("suneung-2026-korean-even");
    expect(session.deadlineAt).toBe(now + durationMs);
    expect(session.answers).toEqual({});
    expect(session.status).toBe("active");
    expect(session.schemaVersion).toBe(sessionContract.schemaVersion);
    expect(Object.keys(session)).toEqual(expect.arrayContaining(sessionContract.fields));
  });

  test("remaining time comes from deadlineAt minus now", () => {
    const session = createSession({
      examId: "exam-1",
      now,
      durationMs,
    });
    const elapsed = 12_500;

    expect(remainingMillis(session.deadlineAt, now + elapsed)).toBe(durationMs - elapsed);
    expect(remainingMillis(session.deadlineAt, session.deadlineAt + 4000)).toBe(0);
  });

  test("records a choice and submits the paper", () => {
    const started = createSession({
      examId: "exam-1",
      now,
      durationMs,
    });
    const answered = applyChoice({
      session: started,
      variant: sessionVariant({ restoring: false, session: started }),
      questionId: "q1",
      choiceId: "3",
    });

    expect(answered?.answers).toEqual({ q1: "3" });

    const submitted = submitSession(
      answered!,
      sessionVariant({ restoring: false, session: answered! }),
    );

    expect(submitted?.status).toBe("submitted");
    expect(submitted?.answers).toEqual({ q1: "3" });
  });
});
