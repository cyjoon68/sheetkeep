import { useCallback, useState } from "react";
import { LegendList, type ViewToken } from "@legendapp/list/react-native";
import { StyleSheet } from "react-native-unistyles";

import { EXAM_CARD_HEIGHT, VIEWABILITY_ITEM_PERCENT } from "../constants";
import type { CoverDecoder, ExamPaper } from "../types";
import ExamCard from "./exam-card";
import ListLoadingFooter from "./list-loading-footer";

type ExamListProps = {
  papers: ExamPaper[];
  decoder: CoverDecoder;
  loading: boolean;
  onOpen: (examId: string) => void;
  onEndReached: () => void;
};

const viewabilityConfig = {
  itemVisiblePercentThreshold: VIEWABILITY_ITEM_PERCENT,
};

const ExamList = ({ papers, decoder, loading, onOpen, onEndReached }: ExamListProps) => {
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  const renderItem = useCallback(
    ({ item }: { item: ExamPaper }) => (
      <ExamCard exam={item} visible={visibleIds.includes(item.examId)} onOpen={onOpen} />
    ),
    [onOpen, visibleIds],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<ExamPaper>[] }) => {
      const nextIds = viewableItems
        .filter((token) => token.isViewable)
        .map((token) => token.item.examId);
      decoder.syncVisible(nextIds);
      setVisibleIds(nextIds);
    },
    [decoder],
  );

  return (
    <LegendList
      data={papers}
      recycleItems
      keyExtractor={(item) => item.examId}
      estimatedItemSize={EXAM_CARD_HEIGHT}
      getFixedItemSize={() => EXAM_CARD_HEIGHT}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      maintainVisibleContentPosition
      contentInsetAdjustmentBehavior="automatic"
      ListFooterComponent={loading ? ListLoadingFooter : null}
      style={styles.list}
    />
  );
};

export default ExamList;

const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
}));
