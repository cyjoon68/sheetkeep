jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
  })),
}));

jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return { Image: View };
});

jest.mock("react-native-unistyles", () => {
  const mockTheme = {
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
    gap: (mockValue: number) => mockValue * 4,
    fonts: {
      display: "System",
      body: "System",
      bodyBold: "System",
    },
    radii: {
      card: 18,
      stamp: 4,
      cover: 8,
    },
  };
  return {
    StyleSheet: {
      configure: jest.fn(),
      create: (mockStyles: unknown) =>
        typeof mockStyles === "function" ? mockStyles(mockTheme) : mockStyles,
    },
  };
});
