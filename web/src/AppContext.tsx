import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultGoFlowState,
  type FileOpenState,
  type GoFlowScreen,
  type GoFlowState,
  type HeatScreen,
  type MsgBoxState,
  type PrepScreen,
  type ProgramId,
  type WellScreen,
} from "./types";

interface AppContextValue {
  activeProgram: ProgramId | null;
  launchProgram: (id: ProgramId) => void;
  closeProgram: () => void;
  goScreen: GoFlowScreen;
  setGoScreen: (s: GoFlowScreen) => void;
  prepScreen: PrepScreen;
  setPrepScreen: (s: PrepScreen) => void;
  heatScreen: HeatScreen;
  setHeatScreen: (s: HeatScreen) => void;
  wellScreen: WellScreen;
  setWellScreen: (s: WellScreen) => void;
  go: GoFlowState;
  setGo: React.Dispatch<React.SetStateAction<GoFlowState>>;
  patchGo: (patch: Partial<GoFlowState>) => void;
  msgBox: MsgBoxState | null;
  showMsgBox: (
    opts: Omit<MsgBoxState, "resolve">
  ) => Promise<"ok" | "cancel">;
  fileOpen: FileOpenState | null;
  showFileOpen: (
    opts: Omit<FileOpenState, "resolve">
  ) => Promise<string | null>;
  prepComps: string;
  setPrepComps: (v: string) => void;
  prepUserComps: string;
  setPrepUserComps: (v: string) => void;
  heatOhtc: string | null;
  setHeatOhtc: (v: string | null) => void;
  wellPi: string | null;
  setWellPi: (v: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeProgram, setActiveProgram] = useState<ProgramId | null>(null);
  const [goScreen, setGoScreen] = useState<GoFlowScreen>("splash");
  const [prepScreen, setPrepScreen] = useState<PrepScreen>("splash");
  const [heatScreen, setHeatScreen] = useState<HeatScreen>("splash");
  const [wellScreen, setWellScreen] = useState<WellScreen>("splash");
  const [go, setGo] = useState<GoFlowState>(defaultGoFlowState);
  const [msgBox, setMsgBox] = useState<MsgBoxState | null>(null);
  const [fileOpen, setFileOpen] = useState<FileOpenState | null>(null);
  const [prepComps, setPrepComps] = useState("15");
  const [prepUserComps, setPrepUserComps] = useState("1");
  const [heatOhtc, setHeatOhtc] = useState<string | null>(null);
  const [wellPi, setWellPi] = useState<string | null>(null);

  const launchProgram = useCallback((id: ProgramId) => {
    setActiveProgram(id);
    setGo(defaultGoFlowState());
    setHeatOhtc(null);
    setWellPi(null);
    if (id === "goflow") setGoScreen("splash");
    if (id === "prepflow") setPrepScreen("splash");
    if (id === "heatflow") setHeatScreen("splash");
    if (id === "wellflow") setWellScreen("splash");
  }, []);

  const closeProgram = useCallback(() => {
    setActiveProgram(null);
  }, []);

  const patchGo = useCallback((patch: Partial<GoFlowState>) => {
    setGo((prev) => ({ ...prev, ...patch }));
  }, []);

  const showMsgBox = useCallback(
    (opts: Omit<MsgBoxState, "resolve">) =>
      new Promise<"ok" | "cancel">((resolve) => {
        setMsgBox({
          ...opts,
          resolve: (result) => {
            setMsgBox(null);
            resolve(result);
          },
        });
      }),
    []
  );

  const showFileOpen = useCallback(
    (opts: Omit<FileOpenState, "resolve">) =>
      new Promise<string | null>((resolve) => {
        setFileOpen({
          ...opts,
          resolve: (name) => {
            setFileOpen(null);
            resolve(name);
          },
        });
      }),
    []
  );

  const value = useMemo(
    () => ({
      activeProgram,
      launchProgram,
      closeProgram,
      goScreen,
      setGoScreen,
      prepScreen,
      setPrepScreen,
      heatScreen,
      setHeatScreen,
      wellScreen,
      setWellScreen,
      go,
      setGo,
      patchGo,
      msgBox,
      showMsgBox,
      fileOpen,
      showFileOpen,
      prepComps,
      setPrepComps,
      prepUserComps,
      setPrepUserComps,
      heatOhtc,
      setHeatOhtc,
      wellPi,
      setWellPi,
    }),
    [
      activeProgram,
      launchProgram,
      closeProgram,
      goScreen,
      prepScreen,
      heatScreen,
      wellScreen,
      go,
      patchGo,
      msgBox,
      showMsgBox,
      fileOpen,
      showFileOpen,
      prepComps,
      prepUserComps,
      heatOhtc,
      wellPi,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
