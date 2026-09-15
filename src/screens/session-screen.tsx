import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { type ExamPaper } from "@/features/list";
import {
  canChoose,
  QuestionBlock,
  SessionTimer,
  sessionVariantTestId,
  SubmitButton,
  useExamSession,
} from "@/features/session";
import { useSheetKeep } from "@/providers";

type SessionScreenProps = {
  examId: string;
};

const SessionScreen = ({ examId }: SessionScreenProps) => {
  const { catalog, sessionStore } = useSheetKeep();
  const [exam, setExam] = useState<ExamPaper | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const paper = await catalog.getById(examId);
      if (!cancelled) {
        setExam(paper);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [catalog, examId]);

  const { session, variant, choose, submit } = useExamSession({
    examId,
    store: sessionStore,
    durationMs: exam?.durationMs ?? 0,
  });

  if (!exam || !session) {
    return (
      <View style={styles.screen} testID={sessionVariantTestId(variant)}>
        <Text style={styles.muted}>시험을 불러오는 중</Text>
      </View>
    );
  }

  const locked = !canChoose(variant);

  return (
    <View style={styles.screen} testID={sessionVariantTestId(variant)}>
      <View style={styles.header}>
        <Text style={styles.kicker}>{exam.year}</Text>
        <Text style={styles.title}>{exam.title}</Text>
        <SessionTimer deadlineAt={session.deadlineAt} />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        {exam.questions.map((question, index) => (
          <QuestionBlock
            key={question.questionId}
            index={index}
            question={question}
            selectedChoiceId={session.answers[question.questionId]}
            disabled={locked}
            onChoice={(choiceId) => {
              void choose(question.questionId, choiceId);
            }}
          />
        ))}
        <SubmitButton
          disabled={locked}
          submitted={session.status === "submitted"}
          onPress={() => {
            void submit();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  header: {
    gap: theme.gap(2),
    paddingHorizontal: theme.gap(5),
    paddingTop: theme.gap(3),
    paddingBottom: theme.gap(4),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  kicker: {
    color: theme.colors.navy,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display,
    fontSize: 24,
    lineHeight: 32,
  },
  muted: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    textAlign: "center",
    marginTop: theme.gap(10),
  },
  content: {
    paddingHorizontal: theme.gap(5),
    paddingTop: theme.gap(5),
    paddingBottom: theme.gap(10),
    gap: theme.gap(6),
  },
}));
