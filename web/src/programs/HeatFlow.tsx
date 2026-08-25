import { useState } from "react";
import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import { Splash } from "../components/Splash";

export function HeatFlowApp() {
  const {
    heatScreen,
    setHeatScreen,
    closeProgram,
    showMsgBox,
    heatOhtc,
    setHeatOhtc,
  } = useApp();

  const [client] = useState("Company");
  const [project] = useState("Subsea");
  const [run] = useState("1");
  const [id, setId] = useState("8.0");
  const [wt, setWt] = useState("0.5");
  const [soil, setSoil] = useState("1.2");
  const [depth, setDepth] = useState("1.5");
  const [fluid, setFluid] = useState<"oil" | "gas">("oil");
  const [coatings, setCoatings] = useState([
    { thick: "50", tc: "0.18", temp: "40" },
    { thick: "0", tc: "0", temp: "0" },
    { thick: "0", tc: "0", temp: "0" },
  ]);

  if (heatScreen === "splash") {
    return (
      <Splash title="Heatflow 6.0" onDone={() => setHeatScreen("setup")} />
    );
  }

  if (heatScreen === "dataHelp") {
    return (
      <WinWindow
        title="HEATFLOW — THERMAL CONDUCTIVITY DATA"
        width={520}
        onClose={() => setHeatScreen("setup")}
      >
        <pre
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 11,
            whiteSpace: "pre-wrap",
            background: "#fff",
            border: "2px inset #c0c0c0",
            padding: 8,
          }}
        >{`                       Typical thermal conductivities (W/mC)

  Soil                           0.8 - 2.0      Asbestos               0.16 - 0.23
  Clayey soil                 0.4 - 1.4      Syntactic foam       0.1
  Saturated sand          0.86 - 1.75      Cellular concrete    0.07 - 0.085
  Concrete                   1.0 - 1.75      Foam glass            0.05
  Fusion bonded epoxy  0.27              Mineral wool          0.035 - 0.04
  Neoprene                  0.25 - 0.28      PVC foam              0.035 - 0.065
  Polyurethane             0.18              PU foam                0.02 - 0.03
  EPDM                       0.028             Bitumen                 0.33`}</pre>
        <div className="btn-row right">
          <AccelButton
            label="&Exit"
            isDefault
            onClick={() => setHeatScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  if (heatScreen === "result") {
    return (
      <WinWindow
        title="HEATFLOW — OHTC RESULT"
        width={400}
        onClose={() => setHeatScreen("setup")}
      >
        <p>
          Overall heat transfer coefficient (canned museum result):
        </p>
        <p style={{ fontSize: 18, fontWeight: "bold", color: "#000080" }}>
          OHTC = {heatOhtc ?? "20.0"} W/m²·°C
        </p>
        <div className="caption-note">
          Not computed from TRANHEAT.BAS — representative value for GoFlow
          input.
        </div>
        <div className="btn-row right">
          <AccelButton
            label="&OK"
            isDefault
            onClick={() => setHeatScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  async function onOk() {
    if (run === "1") {
      const r = await showMsgBox({
        title: "Run Number Warning",
        message:
          "The results of each run are entered into an\n'Append' type file. Therefore all runs saved\nunder the same file name must be numbered\nsequentially.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      if (r !== "ok") return;
    }
    // canned OHTC based loosely on burial depth
    const d = Number(depth) || 1;
    const ohtc = (18 + d * 1.2).toFixed(1);
    setHeatOhtc(ohtc);
    setHeatScreen("result");
  }

  return (
    <WinWindow
      title="HEATFLOW - CALCULATION OF OHTCs"
      width={460}
      onClose={closeProgram}
    >
      <fieldset className="win-frame">
        <legend>Project Identification</legend>
        <div className="field-row">
          <label>Client:</label>
          <input className="win-field" style={{ width: 120 }} value={client} readOnly />
          <label>Project:</label>
          <input className="win-field" style={{ width: 120 }} value={project} readOnly />
          <label>Run number:</label>
          <input className="win-field" style={{ width: 40 }} value={run} readOnly />
        </div>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>System Data</legend>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Pipe internal diameter (ins)</label>
          <input
            className="win-field"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Pipe wall thickness (ins)</label>
          <input
            className="win-field"
            value={wt}
            onChange={(e) => setWt(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>
            Soil thermal conductivity (W/mC)
          </label>
          <input
            className="win-field"
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Depth to centre of pipe (m)</label>
          <input
            className="win-field"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 8, marginBottom: 4 }}>Coating data</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 1fr 1fr",
            gap: 4,
            alignItems: "center",
          }}
        >
          <span />
          <strong>Thickness (mm)</strong>
          <strong>T.C. (W/mC)</strong>
          <strong>Temp (°C)</strong>
          {coatings.map((c, i) => (
            <div key={i} style={{ display: "contents" }}>
              <span>{i + 1}st coating</span>
              <input
                className="win-field"
                value={c.thick}
                onChange={(e) => {
                  const next = [...coatings];
                  next[i] = { ...c, thick: e.target.value };
                  setCoatings(next);
                }}
              />
              <input
                className="win-field"
                value={c.tc}
                onChange={(e) => {
                  const next = [...coatings];
                  next[i] = { ...c, tc: e.target.value };
                  setCoatings(next);
                }}
              />
              <input
                className="win-field"
                value={c.temp}
                onChange={(e) => {
                  const next = [...coatings];
                  next[i] = { ...c, temp: e.target.value };
                  setCoatings(next);
                }}
              />
            </div>
          ))}
        </div>

        <fieldset className="win-frame" style={{ marginTop: 8 }}>
          <legend>Note</legend>
          <div className="note-red">
            Depths must be entered as +ve for pipes with centre line below
            ground level, and -ve for pipes with centre line above ground.
          </div>
        </fieldset>

        <fieldset className="win-frame" style={{ marginTop: 8 }}>
          <legend>Principal fluid</legend>
          <label className="win-radio">
            <input
              type="radio"
              checked={fluid === "oil"}
              onChange={() => setFluid("oil")}
            />
            Crude oil
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={fluid === "gas"}
              onChange={() => setFluid("gas")}
            />
            Gas
          </label>
        </fieldset>
      </fieldset>

      <div className="btn-row spread">
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton
            label="&Data"
            onClick={() => setHeatScreen("dataHelp")}
          />
          <AccelButton label="&Print" disabled />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
          <AccelButton label="&End" onClick={closeProgram} />
        </div>
      </div>
    </WinWindow>
  );
}
