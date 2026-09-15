import "@/theme/unistyles";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { createSheetServer, type ExamCatalogPort } from "@/features/list";
import { createSqliteSessionStore, type SessionStorePort } from "@/features/session";

type SheetKeepRuntime = {
  catalog: ExamCatalogPort;
  sessionStore: SessionStorePort;
};

const SheetKeepContext = createContext<SheetKeepRuntime | null>(null);

type SheetKeepProviderProps = {
  children: ReactNode;
  catalog?: ExamCatalogPort;
  sessionStore?: SessionStorePort;
};

const SheetKeepProvider = ({ children, catalog, sessionStore }: SheetKeepProviderProps) => {
  const defaultCatalog = useMemo(() => catalog ?? createSheetServer(), [catalog]);
  const [store, setStore] = useState<SessionStorePort | null>(sessionStore ?? null);

  useEffect(() => {
    if (sessionStore) {
      setStore(sessionStore);
      return;
    }
    let cancelled = false;
    const open = async () => {
      const next = await createSqliteSessionStore();
      if (!cancelled) {
        setStore(next);
      }
    };
    void open();
    return () => {
      cancelled = true;
    };
  }, [sessionStore]);

  if (!store) {
    return (
      <View style={styles.boot} testID="session-variant-restoring">
        <Text style={styles.bootText}>시험지를 펼치는 중</Text>
      </View>
    );
  }

  return (
    <SheetKeepContext.Provider value={{ catalog: defaultCatalog, sessionStore: store }}>
      {children}
    </SheetKeepContext.Provider>
  );
};

export const useSheetKeep = (): SheetKeepRuntime => {
  const value = useContext(SheetKeepContext);
  if (!value) {
    throw new Error("SheetKeepProvider is required");
  }
  return value;
};

export default SheetKeepProvider;

const styles = StyleSheet.create((theme) => ({
  boot: {
    flex: 1,
    backgroundColor: theme.colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  bootText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 16,
  },
}));
