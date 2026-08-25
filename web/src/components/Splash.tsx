import { useEffect } from "react";
import { useApp } from "../AppContext";

export function Splash({
  title,
  credit,
  onDone,
  bgImage = "/images/sea_rig_3.jpg",
}: {
  title: string;
  credit?: string;
  onDone: () => void;
  bgImage?: string;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="win-window splash-window"
      style={{
        left: "50%",
        top: "48%",
        transform: "translate(-50%, -50%)",
        zIndex: 200,
      }}
    >
      <div
        className="splash-inner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,40,0.35), rgba(0,0,40,0.55)), url(${bgImage})`,
        }}
        onClick={onDone}
      >
        <div />
        <div className="splash-title">{title}</div>
        <div className="splash-credit">
          {credit ?? "Courtesy of Malampaya Project Team"}
        </div>
      </div>
    </div>
  );
}

export function WorkingDialog() {
  const { setGoScreen, patchGo } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      patchGo({ hasRun: true });
      setGoScreen("setup");
    }, 1800);
    return () => clearTimeout(t);
  }, [setGoScreen, patchGo]);

  return (
    <div className="msgbox-backdrop">
      <div className="msgbox working-modal">
        <div className="win-titlebar">
          <span className="win-titlebar-text">GOFLOW</span>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 12 }}>Calculating pressure / temperature losses…</div>
          <div
            style={{
              height: 18,
              border: "2px inset #c0c0c0",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "70%",
                background: "linear-gradient(90deg, #000080, #1084d0)",
                animation: "pulse 0.8s infinite alternate",
              }}
            />
          </div>
          <div className="caption-note" style={{ marginTop: 12 }}>
            Museum mode: loading canned Demosum2 results
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { from { width: 40%; } to { width: 90%; } }`}</style>
    </div>
  );
}
