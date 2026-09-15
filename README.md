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

Use a development build. The local session store uses SQLite.

```bash
npm test
```

## Stack

Expo Router, React Native, TypeScript, SQLite, Jest.
