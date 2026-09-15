# SheetKeep

시험지를 고르고 제한 시간 안에 푼다. 제출 전에 앱을 꺼도 같은 시험, 같은 답, 남은 시간이 돌아온다.

Expo SDK 57, React Native 0.86, SQLite, New Architecture.

![시험지 목록](docs/screenshots/catalog.png)

![시험 세션](docs/screenshots/session.png)

| 문제 | SheetKeep |
| --- | --- |
| 앱을 나갔다 오면 타이머가 리셋됨 | SQLite `deadlineAt` |
| 복원 중 빈 시험이 답을 덮음 | `restoring`이면 `onChoice` 차단 |
| 목록이 모든 행을 마운트 | LegendList `recycleItems`, 키 `examId` |
| 중복 id 페이지에서 목록이 멈춤 | 본 id는 건너뛰고 다음 페이지 |
| 화면 밖 표지까지 decode | 보이는 행만 |

```bash
npm install
npm test
npx expo start --dev-client
```
