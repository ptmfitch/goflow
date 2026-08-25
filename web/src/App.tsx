import { useCallback } from "react";
import { AppProvider, useApp } from "./AppContext";
import { Desktop } from "./components/Desktop";
import { MsgBox, FileOpenDialog } from "./components/Dialogs";
import { Splash, WorkingDialog } from "./components/Splash";
import { GoFlowSetup } from "./programs/GoFlowSetup";
import { SectionGeometry } from "./programs/SectionGeometry";
import { PipeDims, ElevationPairs } from "./programs/PipeAndElevation";
import { OilFlow, GasFlow, Sensitivity } from "./programs/FluidInputs";
import {
  PrintOptions,
  PreviewResults,
  GraphPicker,
  GraphTypes,
  GraphView,
  ProgramSelect,
} from "./programs/PrintAndGraph";
import { PrepFlowApp } from "./programs/PrepFlow";
import { HeatFlowApp } from "./programs/HeatFlow";
import { WellFlowApp } from "./programs/WellFlow";
import "./styles/win95.css";

function GoFlowApp() {
  const { goScreen, setGoScreen } = useApp();

  const finishSplash = useCallback(() => setGoScreen("setup"), [setGoScreen]);

  switch (goScreen) {
    case "splash":
      return <Splash title="Goflow 6.0" onDone={finishSplash} />;
    case "setup":
      return <GoFlowSetup />;
    case "section1":
      return <SectionGeometry section={1} />;
    case "section2":
      return <SectionGeometry section={2} />;
    case "pipeDims":
      return <PipeDims />;
    case "elevation":
      return <ElevationPairs />;
    case "oilFlow":
      return <OilFlow />;
    case "gasFlow":
      return <GasFlow />;
    case "sensitivity":
      return <Sensitivity />;
    case "working":
      return <WorkingDialog />;
    case "printOptions":
      return <PrintOptions />;
    case "preview":
      return <PreviewResults />;
    case "graphPicker":
      return <GraphPicker />;
    case "graphTypes":
      return <GraphTypes />;
    case "graphView":
      return <GraphView />;
    case "programSelect":
      return <ProgramSelect />;
    default: {
      const _exhaustive: never = goScreen;
      return _exhaustive;
    }
  }
}

function ActiveProgram() {
  const { activeProgram } = useApp();
  if (!activeProgram) return null;
  if (activeProgram === "goflow") return <GoFlowApp />;
  if (activeProgram === "prepflow") return <PrepFlowApp />;
  if (activeProgram === "heatflow") return <HeatFlowApp />;
  if (activeProgram === "wellflow") return <WellFlowApp />;
  const _exhaustive: never = activeProgram;
  return _exhaustive;
}

function Shell() {
  return (
    <>
      <Desktop />
      <ActiveProgram />
      <MsgBox />
      <FileOpenDialog />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
