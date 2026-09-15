import { useEffect, useState } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { TICK_MS } from "../constants";
import { formatRemainingClock, remainingMillis } from "../remaining-time";

type SessionTimerProps = {
  deadlineAt: number;
};

const SessionTimer = ({ deadlineAt }: SessionTimerProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, TICK_MS);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Text style={styles.timer}>{formatRemainingClock(remainingMillis(deadlineAt, now))}</Text>;
};

export default SessionTimer;

const styles = StyleSheet.create((theme) => ({
  timer: {
    color: theme.colors.timer,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 28,
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },
}));
