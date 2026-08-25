import { useState } from "react";
import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import { Splash } from "../components/Splash";
import type { Eos, FluidType, StreamComp } from "../types";

export function WellFlowApp() {
  const {
    wellScreen,
    setWellScreen,
    closeProgram,
    wellPi,
    setWellPi,
  } = useApp();

  const [fluid, setFluid] = useState<FluidType>("oil");
  const [stream, setStream] = useState<StreamComp>("black");
  const [eos, setEos] = useState<Eos>("rks");
  const [length, setLength] = useState("1000");
  const [id, setId] = useState("4.5");
  const [dpi, setDpi] = useState("0.5");

  if (wellScreen === "splash") {
    return (
      <Splash title="Wellflow 6.0" onDone={() => setWellScreen("setup")} />
    );
  }

  if (wellScreen === "geometry") {
    return (
      <WinWindow
        title="WELLFLOW — HORIZONTAL SECTION"
        width={460}
        onClose={() => setWellScreen("setup")}
      >
        <fieldset className="win-frame">
          <legend>Horizontal liner geometry</legend>
          <div className="field-row">
            <label style={{ minWidth: 200 }}>Horizontal length (m)</label>
            <input
              className="win-field"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div className="field-row">
            <label style={{ minWidth: 200 }}>Liner ID (ins)</label>
            <input
              className="win-field"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="field-row">
            <label style={{ minWidth: 200 }}>
              Distributed PI (stbo/day/psi/m)
            </label>
            <input
              className="win-field"
              value={dpi}
              onChange={(e) => setDpi(e.target.value)}
            />
          </div>
        </fieldset>
        <div className="note-red" style={{ marginTop: 8 }}>
          For the correct balance of pressures, drawdown in any segment must
          equal the pressure drop along the liner from the toe to that segment.
        </div>
        <div className="btn-row right">
          <AccelButton
            label="&OK"
            isDefault
            onClick={() => {
              const L = Number(length) || 1000;
              const d = Number(dpi) || 0.5;
              // canned heel PI
              const pi = (d * L * 0.72).toFixed(1);
              setWellPi(pi);
              setWellScreen("result");
            }}
          />
          <AccelButton
            label="&Cancel"
            onClick={() => setWellScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  if (wellScreen === "result") {
    return (
      <WinWindow
        title="WELLFLOW — HEEL PI"
        width={400}
        onClose={() => setWellScreen("setup")}
      >
        <p>
          Productivity index at the heel of the horizontal section (canned):
        </p>
        <p style={{ fontSize: 18, fontWeight: "bold", color: "#000080" }}>
          PI = {wellPi ?? "—"} stbo/day/psi
        </p>
        <div className="caption-note">
          Acceptable input for the main pressure / temperature loss program —
          GOFLOW.
        </div>
        <div className="btn-row right">
          <AccelButton
            label="&OK"
            isDefault
            onClick={() => setWellScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  return (
    <WinWindow
      title="WELLFLOW - HORIZONTAL WELL SIMULATION PROGRAM"
      width={460}
      onClose={closeProgram}
    >
      <div className="field-row">
        <label>Client:</label>
        <input className="win-field" style={{ width: 120 }} defaultValue="Company" />
        <label>Project:</label>
        <input className="win-field" style={{ width: 120 }} defaultValue="Subsea" />
        <label>Run number:</label>
        <input className="win-field" style={{ width: 40 }} defaultValue="1" />
      </div>

      <div className="form-grid-3" style={{ marginTop: 8 }}>
        <fieldset className="win-frame">
          <legend>Program Options</legend>
          <label className="win-radio">
            <input
              type="radio"
              checked={fluid === "gas"}
              onChange={() => setFluid("gas")}
            />
            Gas flow
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={fluid === "oil"}
              onChange={() => setFluid("oil")}
            />
            Oil flow
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={fluid === "condensate"}
              onChange={() => setFluid("condensate")}
            />
            Condensate flow
          </label>
        </fieldset>

        <fieldset className="win-frame">
          <legend>Stream Composition Options</legend>
          <div className="note-red">(For Crude Oil only)</div>
          <label className={`win-radio ${fluid !== "oil" ? "disabled" : ""}`}>
            <input
              type="radio"
              disabled={fluid !== "oil"}
              checked={stream === "black"}
              onChange={() => setStream("black")}
            />
            Black oil correlation
          </label>
          <label className={`win-radio ${fluid !== "oil" ? "disabled" : ""}`}>
            <input
              type="radio"
              disabled={fluid !== "oil"}
              checked={stream === "flash"}
              onChange={() => setStream("flash")}
            />
            Flashed wellstream
          </label>
        </fieldset>

        <fieldset className="win-frame">
          <legend>Equation of State Options</legend>
          <label className="win-radio">
            <input
              type="radio"
              checked={eos === "rks"}
              onChange={() => setEos("rks")}
            />
            Redlich Kwong Soave
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={eos === "pr"}
              onChange={() => setEos("pr")}
            />
            Peng Robinson
          </label>
        </fieldset>
      </div>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Note</legend>
        <div className="note-red">
          This program calculates the PI of the well at the heel of the
          horizontal section. For oil wells the PI at two different flow rates
          is required, whereas for gas and gas condensate wells only one PI is
          required.
        </div>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>For all Non - Flashed cases</legend>
        <label className="win-check">
          <input type="checkbox" />
          Are gas characteristics on file?
        </label>
      </fieldset>

      <div className="btn-row right">
        <AccelButton label="&Print" disabled />
        <AccelButton
          label="&OK"
          isDefault
          onClick={() => setWellScreen("geometry")}
        />
        <AccelButton label="&End" onClick={closeProgram} />
      </div>
    </WinWindow>
  );
}
