import { Image } from "expo-image";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { COVER_HEIGHT, COVER_WIDTH } from "../constants";

const DEFAULT_COVER = require("../../../../fixtures/cover-normal.png");

type ExamCoverProps = {
  visible: boolean;
  title: string;
};

const ExamCover = ({ visible, title }: ExamCoverProps) => (
  <View style={styles.frame}>
    {visible ? (
      <Image source={DEFAULT_COVER} style={styles.image} contentFit="cover" accessibilityLabel={title} />
    ) : (
      <View style={styles.placeholder} />
    )}
  </View>
);

export default ExamCover;

const styles = StyleSheet.create((theme) => ({
  frame: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: theme.radii.cover,
    overflow: "hidden",
    backgroundColor: theme.colors.overlay,
    borderWidth: 1,
    borderColor: theme.colors.rule,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
}));
