import { useCallback, useEffect, useMemo, useState } from "react";

import { canChoose, sessionVariant } from "./session-policy";
import { createSessionService } from "./session-service";
import type { ExamSession, SessionStorePort, SessionVariant } from "./types";

export const useExamSession = ({
  examId,
  store,
  durationMs,
  now = () => Date.now(),
}: {
  examId: string;
  store: SessionStorePort;
  durationMs: number;
  now?: () => number;
}): {
  session: ExamSession | null;
  variant: SessionVariant;
  choose: (questionId: string, choiceId: string) => Promise<void>;
  submit: () => Promise<void>;
} => {
  const service = useMemo(() => createSessionService(store, now), [now, store]);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    if (durationMs <= 0) {
      return;
    }
    let cancelled = false;
    setRestoring(true);
    const boot = async () => {
      const next = await service.startOrResume({
        examId,
        durationMs,
      });
      if (cancelled) {
        return;
      }
      setSession(next);
      setRestoring(false);
    };
    void boot();
    return () => {
      cancelled = true;
    };
  }, [durationMs, examId, service]);

  const variant = sessionVariant({ restoring, session });

  const choose = useCallback(
    async (questionId: string, choiceId: string) => {
      if (!canChoose(variant)) {
        return;
      }
      const next = await service.choose({ examId, questionId, choiceId });
      if (next) {
        setSession(next);
      }
    },
    [examId, service, variant],
  );

  const submit = useCallback(async () => {
    if (!canChoose(variant)) {
      return;
    }
    const next = await service.submit(examId);
    if (next) {
      setSession(next);
    }
  }, [examId, service, variant]);

  return {
    session,
    variant,
    choose,
    submit,
  };
};
