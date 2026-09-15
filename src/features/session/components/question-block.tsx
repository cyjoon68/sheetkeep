import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { ExamQuestion } from "@/features/list";
import ChoiceButton from "./choice-button";

type QuestionBlockProps = {
  index: number;
  question: ExamQuestion;
  selectedChoiceId?: string;
  disabled: boolean;
  onChoice: (choiceId: string) => void;
};

const QuestionBlock = ({
  index,
  question,
  selectedChoiceId,
  disabled,
  onChoice,
}: QuestionBlockProps) => (
  <View style={styles.block}>
    <Text style={styles.number}>{index + 1}</Text>
    <Text style={styles.prompt} selectable>
      {question.prompt}
    </Text>
    <View style={styles.choices}>
      {question.choices.map((choice) => (
        <ChoiceButton
          key={choice.choiceId}
          label={`${choice.label}  ${choice.choiceId}번`}
          selected={selectedChoiceId === choice.choiceId}
          disabled={disabled}
          onPress={() => onChoice(choice.choiceId)}
        />
      ))}
    </View>
  </View>
);

export default QuestionBlock;

const styles = StyleSheet.create((theme) => ({
  block: {
    gap: theme.gap(3),
    paddingBottom: theme.gap(6),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  number: {
    alignSelf: "flex-start",
    color: theme.colors.paper,
    backgroundColor: theme.colors.navy,
    overflow: "hidden",
    borderRadius: theme.radii.stamp,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1),
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
  },
  prompt: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display,
    fontSize: 18,
    lineHeight: 28,
  },
  choices: {
    gap: theme.gap(2),
  },
}));
