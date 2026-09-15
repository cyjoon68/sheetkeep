# SheetKeep

SheetKeep lets students pick a Korean exam paper and sit a timed session.

Open the app, choose a 수능, 모의고사, or 공무원 booklet, answer the items, and submit before the clock hits zero. If the app is closed before submit, the same exam, answers, and remaining time come back on the next launch.

## What it does

- Shows exam cards with title, year, and cover
- Starts a timed session from the card you pick
- Keeps answers while you work
- Locks the paper after submit
- Continues an unfinished exam after relaunch

## Default papers

The built-in catalog is 20 unique exams, including `2026 수능 국어 짝수형`, `6월 모의`, and `공무원 한국사`.

## Run

```bash
npm install
npm start
```

```bash
npm test
```

## Dev client

The session store uses `expo-sqlite` and styling uses `react-native-unistyles`, so the app needs a development build, not Expo Go. `expo-dev-client` is installed and the `development` profile in `eas.json` produces it.

```bash
npx eas build --profile development --platform ios
npx expo start --dev-client
```

## New Architecture

`expo.newArchEnabled` is `true` for iOS and Android, so dev, preview, and production builds all run on the New Architecture (Fabric + TurboModules).

## EAS Update

`runtimeVersion` uses the `appVersion` policy and each build profile in `eas.json` sets a `channel` (`development`, `preview`, `production`), so JS-only changes can ship over the air to the same binary.

One real use: fix catalog titles or cover copy — e.g. retitle `6월 모의` or correct an exam year — and push it to store builds without resubmitting.

```bash
npx eas update --channel production --message "fix catalog titles"
```

## Stack

Expo Router, React Native, TypeScript, SQLite, Jest.
