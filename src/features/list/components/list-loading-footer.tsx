import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const ListLoadingFooter = () => (
  <View style={styles.footer}>
    <Text style={styles.text}>다음 시험지를 찾는 중</Text>
  </View>
);

export default ListLoadingFooter;

const styles = StyleSheet.create((theme) => ({
  footer: {
    paddingVertical: theme.gap(4),
    alignItems: "center",
  },
  text: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 13,
  },
}));
