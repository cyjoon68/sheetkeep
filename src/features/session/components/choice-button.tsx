import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ChoiceButtonProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

const ChoiceButton = ({ label, selected, disabled, onPress }: ChoiceButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected, disabled }}
    disabled={disabled}
    onPress={onPress}
    style={selected ? styles.selected : styles.idle}
  >
    <Text style={selected ? styles.selectedLabel : styles.idleLabel}>{label}</Text>
  </Pressable>
);

export default ChoiceButton;

const styles = StyleSheet.create((theme) => ({
  idle: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: theme.gap(4),
    backgroundColor: theme.colors.choice,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.navy,
    borderCurve: "continuous",
  },
  selected: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: theme.gap(4),
    backgroundColor: theme.colors.choiceOn,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.stamp,
    borderCurve: "continuous",
  },
  idleLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 17,
  },
  selectedLabel: {
    color: theme.colors.choiceOnText,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 17,
  },
}));
