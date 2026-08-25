import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";

const SECTION_LABELS = ["1st", "2nd", "3rd", "4th", "5th"];

export function PipeDims() {
  const { go, patchGo, setGoScreen } = useApp();

  function updateArr(
    key: "ambTemps" | "lengths" | "ids" | "wts" | "roughness" | "extDias",
    index: number,
    value: string
  ) {
    const next = [...go[key]];
    next[index] = value;
    patchGo({ [key]: next });
  }

  return (
    <WinWindow
      title="AMBIENT TEMPERATURES AND PIPE DIMENSIONS"
      width={460}
      onClose={() => setGoScreen("section1")}
    >
      <fieldset className="win-frame">
        <legend>Ambient temperatures (°C)</legend>
        <div className="dim-grid">
          <span />
          {SECTION_LABELS.map((l) => (
            <strong key={l}>{l}</strong>
          ))}
          <span>Amb. temp</span>
          {go.ambTemps.slice(0, 5).map((v, i) => (
            <input
              key={i}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("ambTemps", i, e.target.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Pipe and tubing dimensions</legend>
        <div className="dim-grid">
          <span />
          {SECTION_LABELS.map((l) => (
            <strong key={l}>{l}</strong>
          ))}
          <span>Length (km)</span>
          {go.lengths.map((v, i) => (
            <input
              key={`l${i}`}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("lengths", i, e.target.value)}
            />
          ))}
          <span>ID (ins)</span>
          {go.ids.map((v, i) => (
            <input
              key={`i${i}`}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("ids", i, e.target.value)}
            />
          ))}
          <span>Wall thick (ins)</span>
          {go.wts.map((v, i) => (
            <input
              key={`w${i}`}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("wts", i, e.target.value)}
            />
          ))}
          <span>Roughness (ins)</span>
          {go.roughness.map((v, i) => (
            <input
              key={`r${i}`}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("roughness", i, e.target.value)}
            />
          ))}
          <span>Ext. dia (ins)</span>
          {go.extDias.map((v, i) => (
            <input
              key={`e${i}`}
              className="win-field"
              value={v}
              onChange={(e) => updateArr("extDias", i, e.target.value)}
            />
          ))}
        </div>
      </fieldset>

      <div className="btn-row right">
        <AccelButton
          label="&OK"
          isDefault
          onClick={() => setGoScreen("elevation")}
        />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("section1")}
        />
      </div>
    </WinWindow>
  );
}

export function ElevationPairs() {
  const { go, patchGo, setGoScreen } = useApp();
  const count = Math.min(4, Math.max(2, Number(go.elevCount) || 2));

  function updatePair(i: number, field: "dist" | "elev", value: string) {
    const next = go.elevPairs.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p
    );
    patchGo({ elevPairs: next });
  }

  function onOk() {
    if (go.fluid === "oil") {
      setGoScreen("oilFlow");
    } else {
      setGoScreen("gasFlow");
    }
  }

  return (
    <WinWindow
      title="SYSTEM DISTANCE AND ELEVATION PAIRS"
      width={460}
      onClose={() => setGoScreen("pipeDims")}
    >
      <div className="field-row">
        <label style={{ minWidth: 220 }}>
          Number of distance / elevation pairs
        </label>
        <input
          className="win-field"
          value={go.elevCount}
          onChange={(e) => patchGo({ elevCount: e.target.value })}
        />
      </div>

      <fieldset className="win-frame" style={{ marginTop: 8 }}>
        <legend>Distance/elevation pairs</legend>
        <div className="elev-grid">
          <strong>Pair</strong>
          <strong>Distance (km)</strong>
          <strong>Elevation (m)</strong>
          <strong />
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ display: "contents" }}>
              <span>{i + 1}</span>
              <input
                className="win-field"
                value={go.elevPairs[i]?.dist ?? "0"}
                onChange={(e) => updatePair(i, "dist", e.target.value)}
              />
              <input
                className="win-field"
                value={go.elevPairs[i]?.elev ?? "0"}
                onChange={(e) => updatePair(i, "elev", e.target.value)}
              />
              <span />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="caption-note">
        Defaults match Camwell.flw (0 → 1.788 km, 0 → 1788 m TVD).
      </div>

      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={onOk} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen("pipeDims")}
        />
      </div>
    </WinWindow>
  );
}
