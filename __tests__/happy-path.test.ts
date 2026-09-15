import { createDefaultExams } from "@/features/list";
import { createSessionService } from "@/features/session";
import { createMemorySessionStore } from "./helpers/memory-session-store";

describe("happy path", () => {
  test("pick an exam, answer, and submit", async () => {
    const exam = createDefaultExams()[0];
    const store = createMemorySessionStore();
    const service = createSessionService(store, () => 1_700_000_000_000);
    const session = await service.startOrResume({
      examId: exam.examId,
      durationMs: exam.durationMs,
    });
    const question = exam.questions[0];
    const chosen = await service.choose({
      examId: session.examId,
      questionId: question.questionId,
      choiceId: question.choices[2].choiceId,
    });
    const submitted = await service.submit(session.examId);

    expect(session.examId).toBe(exam.examId);
    expect(chosen?.answers[question.questionId]).toBe(question.choices[2].choiceId);
    expect(submitted?.status).toBe("submitted");
  });

  test("relaunch before submit continues the same in-progress exam", async () => {
    const exam = createDefaultExams()[3];
    const store = createMemorySessionStore();
    const clock = { now: 1_700_000_000_000 };
    const service = createSessionService(store, () => clock.now);
    await service.startOrResume({ examId: exam.examId, durationMs: exam.durationMs });
    await service.choose({
      examId: exam.examId,
      questionId: exam.questions[0].questionId,
      choiceId: exam.questions[0].choices[0].choiceId,
    });

    const relaunched = createSessionService(store, () => clock.now + 4_000);
    const continued = await relaunched.loadLatestInProgress();

    expect(continued?.examId).toBe(exam.examId);
    expect(continued?.answers[exam.questions[0].questionId]).toBe(
      exam.questions[0].choices[0].choiceId,
    );
    expect(continued?.status).toBe("active");
  });
});
