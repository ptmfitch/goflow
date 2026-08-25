import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";

export function OilFlow() {
  const { go, patchGo, setGoScreen, showMsgBox } = useApp();

  async function onOk() {
    if (!go.oilFlowrate || go.oilFlowrate === "0") {
      await showMsgBox({
        title: "Input Error Message",
        message: "Oil (or water) flowrate must be specified.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      return;
    }
    if (!go.oilTemp || go.oilTemp === "0") {
      const r = await showMsgBox({
        title: "Input Error Message",
        message:
          "Oil (or water) temperature must be specified\nexcept for the special case of 0 deg C.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      if (r === "cancel") return;
    }
    setGoScreen("sensitivity");
  }

  return (
    <WinWindow
      title="OIL FLOW CHARACTERISTICS"
      width={460}
      onClose={() => setGoScreen("elevation")}
    >
      <fieldset className="win-frame">
        <legend>Oil / liquid properties</legend>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Oil flowrate (stbo/day)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.oilFlowrate}
            onChange={(e) => patchGo({ oilFlowrate: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Inlet temperature (°C)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.oilTemp}
            onChange={(e) => patchGo({ oilTemp: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Oil gravity (API)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.oilApi}
            onChange={(e) => patchGo({ oilApi: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>Water cut (%)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.waterCut}
            onChange={(e) => patchGo({ waterCut: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 180 }}>GOR (scf/stbo)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.gor}
            onChange={(e) => patchGo({ gor: e.target.value })}
          />
        </div>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Note</legend>
        <div className="note-red">
          Enter maximum values for either flowrate or water cut when multiple
          inputs are to be selected.
        </div>
      </fieldset>

      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("elevation")}
        />
      </div>
    </WinWindow>
  );
}

export function GasFlow() {
  const { go, patchGo, setGoScreen, showMsgBox } = useApp();

  async function onOk() {
    if (!go.gasFlowrate || go.gasFlowrate === "0") {
      await showMsgBox({
        title: "Input Error Message",
        message: "Gas flowrate must be specified.",
        icon: "exclamation",
        buttons: ["okcancel"],
      });
      return;
    }
    setGoScreen("working");
  }

  return (
    <WinWindow
      title="GAS FLOW CHARACTERISTICS ( FIELD UNITS )"
      width={460}
      onClose={() => setGoScreen("elevation")}
    >
      <fieldset className="win-frame">
        <legend>Gas properties</legend>
        <div className="field-row">
          <label style={{ minWidth: 200 }}>Gas flowrate (MMscf/day)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.gasFlowrate}
            onChange={(e) => patchGo({ gasFlowrate: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 200 }}>Inlet temperature (°C)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.gasTemp}
            onChange={(e) => patchGo({ gasTemp: e.target.value })}
          />
        </div>
        <div className="field-row">
          <label style={{ minWidth: 200 }}>Gas gravity (air = 1)</label>
          <input
            className="win-field"
            style={{ width: 80 }}
            value={go.gasGravity}
            onChange={(e) => patchGo({ gasGravity: e.target.value })}
          />
        </div>
      </fieldset>

      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("elevation")}
        />
      </div>
    </WinWindow>
  );
}

export function Sensitivity() {
  const { go, patchGo, setGoScreen } = useApp();

  return (
    <WinWindow
      title="OIL FLOW INPUT  PARAMETER  SENSITIVITY"
      width={460}
      onClose={() => setGoScreen("oilFlow")}
    >
      <fieldset className="win-frame">
        <legend>Select number of values of flowrate</legend>
        <div className="note-red">(Maximum number 5)</div>
        <div className="field-row">
          <label>Number of values</label>
          <input
            className="win-field"
            value={go.flowrateValues}
            onChange={(e) => patchGo({ flowrateValues: e.target.value })}
          />
        </div>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Water cut sensitivity options</legend>
        <div className="note-red">(Maximum number 5)</div>
        <div className="field-row">
          <label>Number of values</label>
          <input className="win-field" defaultValue="1" />
        </div>
      </fieldset>

      <div className="caption-note">
        Museum default: single flowrate value — proceeds to canned run.
      </div>

      <div className="btn-row right">
        <AccelButton
          label="&OK"
          isDefault
          onClick={() => setGoScreen("working")}
        />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("oilFlow")}
        />
      </div>
    </WinWindow>
  );
}
