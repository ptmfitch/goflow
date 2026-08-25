import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import type { FluidType } from "../types";

export function GoFlowSetup() {
  const { go, patchGo, setGoScreen, closeProgram, showMsgBox, showFileOpen } =
    useApp();

  const oilOnly = go.fluid === "oil";

  async function onOk() {
    if (go.outletDefined && (go.outletPressure === "0" || !go.outletPressure)) {
      await showMsgBox({
        title: "Fixed Outlet Pressure Error Message",
        message:
          "An outlet pressure must be specified. Input\nthe pressure now.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      return;
    }

    if (go.systemOnFile) {
      setGoScreen("section1");
      return;
    }

    if (go.hasRun) {
      // Already ran — OK again re-enters geometry path
    }

    setGoScreen("section1");
  }

  async function onBwrClick() {
    patchGo({ eos: "bwr" });
    if (go.streamComp === "flash") {
      await showMsgBox({
        title: "Selection of Equation of State",
        message:
          "The BWR equation of state cannot be used\nin conjunction with the flashed wellstream\noption for stream composition.",
        icon: "critical",
        buttons: ["ok"],
      });
    }
  }

  async function onFlowrateClick() {
    patchGo({ controlling: "flowrate" });
    await showMsgBox({
      title: "Multiple Inputs - Fixed Outlet Pressure",
      message:
        "Maximum flowrate is calculated if flowrate is\nselected as controlling parameter for a fixed\noutlet pressure. Multiple inputs are therefore\nnot allowed for this condition.",
      icon: "exclamation",
      buttons: ["ok"],
    });
  }

  async function onSystemOnFile(checked: boolean) {
    if (!checked) {
      patchGo({ systemOnFile: null });
      return;
    }
    const file = await showFileOpen({
      title: "File Open - System Configuration Data",
      files: [
        { name: "Camwell.flw", label: "Camwell.flw  (oil well demo)" },
        { name: "Camgas.flw", label: "Camgas.flw  (gas demo)" },
        { name: "Demosum.flw", label: "Demosum.flw  (summary case)" },
      ],
    });
    if (file) {
      patchGo({
        systemOnFile: file,
        // Camwell-like geometry already defaults; mark as loaded
        distEnd: "1.788",
        totalLength: "1.788",
        elevPairs: [
          { dist: "0", elev: "0" },
          { dist: "1.788", elev: "1788" },
          { dist: "0", elev: "0" },
          { dist: "0", elev: "0" },
        ],
      });
    }
  }

  function setFluid(fluid: FluidType) {
    patchGo({
      fluid,
      streamComp: fluid === "oil" ? go.streamComp : "black",
    });
  }

  return (
    <WinWindow
      title="GOFLOW - FLUID FLOW SIMULATION PROGRAM SET UP"
      width={460}
      onClose={closeProgram}
    >
      <div className="field-row" style={{ marginBottom: 8 }}>
        <label>Client:</label>
        <input
          className="win-field"
          style={{ width: 120 }}
          value={go.client}
          onChange={(e) => patchGo({ client: e.target.value })}
        />
        <label>Project:</label>
        <input
          className="win-field"
          style={{ width: 120 }}
          value={go.project}
          onChange={(e) => patchGo({ project: e.target.value })}
        />
        <label>Run number:</label>
        <input
          className="win-field"
          style={{ width: 40 }}
          value={go.runNumber}
          onChange={(e) => patchGo({ runNumber: e.target.value })}
        />
      </div>

      <div className="form-grid-3" style={{ marginBottom: 8 }}>
        <fieldset className="win-frame">
          <legend>Program options</legend>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.fluid === "gas"}
              onChange={() => setFluid("gas")}
            />
            Gas flow
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.fluid === "oil"}
              onChange={() => setFluid("oil")}
            />
            Oil (or water) flow
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.fluid === "condensate"}
              onChange={() => setFluid("condensate")}
            />
            Condensate flow
          </label>
        </fieldset>

        <fieldset className={`win-frame ${!oilOnly ? "disabled-look" : ""}`}>
          <legend>Stream composition options</legend>
          <div className="note-red" style={{ marginBottom: 4 }}>
            ( For Crude Oil only )
          </div>
          <label className={`win-radio ${!oilOnly ? "disabled" : ""}`}>
            <input
              type="radio"
              disabled={!oilOnly}
              checked={go.streamComp === "black"}
              onChange={() => patchGo({ streamComp: "black" })}
            />
            Black oil correlation
          </label>
          <label className={`win-radio ${!oilOnly ? "disabled" : ""}`}>
            <input
              type="radio"
              disabled={!oilOnly}
              checked={go.streamComp === "flash"}
              onChange={() => patchGo({ streamComp: "flash" })}
            />
            Flashed wellstream
          </label>
        </fieldset>

        <fieldset className="win-frame">
          <legend>Equation of state options</legend>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.eos === "rks"}
              onChange={() => patchGo({ eos: "rks" })}
            />
            Redlich Kwong Soave
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.eos === "pr"}
              onChange={() => patchGo({ eos: "pr" })}
            />
            Peng Robinson
          </label>
          <label className="win-radio">
            <input
              type="radio"
              checked={go.eos === "bwr"}
              onChange={() => void onBwrClick()}
            />
            Benedict Webb Rubin
          </label>
        </fieldset>
      </div>

      <div className="form-grid-2">
        <fieldset className="win-frame">
          <legend>System components</legend>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.oilWell}
              onChange={(e) => patchGo({ oilWell: e.target.checked })}
            />
            Does system include an oil well ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.gasWell}
              onChange={(e) => patchGo({ gasWell: e.target.checked })}
            />
            Does system include a gas well ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.pipeline}
              onChange={(e) => patchGo({ pipeline: e.target.checked })}
            />
            Does system include a pipeline ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.choke}
              onChange={(e) => patchGo({ choke: e.target.checked })}
            />
            Is a prodn or GL choke included ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.pump}
              onChange={(e) => patchGo({ pump: e.target.checked })}
            />
            Is an ESP or a MP pump included ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.separator}
              onChange={(e) => patchGo({ separator: e.target.checked })}
            />
            Is a subsea separator included ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={go.horizontal}
              onChange={(e) => patchGo({ horizontal: e.target.checked })}
            />
            Does well have horizontal section ?
          </label>
        </fieldset>

        <div>
          <fieldset className="win-frame">
            <legend>Fixed outlet pressure</legend>
            <label className="win-check">
              <input
                type="checkbox"
                checked={go.outletDefined}
                onChange={(e) =>
                  patchGo({ outletDefined: e.target.checked })
                }
              />
              Is system outlet pressure defined ?
            </label>
            <div className="field-row">
              <label style={{ minWidth: 160 }}>
                Outlet (flowing) pressure (psia)
              </label>
              <input
                className="win-field"
                value={go.outletPressure}
                onChange={(e) => patchGo({ outletPressure: e.target.value })}
              />
            </div>
            <label className="win-check">
              <input
                type="checkbox"
                checked={go.inletTempVariable}
                onChange={(e) =>
                  patchGo({ inletTempVariable: e.target.checked })
                }
              />
              Is the inlet temperature variable ?
            </label>
            <div style={{ marginTop: 4 }}>Controlling parameter options:</div>
            <label className="win-radio" style={{ color: "#c00000" }}>
              <input
                type="radio"
                checked={go.controlling === "flowrate"}
                onChange={() => void onFlowrateClick()}
              />
              Flowrate
            </label>
            <label className="win-radio">
              <input
                type="radio"
                checked={go.controlling === "inletPressure"}
                onChange={() => patchGo({ controlling: "inletPressure" })}
              />
              Inlet pressure
            </label>
          </fieldset>

          <fieldset className="win-frame" style={{ marginTop: 8 }}>
            <legend>Gas and Lift Gas parameters</legend>
            <div className="note-red" style={{ marginBottom: 4 }}>
              For gas and solution gas in Non - Flashed cases and for Lift Gas
              added in GOFLOW.
            </div>
            <label className="win-check">
              <input
                type="checkbox"
                checked={go.gasOnFile}
                onChange={(e) => patchGo({ gasOnFile: e.target.checked })}
              />
              Are gas characteristics on file ?
            </label>
            <label className="win-check">
              <input
                type="checkbox"
                checked={go.liftGas}
                onChange={(e) => patchGo({ liftGas: e.target.checked })}
              />
              Is lift gas to be added in GOFLOW ?
            </label>
          </fieldset>

          <fieldset className="win-frame" style={{ marginTop: 8 }}>
            <legend>System configuration</legend>
            <label className="win-check">
              <input
                type="checkbox"
                checked={!!go.systemOnFile}
                onChange={(e) => void onSystemOnFile(e.target.checked)}
              />
              Is system configuration on file ?
            </label>
            {go.systemOnFile && (
              <div style={{ marginLeft: 20, color: "#0000ff" }}>
                {go.systemOnFile}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      <div className="btn-row spread" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton
            label="&Print"
            disabled={!go.hasRun}
            onClick={() => setGoScreen("printOptions")}
          />
          <AccelButton
            label="&Graph"
            disabled={!go.hasRun}
            onClick={() => setGoScreen("graphPicker")}
          />
          <AccelButton
            label="P&review"
            disabled={!go.hasRun}
            onClick={() => setGoScreen("preview")}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton
            label="&Programs"
            onClick={() => setGoScreen("programSelect")}
          />
          <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
          <AccelButton label="&End" onClick={closeProgram} />
        </div>
      </div>
      {go.hasRun && (
        <div className="caption-note">
          Run complete — Print / Graph use canned Demosum2.flw results.
        </div>
      )}
    </WinWindow>
  );
}
