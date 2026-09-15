import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { TAP_SLOP_PX } from "../constants";
import { isTapWithinSlop } from "../tap-slop";
import type { ExamPaper, Point } from "../types";
import ExamCover from "./exam-cover";

type ExamCardProps = {
  exam: ExamPaper;
  visible: boolean;
  onOpen: (examId: string) => void;
};

const ExamCard = ({ exam, visible, onOpen }: ExamCardProps) => {
  const origin = useRef<Point | null>(null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${exam.year} ${exam.title}`}
      onPressIn={(event) => {
        origin.current = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
      }}
      onPress={(event) => {
        if (!origin.current) {
          return;
        }
        const end = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
        if (!isTapWithinSlop(origin.current, end, TAP_SLOP_PX)) {
          return;
        }
        onOpen(exam.examId);
      }}
    >
      <View style={styles.card}>
        <ExamCover visible={visible} title={exam.title} />
        <View style={styles.meta}>
          <Text style={styles.year}>{exam.year}</Text>
          <Text style={styles.title}>{exam.title}</Text>
          <Text style={styles.hint}>시험지 표지 · 제한 시간 시험</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ExamCard;

const styles = StyleSheet.create((theme) => ({
  card: {
    minHeight: 132,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(4),
    paddingHorizontal: theme.gap(4),
    paddingVertical: theme.gap(3),
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  meta: {
    flex: 1,
    gap: theme.gap(1.5),
  },
  year: {
    alignSelf: "flex-start",
    color: theme.colors.navy,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display,
    fontSize: 20,
    lineHeight: 28,
  },
  hint: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 13,
  },
}));
