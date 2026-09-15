import "@/theme/unistyles";
import { useLocalSearchParams } from "expo-router";

import SessionScreen from "@/screens/session-screen";

const SessionRoute = () => {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  return <SessionScreen examId={String(examId ?? "")} />;
};

export default SessionRoute;
