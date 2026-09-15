import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type SubmitButtonProps = {
  disabled: boolean;
  submitted: boolean;
  onPress: () => void;
};

const SubmitButton = ({ disabled, submitted, onPress }: SubmitButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={disabled ? styles.disabled : styles.enabled}
  >
    <Text style={styles.label}>{submitted ? "제출됨" : "제출"}</Text>
  </Pressable>
);

export default SubmitButton;

const styles = StyleSheet.create((theme) => ({
  enabled: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.navy,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  disabled: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.rule,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  label: {
    color: theme.colors.paper,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 17,
  },
}));
