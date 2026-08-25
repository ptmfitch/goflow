import { useState } from "react";
import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import { Splash } from "../components/Splash";

export function PrepFlowApp() {
  const {
    prepScreen,
    setPrepScreen,
    closeProgram,
    showMsgBox,
    prepComps,
    setPrepComps,
    prepUserComps,
    setPrepUserComps,
  } = useApp();
  const [dataOnFile, setDataOnFile] = useState(false);
  const [liftGas, setLiftGas] = useState(false);

  if (prepScreen === "splash") {
    return (
      <Splash
        title="Prepflow 6.0"
        onDone={() => setPrepScreen("setup")}
      />
    );
  }

  if (prepScreen === "graph") {
    return (
      <WinWindow
        title="PREPFLOW — PHASE ENVELOPE"
        width={560}
        height={420}
        onClose={() => setPrepScreen("setup")}
      >
        <img
          className="chart-photo"
          src="/images/prepflow_conphase.jpg"
          alt="Gas condensate phase envelope"
        />
        <div className="caption-note">
          Canned PrepFlow phase envelope (museum replica).
        </div>
        <div className="btn-row right">
          <AccelButton
            label="&Exit"
            isDefault
            onClick={() => setPrepScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  if (prepScreen === "options" || prepScreen === "result") {
    return (
      <WinWindow
        title="PREPFLOW — ACTIVITY OPTIONS"
        width={460}
        onClose={() => setPrepScreen("setup")}
      >
        <p>
          Activity options (museum stub). The first four activities must always
          be selected in sequence.
        </p>
        <ol>
          <li>Check fluid composition</li>
          <li>Prepare compact fluid data file</li>
          <li>Calculate whole fluid properties</li>
          <li>Match laboratory flash separation</li>
        </ol>
        <div className="caption-note">
          Material balance / matrix files would be written for GoFlow. Here we
          only simulate completion.
        </div>
        <div className="btn-row right">
          <AccelButton
            label="&OK"
            isDefault
            onClick={async () => {
              await showMsgBox({
                title: "PREPFLOW",
                message:
                  "Flash separation complete (canned).\nMaterial balance file ready for GOFLOW.",
                icon: "info",
                buttons: ["ok"],
              });
              setPrepScreen("setup");
            }}
          />
          <AccelButton
            label="&Cancel"
            onClick={() => setPrepScreen("setup")}
          />
        </div>
      </WinWindow>
    );
  }

  // setup
  async function onOk() {
    const nc = Number(prepComps);
    if (nc > 35) {
      await showMsgBox({
        title: "Component Input Error Message",
        message:
          "The number of components specified cannot be\ngreater than 35.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      return;
    }
    if (nc < 15) {
      await showMsgBox({
        title: "Component Input Error Message",
        message:
          "The number of components specified must be\nat least 15, and must include C10.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      return;
    }
    setPrepScreen(dataOnFile ? "options" : "options");
  }

  return (
    <WinWindow
      title="PREPFLOW - FLASH SEPARATION PROGRAM SET UP"
      width={460}
      onClose={closeProgram}
    >
      <div className="field-row">
        <label>Client name:</label>
        <input className="win-field" style={{ width: 140 }} defaultValue="Company" />
        <label>Project description:</label>
        <input className="win-field" style={{ width: 140 }} defaultValue="Subsea" />
      </div>

      <div className="form-grid-2" style={{ marginTop: 8 }}>
        <fieldset className="win-frame">
          <legend>General</legend>
          <label className="win-check">
            <input
              type="checkbox"
              checked={dataOnFile}
              onChange={(e) => setDataOnFile(e.target.checked)}
            />
            Is fluid composition data on file ?
          </label>
          <label className="win-check">
            <input type="checkbox" />
            If not - is file of fluid data required ?
          </label>
          <label className="win-check">
            <input type="checkbox" />
            Is fluid a gas below its dewpoint ?
          </label>
          <label className="win-check">
            <input
              type="checkbox"
              checked={liftGas}
              onChange={(e) => setLiftGas(e.target.checked)}
            />
            Is lift gas to be added in PREPFLOW ?
          </label>
          <label className="win-check">
            <input type="checkbox" />
            Group properties to be used for C6+ ?
          </label>
          <label className="win-check">
            <input type="checkbox" />
            Printout of compact input data file ?
          </label>
        </fieldset>

        <div>
          <fieldset className="win-frame">
            <legend>Components</legend>
            <div className="field-row">
              <label style={{ minWidth: 160 }}>
                Total number of components
              </label>
              <input
                className="win-field"
                value={prepComps}
                onChange={(e) => setPrepComps(e.target.value)}
              />
            </div>
            <div style={{ fontSize: 10 }}>(minimum 15 - maximum 35)</div>
            <div className="field-row" style={{ marginTop: 8 }}>
              <label style={{ minWidth: 160 }}>
                No. user defined components
              </label>
              <input
                className="win-field"
                value={prepUserComps}
                onChange={(e) => setPrepUserComps(e.target.value)}
              />
            </div>
            <div style={{ fontSize: 10 }}>(minimum 1 - maximum 5)</div>
          </fieldset>
          <fieldset className="win-frame" style={{ marginTop: 8 }}>
            <legend>Important note</legend>
            <div className="note-red">
              If multiple inputs are to be selected in GOFLOW and if lift gas is
              to be used, then it must be added in GOFLOW.
            </div>
          </fieldset>
        </div>
      </div>

      <div className="btn-row spread">
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton label="&Print" disabled />
          <AccelButton
            label="&Graph"
            onClick={() => setPrepScreen("graph")}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
          <AccelButton label="&End" onClick={closeProgram} />
        </div>
      </div>
    </WinWindow>
  );
}
