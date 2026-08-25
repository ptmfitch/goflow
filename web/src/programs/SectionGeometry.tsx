import { useApp } from "../AppContext";
import { AccelButton, WinWindow } from "../components/WinWindow";
import type { Correlation } from "../types";

const CORRELATIONS: { id: Correlation; label: string }[] = [
  { id: "ork", label: " Orkiszewski (vertical flow)" },
  { id: "bb", label: " Beggs and Brill (generalised flow)" },
  { id: "bj", label: " Baker Jardine (undulating flow)" },
  { id: "dukler", label: " Dukler, Eaton et al (undulating flow)" },
  { id: "hb", label: " Hagedorn and Brown (vertical flow)" },
  { id: "dr", label: " Duns and Ros (vertical flow)" },
  { id: "none", label: " Darcy-Weisbach (single phase liquid)" },
];

export function SectionGeometry({ section }: { section: 1 | 2 }) {
  const { go, patchGo, setGoScreen, showMsgBox } = useApp();

  const is1 = section === 1;
  const title = is1
    ? "SYSTEM CONFIGURATION - 1st SECTION"
    : "SYSTEM CONFIGURATION - 2nd SECTION ";

  async function onOk() {
    const segs = Number(is1 ? go.segments : go.sec2Segments);
    const start = Number(is1 ? go.distStart : go.distEnd);
    const end = Number(is1 ? go.distEnd : go.sec2DistEnd);
    const segLen = segs > 0 ? (end - start) / segs : 0;

    if (segs > 80 || (segs > 0 && segLen < 0.05 && end !== start)) {
      await showMsgBox({
        title: "Program Limit on Number and Length of Segments",
        message:
          "The maximum number of segments allowed is 80,\nand the minimum length of a segment is 50 m.\nThe segmental lengths must now be increased.",
        icon: "critical",
        buttons: ["okcancel"],
      });
      return;
    }

    if (is1) {
      const total = Number(go.totalLength);
      if (Number(go.distEnd) === total) {
        setGoScreen("pipeDims");
      } else {
        patchGo({ sec2DistEnd: go.totalLength });
        setGoScreen("section2");
      }
    } else {
      setGoScreen("pipeDims");
    }
  }

  return (
    <WinWindow
      title={title}
      width={460}
      onClose={() => setGoScreen("setup")}
    >
      <div className="form-grid-2">
        <div>
          <fieldset className="win-frame">
            <legend>{is1 ? "1st Section" : "2nd Section"}</legend>
            <div className="field-row">
              <label>OHTC (W/m2 C)</label>
              <input
                className="win-field"
                value={is1 ? go.ohtc : go.sec2Ohtc}
                onChange={(e) =>
                  patchGo(
                    is1
                      ? { ohtc: e.target.value }
                      : { sec2Ohtc: e.target.value }
                  )
                }
              />
            </div>
            <div className="field-row">
              <label>Number of segments</label>
              <input
                className="win-field"
                value={is1 ? go.segments : go.sec2Segments}
                onChange={(e) =>
                  patchGo(
                    is1
                      ? { segments: e.target.value }
                      : { sec2Segments: e.target.value }
                  )
                }
              />
            </div>
            <div className="field-row">
              <label>Between</label>
              <input
                className="win-field"
                value={is1 ? go.distStart : go.distEnd}
                readOnly={!is1}
                onChange={(e) =>
                  is1 && patchGo({ distStart: e.target.value })
                }
              />
              <span>and</span>
              <input
                className="win-field"
                value={is1 ? go.distEnd : go.sec2DistEnd}
                onChange={(e) =>
                  patchGo(
                    is1
                      ? { distEnd: e.target.value }
                      : { sec2DistEnd: e.target.value }
                  )
                }
              />
              <span>km</span>
            </div>
          </fieldset>
          {is1 && (
            <div className="field-row" style={{ marginTop: 12 }}>
              <label style={{ minWidth: 200 }}>
                Overall system pipeline length (km)
              </label>
              <input
                className="win-field"
                value={go.totalLength}
                onChange={(e) => patchGo({ totalLength: e.target.value })}
              />
            </div>
          )}
        </div>

        <fieldset className="win-frame">
          <legend>Two phase flow correlation options</legend>
          <div style={{ marginBottom: 4 }}>
            Not required for single phase (dry) gas
          </div>
          {CORRELATIONS.map((c) => (
            <label key={c.id} className="win-radio">
              <input
                type="radio"
                checked={
                  (is1 ? go.correlation : go.sec2Correlation) === c.id
                }
                onChange={() =>
                  patchGo(
                    is1
                      ? { correlation: c.id }
                      : { sec2Correlation: c.id }
                  )
                }
              />
              {c.label}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="btn-row right">
        <AccelButton label="&OK" isDefault onClick={() => void onOk()} />
        <AccelButton
          label="&Cancel"
          onClick={() => setGoScreen(is1 ? "setup" : "section1")}
        />
      </div>
    </WinWindow>
  );
}
