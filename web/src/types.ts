export type ProgramId = "goflow" | "prepflow" | "heatflow" | "wellflow";

export type FluidType = "gas" | "oil" | "condensate";
export type StreamComp = "black" | "flash";
export type Eos = "rks" | "pr" | "bwr";
export type ControllingParam = "flowrate" | "inletPressure";
export type Correlation =
  | "ork"
  | "bb"
  | "bj"
  | "dukler"
  | "hb"
  | "dr"
  | "none";

export type GoFlowScreen =
  | "splash"
  | "setup"
  | "section1"
  | "section2"
  | "pipeDims"
  | "elevation"
  | "oilFlow"
  | "gasFlow"
  | "sensitivity"
  | "working"
  | "printOptions"
  | "preview"
  | "graphPicker"
  | "graphView"
  | "graphTypes"
  | "programSelect";

export type PrepScreen = "splash" | "setup" | "options" | "graph" | "result";
export type HeatScreen = "splash" | "setup" | "dataHelp" | "result";
export type WellScreen = "splash" | "setup" | "geometry" | "result";

export interface GoFlowState {
  client: string;
  project: string;
  runNumber: string;
  fluid: FluidType;
  streamComp: StreamComp;
  eos: Eos;
  oilWell: boolean;
  gasWell: boolean;
  pipeline: boolean;
  choke: boolean;
  pump: boolean;
  separator: boolean;
  horizontal: boolean;
  outletDefined: boolean;
  outletPressure: string;
  inletTempVariable: boolean;
  controlling: ControllingParam;
  gasOnFile: boolean;
  liftGas: boolean;
  systemOnFile: string | null;
  hasRun: boolean;
  // section 1
  ohtc: string;
  segments: string;
  distStart: string;
  distEnd: string;
  totalLength: string;
  correlation: Correlation;
  // section 2
  sec2Ohtc: string;
  sec2Segments: string;
  sec2DistEnd: string;
  sec2Correlation: Correlation;
  // pipe dims
  ambTemps: string[];
  lengths: string[];
  ids: string[];
  wts: string[];
  roughness: string[];
  extDias: string[];
  // elevation
  elevCount: string;
  elevPairs: { dist: string; elev: string }[];
  // oil
  oilFlowrate: string;
  oilTemp: string;
  oilApi: string;
  waterCut: string;
  gor: string;
  // gas
  gasFlowrate: string;
  gasTemp: string;
  gasGravity: string;
  // sensitivity
  flowrateValues: string;
  // print
  printA: boolean;
  printL: boolean;
  printF: boolean;
  printInterval: string;
  // graph
  selectedGraph: string | null;
}

export interface MsgBoxState {
  title: string;
  message: string;
  icon: "exclamation" | "critical" | "info";
  buttons: ("ok" | "cancel" | "okcancel")[];
  resolve: (result: "ok" | "cancel") => void;
}

export interface FileOpenState {
  title: string;
  files: { name: string; label: string }[];
  resolve: (name: string | null) => void;
}

export interface DemosumData {
  sourceFile: string;
  caption: string;
  summary: {
    client: string;
    project: string;
    fluid: string;
    phaseSeparation: string;
    eos: string;
    oilFlowrate: number;
    oilFlowrateUnit: string;
    gor: number;
    gorUnit: string;
    glr: number;
    glrUnit: string;
    waterCut: number;
    reservoirPressure: number;
    inletPressure: number;
    inletTemperature: number;
    tvdLiftGas: number;
    oilGravity: number;
    deadOilViscosity: { value: number; temp: number }[];
  };
  flowrates: number[];
  segments: {
    segment: number | string;
    distanceKm: number;
    elevationM: number;
    staticLoss: number;
    frictionLoss: number;
    accelLoss: number;
    pressure: number;
    temp: number;
    liquidRate: number;
    gasRate: number;
    holdup: number;
    ambientTemp: number;
    regime: string;
  }[];
  pressureProfile: { distanceKm: number; pressurePsia: number; tempC: number }[];
  graphTypes: {
    type: string;
    parameters: string;
    xAxis: string;
    yAxis: string;
    third: string;
  }[];
}

export function defaultGoFlowState(): GoFlowState {
  return {
    client: "Company",
    project: "Subsea",
    runNumber: "1",
    fluid: "oil",
    streamComp: "black",
    eos: "rks",
    oilWell: true,
    gasWell: false,
    pipeline: false,
    choke: false,
    pump: false,
    separator: false,
    horizontal: false,
    outletDefined: false,
    outletPressure: "0",
    inletTempVariable: false,
    controlling: "flowrate",
    gasOnFile: false,
    liftGas: false,
    systemOnFile: null,
    hasRun: false,
    ohtc: "20",
    segments: "10",
    distStart: "0",
    distEnd: "1.788",
    totalLength: "1.788",
    correlation: "bb",
    sec2Ohtc: "15",
    sec2Segments: "5",
    sec2DistEnd: "1.788",
    sec2Correlation: "hb",
    ambTemps: ["16", "14", "12", "10", "8", "8"],
    lengths: ["1.788", "0", "0", "0", "0"],
    ids: ["3.598", "0", "0", "0", "0"],
    wts: ["0.271", "0", "0", "0", "0"],
    roughness: ["0.0018", "0.0018", "0.0018", "0.0018", "0.0018"],
    extDias: ["0", "0", "0", "0", "0"],
    elevCount: "2",
    elevPairs: [
      { dist: "0", elev: "0" },
      { dist: "1.788", elev: "1788" },
      { dist: "0", elev: "0" },
      { dist: "0", elev: "0" },
    ],
    oilFlowrate: "10000",
    oilTemp: "70",
    oilApi: "37",
    waterCut: "20",
    gor: "500",
    gasFlowrate: "50",
    gasTemp: "60",
    gasGravity: "0.65",
    flowrateValues: "1",
    printA: true,
    printL: true,
    printF: false,
    printInterval: "1",
    selectedGraph: null,
  };
}
