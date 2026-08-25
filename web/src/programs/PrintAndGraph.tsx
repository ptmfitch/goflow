import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import type { DemosumData } from "../types";

export function useDemosum() {
  const [data, setData] = useState<DemosumData | null>(null);
  useEffect(() => {
    void fetch("/cases/demosum.json")
      .then((r) => r.json())
      .then(setData);
  }, []);
  return data;
}

export function PrintOptions() {
  const { go, patchGo, setGoScreen, showMsgBox } = useApp();

  async function onOk() {
    if (
      (go.printL || go.printF) &&
      Number(go.printInterval) <= 5
    ) {
      const r = await showMsgBox({
        title: "Printouts of Segmental Properties in Tabular Form",
        message:
          "When the system has been divided into a large number\nof segments, and if multiple inputs have been selected\nthen printouts showing segmental properties can be very\nlong. The tabular interval should therefore be selected\nwith care.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      if (r !== "ok") return;
    }
    setGoScreen("preview");
  }

  return (
    <WinWindow
      title="PRINT OPTIONS"
      width={460}
      onClose={() => setGoScreen("setup")}
    >
      <fieldset className="win-frame">
        <legend>Printouts available from GOFLOW</legend>
        <label className="win-check">
          <input
            type="checkbox"
            checked={go.printA}
            onChange={(e) => patchGo({ printA: e.target.checked })}
          />
          Summarised printout of results - part 1A (only single input
          variables)
        </label>
        <label className="win-check">
          <input type="checkbox" defaultChecked={false} />
          Summarised printout of results - part 1B (only single input
          variables)
        </label>
        <label className="win-check">
          <input type="checkbox" defaultChecked={false} />
          Sensitivity of pressures and temperatures to variations in input
          data (Metric)
        </label>
        <label className="win-check">
          <input type="checkbox" defaultChecked={false} />
          Sensitivity of pressures and temperatures to variations in input
          data (FPS)
        </label>
        <label className="win-check" style={{ color: "#c00000" }}>
          <input
            type="checkbox"
            checked={go.printL}
            onChange={(e) => patchGo({ printL: e.target.checked })}
          />
          Table of segmental details - pressures and temperatures
        </label>
        <label className="win-check" style={{ color: "#c00000" }}>
          <input
            type="checkbox"
            checked={go.printF}
            onChange={(e) => patchGo({ printF: e.target.checked })}
          />
          Table of segmental details - flowrates and flow regimes
        </label>
        <label className="win-check" style={{ color: "#c00000" }}>
          <input type="checkbox" defaultChecked={false} />
          Table of segmental details - fluid (oil, gas and water) properties
        </label>
        <label className="win-check">
          <input type="checkbox" defaultChecked={false} />
          Printout of system configuration inputs
        </label>
        <label className="win-check">
          <input type="checkbox" defaultChecked={false} />
          Printout of material balance (from PREPFLOW)
        </label>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Printout interval</legend>
        <div className="field-row">
          <label style={{ minWidth: 240 }}>
            Tabular interval for segmental printouts
          </label>
          <input
            className="win-field"
            style={{ background: "#ff0000", color: "#0000ff" }}
            value={go.printInterval}
            onChange={(e) => patchGo({ printInterval: e.target.value })}
          />
        </div>
      </fieldset>

      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("setup")}
        />
      </div>
    </WinWindow>
  );
}

export function PreviewResults() {
  const { setGoScreen } = useApp();
  const data = useDemosum();

  return (
    <WinWindow
      title="PREVIEW OF RESULTS"
      width={720}
      height={520}
      onClose={() => setGoScreen("setup")}
    >
      {!data ? (
        <div>Loading Demosum2.flw…</div>
      ) : (
        <>
          <div className="preview-report">
            <div className="preview-header">{`GOFLOW  —  SUMMARY OF RESULTS
File: E:\\pipeline\\${data.sourceFile}

Fluid: ${data.summary.fluid}     Phase Separation: ${data.summary.phaseSeparation}     EOS: ${data.summary.eos}
Oil Flowrate: ${data.summary.oilFlowrate} ${data.summary.oilFlowrateUnit}     GOR: ${data.summary.gor} ${data.summary.gorUnit}     GLR: ${data.summary.glr} ${data.summary.glrUnit}
Water Cut: ${data.summary.waterCut}%     Reservoir Pressure: ${data.summary.reservoirPressure} psia     Inlet Pressure: ${data.summary.inletPressure} psia
Inlet Temperature: ${data.summary.inletTemperature.toFixed(1)} deg C     TVD lift gas injection: ${data.summary.tvdLiftGas} m
Oil Gravity: ${data.summary.oilGravity.toFixed(1)} Deg API     Client: ${data.summary.client} / ${data.summary.project}
`}</div>
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Seg</th>
                  <th>Dist km</th>
                  <th>Elev m</th>
                  <th>Static</th>
                  <th>Friction</th>
                  <th>Accel</th>
                  <th>P kg/cm²a</th>
                  <th>T °C</th>
                  <th>Liq m³/hr</th>
                  <th>Gas m³/hr</th>
                  <th>Holdup</th>
                  <th>Amb T</th>
                  <th>Regime</th>
                </tr>
              </thead>
              <tbody>
                {data.segments.map((s) => (
                  <tr key={String(s.segment)}>
                    <td>{s.segment}</td>
                    <td>{s.distanceKm.toFixed(3)}</td>
                    <td>{s.elevationM}</td>
                    <td>{s.staticLoss.toFixed(2)}</td>
                    <td>{s.frictionLoss.toFixed(2)}</td>
                    <td>{s.accelLoss.toFixed(2)}</td>
                    <td>{s.pressure.toFixed(1)}</td>
                    <td>{s.temp.toFixed(1)}</td>
                    <td>{s.liquidRate.toFixed(1)}</td>
                    <td>{s.gasRate.toFixed(1)}</td>
                    <td>{s.holdup.toFixed(2)}</td>
                    <td>{s.ambientTemp.toFixed(1)}</td>
                    <td style={{ textAlign: "left" }}>{s.regime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="caption-note">{data.caption}</div>
          <div className="btn-row right">
            <AccelButton
              label="&Exit"
              isDefault
              onClick={() => setGoScreen("setup")}
            />
          </div>
        </>
      )}
    </WinWindow>
  );
}

const GRAPH_BUTTONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "live",
];

export function GraphPicker() {
  const { setGoScreen, patchGo } = useApp();

  function openGraph(id: string) {
    patchGo({ selectedGraph: id });
    setGoScreen("graphView");
  }

  return (
    <WinWindow
      title="GRAPHICAL PRESENTATION"
      width={640}
      height={420}
      onClose={() => setGoScreen("setup")}
    >
      <div className="graph-picker-grid">
        <div>
          <p>
            Select a graph type. Graphs 1–6 show original ChartFX screenshots
            from the 2000 product. <strong>Live profile</strong> plots canned
            Demosum2 distance vs pressure.
          </p>
          <div className="caption-note">
            Results are from demo case Demosum2.flw — user inputs do not
            recompute.
          </div>
        </div>
        <div className="graph-buttons">
          {GRAPH_BUTTONS.map((g) => (
            <button
              key={g}
              type="button"
              className="win-btn"
              style={{ width: "100%", minWidth: 0 }}
              onClick={() => openGraph(g)}
            >
              {g === "live"
                ? "Live: Dist v Pressure"
                : `Display Graph ${g}`}
            </button>
          ))}
          <button
            type="button"
            className="win-btn"
            style={{ width: "100%", minWidth: 0 }}
            onClick={() => setGoScreen("graphTypes")}
          >
            Types of Graph
          </button>
          <AccelButton
            label="&Exit"
            onClick={() => setGoScreen("setup")}
          />
        </div>
      </div>
    </WinWindow>
  );
}

export function GraphTypes() {
  const { setGoScreen } = useApp();
  const data = useDemosum();

  return (
    <WinWindow
      title="AVAILABLE GRAPH TYPES"
      width={640}
      height={400}
      onClose={() => setGoScreen("graphPicker")}
    >
      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
          border: "2px inset #c0c0c0",
        }}
      >
        <table className="graph-types-table">
          <thead>
            <tr>
              <th>Graph Type</th>
              <th>Parameters</th>
              <th>X-Axis</th>
              <th>Y-Axis</th>
              <th>3rd Variable</th>
            </tr>
          </thead>
          <tbody>
            {(data?.graphTypes ?? []).map((g) => (
              <tr key={g.type}>
                <td>{g.type}</td>
                <td>{g.parameters}</td>
                <td>{g.xAxis}</td>
                <td>{g.yAxis}</td>
                <td>{g.third}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn-row right">
        <AccelButton
          label="&Exit"
          isDefault
          onClick={() => setGoScreen("graphPicker")}
        />
      </div>
    </WinWindow>
  );
}

export function GraphView() {
  const { go, setGoScreen } = useApp();
  const data = useDemosum();
  const id = go.selectedGraph ?? "1";

  return (
    <WinWindow
      title={
        id === "live"
          ? "GRAPH — Distance v Pressure (canned)"
          : `GRAPH ${id}`
      }
      width={700}
      height={480}
      onClose={() => setGoScreen("graphPicker")}
    >
      <div className="chart-view">
        {id === "live" && data ? (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data.pressureProfile}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="distanceKm"
                label={{ value: "Distance (km)", position: "insideBottom", offset: -2 }}
              />
              <YAxis
                yAxisId="p"
                label={{ value: "Psia", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="t"
                orientation="right"
                label={{ value: "°C", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="p"
                type="monotone"
                dataKey="pressurePsia"
                name="Pressure (psia)"
                stroke="#000080"
                dot={false}
                strokeWidth={2}
              />
              <Line
                yAxisId="t"
                type="monotone"
                dataKey="tempC"
                name="Temp (°C)"
                stroke="#c00000"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <img
            className="chart-photo"
            src={`/images/chart_example_${id}.jpg`}
            alt={`Graph ${id}`}
          />
        )}
      </div>
      <div className="caption-note">
        {data?.caption ??
          "Results are from demo case Demosum2.flw — user inputs do not recompute."}
      </div>
      <div className="btn-row right">
        <AccelButton
          label="&Exit"
          isDefault
          onClick={() => setGoScreen("graphPicker")}
        />
      </div>
    </WinWindow>
  );
}

export function ProgramSelect() {
  const { setGoScreen, launchProgram, closeProgram } = useApp();
  const [choice, setChoice] = useState<"prep" | "well" | "heat">("prep");
  const [folder, setFolder] = useState("C:\\Program Files\\Multiflow");

  function onOk() {
    closeProgram();
    // slight delay so desktop remounts cleanly then launch sibling
    setTimeout(() => {
      if (choice === "prep") launchProgram("prepflow");
      else if (choice === "well") launchProgram("wellflow");
      else launchProgram("heatflow");
    }, 50);
  }

  return (
    <WinWindow
      title="PROGRAM SELECTION"
      width={460}
      onClose={() => setGoScreen("setup")}
    >
      <div className="field-row">
        <label style={{ minWidth: 260 }}>
          Input Drive : \ Folder for MULTIFLOW program suite
        </label>
        <input
          className="win-field"
          style={{ width: 160 }}
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
      </div>
      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Available programs</legend>
        <label className="win-radio">
          <input
            type="radio"
            checked={choice === "prep"}
            onChange={() => setChoice("prep")}
          />
          Exit to PREPFLOW for preparation of material balance and flash data
          files
        </label>
        <label className="win-radio">
          <input
            type="radio"
            checked={choice === "well"}
            onChange={() => setChoice("well")}
          />
          Exit to WELLFLOW for horizontal well hydraulic analysis
        </label>
        <label className="win-radio">
          <input
            type="radio"
            checked={choice === "heat"}
            onChange={() => setChoice("heat")}
          />
          Exit to HEATFLOW for calculation of Overall Heat Transfer
          Coefficients
        </label>
      </fieldset>
      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={onOk} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("setup")}
        />
      </div>
    </WinWindow>
  );
}
