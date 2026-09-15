<p align="center">
  <img src="assets/images/icon.png" alt="SheetKeep" width="96">
</p>

<p align="center">
  <strong>Pick a Korean exam paper, sit a timed session, come back to the same clock.</strong>
</p>

<p align="center">
  <a href="https://docs.expo.dev/versions/v57.0.0"><img src="https://img.shields.io/badge/Expo-57-000020?logo=expo" alt="Expo 57"></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react" alt="React Native 0.86"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"></a>
  <img src="https://img.shields.io/badge/New%20Architecture-enabled-22c55e" alt="New Architecture enabled">
  <img src="https://img.shields.io/badge/tests-22%20passing-22c55e" alt="22 tests passing">
</p>

---

**SheetKeep** is an Expo app for choosing a booklet and sitting it under a timer. Open the catalog, pick 수능, 모의고사, or 공무원, answer, submit. Close the app before submit and the same paper, answers, and remaining time come back.

Built with Expo SDK 57, React Native 0.86, SQLite, and the New Architecture. A development client is required.

## Why SheetKeep?

Exam catalogs fail when the list is large, pages repeat ids, or the process dies mid-session. SheetKeep keeps those cases in tests. The default app is twenty unique papers.

| Problem | Common approach | SheetKeep |
| --- | --- | --- |
| Timer resets after a phone call | elapsed state in memory | `deadlineAt` wall clock in SQLite |
| Restore paints an empty paper over saved answers | write as soon as the screen mounts | `restoring` variant blocks `onChoice` |
| Catalog mounts every row | `ScrollView` / `FlatList` without a window | LegendList `recycleItems`, key `examId` |
| Duplicate page ids look like the end of the list | stop when length does not grow | skip seen ids, fetch next page (budget 5) |
| Covers decode off-screen | one image per row, always | decode only visible rows |
| Card press fires while scrolling | parent scroll wins | tap slop on the card |

200-row catalogs, duplicate-only pages, and huge covers exist only in tests.

## Features

- **Catalog** — twenty unique papers, including `2026 수능 국어 짝수형`, `6월 모의`, `공무원 한국사`
- **Timed session** — remaining time, choices, submit
- **Restore** — same install, same `examId`, answers and ink draft
- **LegendList window** — visible cards only; not a list-library demo
- **New Architecture** — `expo.newArchEnabled` is true for iOS and Android
- **EAS Update** — catalog title or cover copy on the same binary

## Quick Start

> [!IMPORTANT]
> SheetKeep needs a development build, not Expo Go. `expo-sqlite` and `react-native-unistyles` do not run in Expo Go.

```bash
npm install
npm test
npx eas build --profile development --platform ios
npx expo start --dev-client
```

## How It Works

```
Catalog                         Session
+------------------+            +------------------+
| paper cards      |  tap       | remaining time   |
| title / year     | ---------> | choices          |
| cover            |            | [Submit]         |
+------------------+            +------------------+
        |                                |
        |  SQLite session                |  restoring gate
        +--------------------------------+
```

`src/app` is Expo Router. `src/screens/sheet-list-screen.tsx` and `session-screen.tsx` compose the two screens. Session persistence lives in `src/features/session`. The catalog list lives in `src/features/list`.

## Tablet runtime

`ios.supportsTablet` is on. `eas.json` maps `development`, `preview`, and `production` to EAS Update channels (`@cyjoon/sheetkeep`).

JS-only example: retitle `6월 모의` or fix a year, then:

```bash
npx eas update --channel production --message "fix catalog titles"
```

Devices on that channel pick it up on next launch. Native changes still need `eas build`.

## System Requirements

- Node.js 20+
- Expo SDK 57 / React Native 0.86
- iOS Simulator or Android emulator
- EAS account for cloud builds

## Building from Source

```bash
npm install
npm test
npx expo start --dev-client
```

## GitHub extras

Suggested topics: `expo`, `react-native`, `sqlite`, `eas-update`, `new-architecture`, `typescript`.

Social preview: a catalog of Korean exam cards on the left, a timer session on the right.
