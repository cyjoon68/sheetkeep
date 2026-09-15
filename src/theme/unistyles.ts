import { StyleSheet } from "react-native-unistyles";

const paperTheme = {
  colors: {
    paper: "#F3EBDD",
    ink: "#1A1612",
    rule: "#C9BBA3",
    navy: "#1E3A5F",
    stamp: "#C4563A",
    card: "#FBF6EC",
    choice: "#F7F1E6",
    choiceOn: "#1E3A5F",
    choiceOnText: "#F3EBDD",
    muted: "#7A7166",
    timer: "#C4563A",
    overlay: "#E7DCC8",
  },
  gap: (value: number) => value * 4,
  fonts: {
    display: "NotoSerifKR_700Bold",
    body: "IBMPlexSansKR_400Regular",
    bodyBold: "IBMPlexSansKR_600SemiBold",
  },
  radii: {
    card: 18,
    stamp: 4,
    cover: 8,
  },
};

const breakpoints = {
  xs: 0,
  sm: 380,
  md: 768,
};

const appThemes = {
  paper: paperTheme,
};

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    initialTheme: "paper",
  },
});
