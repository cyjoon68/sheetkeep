import { useEffect } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";

import { ExamList, useExamList } from "@/features/list";
import { createSessionService } from "@/features/session";
import { useSheetKeep } from "@/providers";

const SheetListScreen = () => {
  const { catalog, sessionStore } = useSheetKeep();
  const { papers, loading, loadMore, decoder } = useExamList({ catalog });

  useEffect(() => {
    const service = createSessionService(sessionStore, () => Date.now());
    const restore = async () => {
      const inProgress = await service.loadLatestInProgress();
      if (inProgress) {
        router.replace(`/session/${inProgress.examId}`);
      }
    };
    void restore();
  }, [sessionStore]);

  return (
    <View style={styles.screen}>
      <View style={styles.heading}>
        <Text style={styles.kicker}>시험지</Text>
        <Text style={styles.title}>풀 시험지를 고르세요</Text>
        <Text style={styles.lede}>
          수능, 모의고사, 공무원 시험지를 고르면 제한 시간 안에 선지를 고르고 제출합니다.
        </Text>
      </View>
      <ExamList
        papers={papers}
        decoder={decoder}
        loading={loading}
        onOpen={(examId) => router.push(`/session/${examId}`)}
        onEndReached={() => {
          void loadMore();
        }}
      />
    </View>
  );
};

export default SheetListScreen;

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  heading: {
    gap: theme.gap(2),
    paddingHorizontal: theme.gap(5),
    paddingTop: theme.gap(4),
    paddingBottom: theme.gap(3),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  kicker: {
    color: theme.colors.stamp,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display,
    fontSize: 28,
    lineHeight: 36,
  },
  lede: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
}));
